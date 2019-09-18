import time
import schedule

from controllers.scraper.main import Scraper

def start_scraper():
    Scraper().init()

try:
    # setting 1 sec for immediate start
    schedule.every(0).seconds.do(start_scraper)
except Exception as e:
    print(e)
    schedule.every(0).seconds.do(start_scraper)
finally:
    while True:
        schedule.run_pending()
        time.sleep(1)