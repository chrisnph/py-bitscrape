from bs4 import BeautifulSoup, SoupStrainer
import requests
import time
import math
from time import strftime
from datetime import datetime
import json

# calculate start time

class Scraper():

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    }

    # possible algo list
    algos = [
        'SHA256',
        'SHA-256',
        'Scrypt',
        'ScryptAdaptive',
        'Scrypt Adaptive',
        'ScryptJane',
        'Scrypt-Jane',
        'ScryptChacha',
        'Scrypt-Chacha',
        'X11',
        'X13',
        'X15',
        'Groestl',
        'Quark',
        'Qubit',
        'NeoScrypt',
        'SHA3',
        'SHA-3',
        'Keccak',
        'Blake256',
        'Blake-256',
        'Ethash',
        'Lyra2',
        'Lyra2REv2',
        'Chacha'
    ]

    # main init functions
    def init(self):
        stime = time.time()

        data = [{}]
        self.data = self.scrape_threads(data)
        self.dump_json()

        # overall scrape time
        print('\nTotal scrape time / page: {:.1f}s\n\n'.format(math.floor(time.time() - stime)))

    # update json file
    def dump_json(self):
        with open('client/src/components/DataTables/threads.json', 'r+') as json_file:
            try:
                json_file.seek(0)
                json.dump(self.data, json_file, sort_keys=False, indent=4, separators=(',', ': '))
                json_file.truncate()
            except Exception as e:
                # on dump / file write error
                print(e)
                pass
            finally:
                json_file.close()
    
    
    # set headers & strainers, returns requests 
    def scrape_init(self, url, strainer):
        req = requests.get(url, self.headers)
        res = BeautifulSoup(req.content, 'lxml', parse_only=strainer)
        return res

    # scrapes total threads & summary
    def scrape_threads(self, data):
        url = 'https://bitcointalk.org/index.php?board=159'

        # threads_strainer = SoupStrainer('td', class_='windowbg')
        threads_strainer = SoupStrainer('table', class_='bordercolor')

        # requests for all threads rows
        res_body = self.scrape_init(url, threads_strainer)

        # find main table body of threads
        threads = res_body.select('table:nth-of-type(3) > tr')

        # total threads per page
        threads_total = len(threads)

        # current parsed thread count
        threads_parsed_count = 0

        # iterate over rows of threads
        for thread in threads:
            threads_parse_time = time.time()
            
            # loop through row if title exist
            if thread.find('span', id=lambda x: x and x.startswith('msg_')):
                
                # skip pinned post by admin
                if thread.find(class_='windowbg3'):
                    threads_total -= 1
                    continue

                threads_parsed_count += 1
                thread_title = thread.find('span', id=lambda x: x and x.startswith('msg_')).a.text
                thread_href = thread.a['href']
                thread_info = str(self.getInfo(thread_href)).replace('"', "'")
                thread_author = str(thread.findAll('td',  attrs={ 'class': 'windowbg2', 'width': '14%'})[0].a).replace('"', "'")
                # thread_algo = str(', '.join(self.getAlgo(thread_info)))
                thread_algo = self.getAlgo(thread_info)
                thread_date = " ".join(thread.find('td', class_='lastpostcol').span.text.split())

                # appendding into data list
                data.append({
                    'title': thread_title,
                    'source': thread_href,
                    'info': thread_info,
                    'algo': thread_algo,
                    'author': thread_author,
                    'Post Date': thread_date
                })
                print('Parsing {} of {} threads ({:.1f}s)'.format(threads_parsed_count, threads_total, time.time() - threads_parse_time))

            # skip row if row format is not a thread
            else:
                threads_total -= 1
                print('Skipped non thread row {} from threads\n'.format(threads_parsed_count, threads_total))
                continue

        # filter to remove first empty list
        return list(filter(None, data))

    # get first header post in thread (author)
    def getInfo(self, thread_href):
        thread_strainer = SoupStrainer('td', class_='td_headerandpost')
        thread_info = self.scrape_init(thread_href, thread_strainer)
        return thread_info.find('div', class_='post')

    # get possible algorithms
    def getAlgo(self, thread_info):
        possible_algo = []
        for algo in self.algos:
            if algo.lower() in thread_info.lower():
                possible_algo.append(algo)
            else:
                pass

        # mark as unknown if possible algo found
        if len(possible_algo) < 1:
            possible_algo = ['unknown']
        
        return possible_algo
