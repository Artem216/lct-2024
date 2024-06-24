
import requests
import json
import re
import hashlib
import sys
import datetime
import random
import numpy as np

LLAMA_SERVER = 'http://91.224.86.180:11434/api/generate'
MODEL = 'llama3'
TEMPERATURE = 1.2  # отвечает за длину и вариативность генерации

salt = 'lct_gazprombank_june_2024_picture_generation'

from config import logger

def exp3_hash(arg, salt):
    sha1 = hashlib.sha1()
    sha1.update(salt)
    sha1.update(arg)
    res = sha1.hexdigest()[:16]
    return int(res, 16) % 100

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

some_objects = {
    'nature': ['blue lake,water,yellow sun,sun,sand,green tree'],
    'food': ['plate,round plate,red apple,green apple,banana']
}

necessary_objects = {'currency exchange': ',coin',
                    'autocredit': ',car',
                    'mortgage': ',house',
                    'card': ',card,gazprombank logo',
                    'accounts deposits': ',coin',
                    'credit': ',coin',
                    'insurance': ',shield'}

other_tags = list(some_objects.keys())
MEETING = 'Write associations with each topic. Associations should be physical objects and easy to draw it. It is necessary to add colors to objects.\
     Do not write anything except for sequence of words!. For example:\n\n'
for tag in other_tags:
    MEETING += tag + ': ' + '\n'.join(some_objects[tag][:2]) + '\n\n'

def process(ans, splitter):
    ready = []
    for i in ans.split(splitter):
        if len(i) > 20:
            continue
        else:
            ready += [i]
    return re.sub(r'[^a-zA-Z, ]', '', ','.join(ready).replace('\n', '')).lower()

def generate_prompt(category: str, num_tags: int = 3) -> str:
    global MEETING
    CATEGORY = ' '.join(category.split('_'))
    MEETING += 'Your topic:\n' + CATEGORY + ':'
    
    data = {"model": MODEL, "prompt": MEETING, "options": {"TEMPERATURE": 1.2, "num_predict": -1, "top_k": 80, "mirostat": 2}}
    
    response : requests.Response = requests.post(LLAMA_SERVER, headers = headers, data = json.dumps(data))
    if response.status_code != 200:
        print('ERROR')
    else:
        ans = ''
        for obj in response.content.decode('utf-8').split('\n')[:-1]:
            ans += (json.loads(obj)['response'])
        
        ans = ans.lower().split(CATEGORY)[-1]

        version1, version2 = process(ans, ','), process(ans, '*')
        version1 += ',' + ','.join(CATEGORY.split(' '))
        version2 += ',' + ','.join(CATEGORY.split(' '))

        def choose_tags(text):
            tags = text.split(',')
            ready_tags = []
            for i in tags:
                if len(i) == 0 or i.count(' ') == len(i):
                    continue
                else:
                    while not(i[0].isalpha()):
                        i = i[1:]
                    while not(i[-1].isalpha()):
                        i = i[:-1]
                    ready_tags += [i]
            
            ready_tags = list(set(ready_tags))
            if len(ready_tags) > num_tags:
                ready_tags = np.array(ready_tags)
                np.random.shuffle(ready_tags)
                return ','.join(ready_tags[:num_tags].tolist())
            else:
                return ','.join(ready_tags)

        if len(version1) > len(version2):
            version = choose_tags(version1)
        else:
            version = choose_tags(version2)
        
        if exp3_hash(str(version).encode('utf-8'), str(salt).encode('utf-8')) < 50 and necessary_objects[CATEGORY][1:] not in version:
            version += necessary_objects[CATEGORY]
        logger.info(version)
        return version