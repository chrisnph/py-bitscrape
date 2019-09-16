import time
import schedule

from controllers.scraper.main import Scraper

def start_scraper():
    Scraper().init()

schedule.every(1).seconds.do(start_scraper)

while True:
    schedule.run_pending()
    time.sleep(1)