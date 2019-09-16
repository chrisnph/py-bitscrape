from django.shortcuts import render

# fetch from json file and render to index

def index(request):
    threads = filter(None,Scraper().thread_parsed)
    return render(request, 'home/index.html', {'threads': threads})
