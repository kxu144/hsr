import re
import json
import requests


def getAllOValues():
    URL = 'https://starrailstation.com/static/js/main.ce34ec5f.js'

    content_text = requests.get(URL).text

    o_values = {}
    pattern = 'JSON\.parse\(.*?\)'

    results = re.findall(pattern, content_text)
    for result in results:
        if 'Live' in result:
            dict_ = json.loads(result[result.find("{"): result.find('}')+1])
            for key in dict_:
                sub_key = key.split('/')
                if sub_key[0].lower() not in o_values:
                    o_values[sub_key[0].lower()] = {}
                o_values[sub_key[0].lower()][sub_key[1].lower().replace('v', '', 1)] =  dict_[key]

    return o_values

print(getAllOValues())