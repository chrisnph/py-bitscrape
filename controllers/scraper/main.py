from bs4 import BeautifulSoup, SoupStrainer
import requests
import time
import math
from time import strftime
from datetime import datetime
import json

# calculate start time
stime = time.time()

class Scraper():

    data = [{}]
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    }

    # main init functions
    def init(self):
        thread_parsed = self.fetch_json()
        self.data = self.scrape_threads()
        self.dump_json()

        # overall scrape time
        print('\nTotal scrape time / page: {:.1f}s\n\n'.format(math.floor(time.time() - stime)))

    # load json data to variable
    def fetch_json(self):
        with open('controllers/scraper/threads.json', 'r') as json_file:
            try:
                print('reading json file ...')
                data = json.load(json_file)
            except Exception as e:
                print(e)
                print('empty json, setting initial data ...')
                data = [{}]
            finally:
                print('unmounting file ...\n\n')
                json_file.close()
                return data
    
    # write / update json file
    def dump_json(self):
        # print(self.data)
        with open('threads.json', 'w', errors='ignore') as json_file:
            try:
                json.dump(self.data, json_file, sort_keys=False, indent=4, separators=(',', ': '))
            except Exception as e:
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
    def scrape_threads(self):
        url = 'https://bitcointalk.org/index.php?board=159'
        strainer = SoupStrainer('td', class_='windowbg')

        res_threads = self.scrape_init(url, strainer)

        threads = res_threads.find_all('span', id=lambda x: x and x.startswith('msg_'))

        # total threads per page
        threads_total = len(threads)
        # current parsed thread count
        threads_parsed_count = 0

        print('Total threads: {}\n'.format(len(threads)))
        for thread in threads:
            threads_parse_time = time.time()
            threads_parsed_count += 1
            thread_title = thread.a.text
            thread_href = thread.a['href']
            thread_info = str(self.getInfo(thread_href))

            # appendding data into list
            self.data.append({
                'title': thread_title,
                'source': thread_href,
                'algo': '',
                'info': thread_info.replace('"', "'"),
                'author': '',
                'Post Date': datetime.now().strftime('%#m/%#d/%Y %#H:%#M:%#S %p')
            })
            print('Parsing {} of {} threads ({:.1f}s)'.format(threads_parsed_count, threads_total, time.time() - threads_parse_time))

        # filter to remove empty first dict
        return list(filter(None, self.data))

    def getInfo(self, thread_href):
        req_thread = requests.get(thread_href, self.headers)
        thread_strainer = SoupStrainer('td', class_='td_headerandpost')
        thread_info = BeautifulSoup(req_thread.content, 'lxml', parse_only=thread_strainer)
        # print('\n\n{}\n\n'.format(thread_info))
        # thread_info = str(thread_info)
        return thread_info.find('div', class_='post')