# download the model https://github.com/ollama/ollama
# run model on terminal ollama run llama3

# %%time

# from ollama import Client

# client = Client(host='http://localhost:11434')
# response = client.chat(model='saiga', messages=[
#   {
#     'role': 'user',
#     'content': 'Why is the sky blue?',
#   },
# ])

import requests
import json
import re

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

some_objects = {
    'nature': ['blue lake,water,yellow sun,sun,sand,tree'],
    'food': ['plate,round plate,red apple,green apple,banana'],
    # 'study': ['grey laptop,book,pencil,red book,hands,typing'],
    # 'animals': ['two cats,orange cat,gray cat,tails,stripes,sitting,cat']
}

CATEGORY = 'card'
other_tags = list(some_objects.keys())
MEETING = 'Write associations with each topic. Associations should be physical objects and easy to draw it. For example:\n\n'
for tag in other_tags:
    MEETING += tag + ': ' + '\n'.join(some_objects[tag][:2]) + '\n\n'
MEETING += 'Your topic:\n' + CATEGORY + ':'
print(MEETING)

data = {"model": "llama3", "prompt": MEETING, "options": {"temperature": 0.7, "num_predict": -1, "top_k": 80, "mirostat": 2}}

def process(ans, splitter):
    ready = []
    for i in ans.split(splitter):
        if len(i) > 30:
            continue
        else:
            ready += [i]
    return re.sub(r'[^a-zA-Z, ]', '', ','.join(ready).replace('\n', '')).lower()

response : requests.Response = requests.post('http://localhost:11434/api/generate', headers = headers, data = json.dumps(data))
if response.status_code != 200:
    print('ERROR')
else:
    ans = ''
    for obj in response.content.decode('utf-8').split('\n')[:-1]:
        ans += (json.loads(obj)['response'])

    ans += ',' + ','.join(CATEGORY.split(' '))
    version1, version2 = process(ans, ','), process(ans, '*')
    print()
    print(version2) if version1 == '' else print(version1)
