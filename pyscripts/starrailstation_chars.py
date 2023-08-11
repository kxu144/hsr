import json
import requests
from bs4 import BeautifulSoup
import re


DIR = "https://starrailstation.com/"
PUBLIC = "hsr-react/public/"

def getEnd(str):
    return re.search('/([^/]*)$', str).group(1)

def getCharacters(char_class="a7916"):
    response = requests.get(DIR + "en/characters")
    if response.status_code != 200:
        print("Error fetch chars", response.status_code)
        return
    soup = BeautifulSoup(response.text, 'html.parser')
    res = []
    for div in soup.findAll('a', {'class': char_class}, href=True):
        res.append(getEnd(div['href']))
    return res

def scrapeImg(link):
    response = requests.get(DIR + link)
    if response.status_code != 200:
        print("Error fetch img", response.status_code)
        return
    return response.content

def scrapeChar(link, name_class="a4041 afbc8", icon_class="ac39b a6602", bg_class="a4f9a", element_class="pc-only-elem", path_class="label a503a a4041 ae3be"):
    response = requests.get(DIR + "en/character/" + link)
    if response.status_code != 200:
        print("Error fetch link", link, response.status_code)
        return
    soup = BeautifulSoup(response.text, 'html.parser')
    name = soup.find('h1', {'class': name_class}).text
    icon = soup.find('img', {'class': icon_class}).get('src')
    bg = soup.find('img', {'class': bg_class}).get('src')
    element = soup.find('span', {'class': element_class}).text
    path = soup.find('div', {'class': path_class}).find('span', recursive=False).text

    with open(PUBLIC + "img/chars/icon/" + getEnd(icon), 'wb') as f:
        f.write(scrapeImg(icon))
    with open(PUBLIC + "img/chars/bg/" + getEnd(bg), 'wb') as f:
        f.write(scrapeImg(bg))

    char = {
        'name': name,
        'icon': getEnd(icon),
        'bg': getEnd(bg),
        'element': element,
        'path': path,
    }
    print(json.dumps(char, indent=2))

        


chars = getCharacters()
for char in chars:
    scrapeChar(char)