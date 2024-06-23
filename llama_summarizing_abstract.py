import requests
import json
import re
import numpy as np

SERVER = 'http://localhost:11434/api/generate'

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

MEETING = 'Detect the main topic of the text and write associations to it. Associations should be physical objects and easy to draw it. List objects separated by commas. Before listing, write "OBJECTS". \n\nTEXT:\n'

def summarizing_text(text: str, num_tags: int = 3) -> str:

    data = {"model": "llama3", "prompt": MEETING + text, "options": {"temperature": 0.7, "num_predict": -1, "top_k": 80, "mirostat": 2}}

    def process(ans: str) -> str:
        ans = ans.split('OBJECTS:')[-1]
        ans = re.sub(r'[^a-zA-z, ]', '', ans.replace('\n', '')).lower()
        ready_tags = []
        for i in ans.split(','):
            if len(i) == 0 or i.count(' ') == len(i):
                continue
            else:
                while not(i[0].isalpha()):
                    i = i[1:]
                while not(i[-1].isalpha()):
                    i = i[:-1]
                ready_tags += [i]

        ans = ','.join(list(set(ready_tags)))
        while not(ans[0].isalpha()):
            ans = ans[1:]
        while not(ans[-1].isalpha()):
            ans = ans[:-1] 
        return ans

    response : requests.Response = requests.post(SERVER, headers = headers, data = json.dumps(data))
    if response.status_code != 200:
        print('ERROR')
    else:
        ans = ''
        for obj in response.content.decode('utf-8').split('\n')[:-1]:
            ans += (json.loads(obj)['response'])

        ans = np.array(process(ans).split(','))
        np.random.shuffle(ans)
        return ','.join(ans[:num_tags])
