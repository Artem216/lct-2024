import requests
import json
import re
import random
import numpy as np

def generate_prompt_dataset(data):

    data = data.to_dict()
    new_data = {}

    if np.isnan(data['gender']) == False:
        new_data['gender'] = ['man', 'woman'][int(data['gender'])]
    
    new_data['age'] = 'age ' + str(int(data['age']))
    
    if np.isnan(data['app_vehicle_ind']) == False:
        new_data['app_vehicle_ind'] = 'have car'
    else:
        new_data['app_vehicle_ind'] = 'have not car'

    if np.isnan(data['cnt_tr_all_3m']) == False:
        new_data['user_status'] = 'not active' if data['cnt_tr_all_3m'] < 8 else ('very active' if data['cnt_tr_all_3m'] > 27 else 'moderately active')
        new_data['user_status'] += ' user of bank'

    if np.isnan(data['cnt_tr_buy_3m']) == False:
        new_data['purchases'] = 'low' if data['cnt_tr_buy_3m'] < 6 else ('high' if data['cnt_tr_buy_3m'] > 26 else 'medium') 
        new_data['purchases'] += ' number of purchases'
    
    if np.isnan(data['cnt_tr_mobile_3m']) == False:
        new_data['mobile'] = 'have' if data['cnt_tr_mobile_3m'] > 0 else 'have not' 
        new_data['mobile'] += ' expenses on mobile communications'

    if np.isnan(data['cnt_tr_oil_3m']) == False:
        new_data['gas_station'] = 'have' if data['cnt_tr_oil_3m'] > 0 else 'have not'
        new_data['gas_station'] +=  ' expenses for gas station'
    
    if np.isnan(data['cnt_tr_oil_3m']) == False:
        new_data['salary'] = 'low' if data['sum_zp_12m'] < 122298 else ('high' if data['sum_zp_12m'] > 867959 else 'medium') 
        new_data['salary'] += ' salary'

    INFO_USER = ','.join([val for _, val in new_data.items()])
    
    MEETING = 'You are writing prompts for diffusion model to generate selling images for bank. You are given information about user.\
    Write what physical objects can be located in the picture. Use user information. For example, if this is an active user with a large salary, offer him the topic of investment.\
    If the user has a car, offer to insure the car. If this is an inactive user, offer favorable interest rates for a credit card. Objects must have a color specified.\
    If a gender is specified, choose colors that match that gender. It is also worth paying attention to the user’s expenses on communications and refueling.\
    Write only the sequence of words, in the start of sequence write word "PROMPT" and in the end write word "END"!.\n\n\
    For example\n\n\
    info: man,age 52,have car,very active user of bank,high number of purchases,have expenses on mobile communications,have expenses for gas station,high salary\n\
    prompt: blue car,percent sign,car,percent\n\n\
    info: man,age 52,have car,very active user of bank,high number of purchases,have expenses on mobile communications,have expenses for gas station,high salary\n\
    prompt: blue car,percent sign,car,percent\n\n\
    info: woman,age 49,have not car,not active user of bank,low number of purchases,have not expenses on mobile communications,have not expenses for gas station,low salary\n\
    prompt: credit card,card,pink diamond,orange confetti\n\n'
    
    MEETING += 'your info: ' + INFO_USER + '\nprompt:'

    print(INFO_USER)
    # print(MEETING)
    
    data = {"model": "llama3", "prompt": MEETING, "options": {"temperature": 1.2, "num_predict": -1, "top_k": 80, "mirostat": 2}}
    
    response : requests.Response = requests.post('http://localhost:11434/api/generate', headers = headers, data = json.dumps(data))
    if response.status_code != 200:
        print('ERROR')
    else:
        ans = ''
        for obj in response.content.decode('utf-8').split('\n')[:-1]:
            ans += (json.loads(obj)['response'])
        
        ans = re.sub(r'[^a-zA-Z, ]', '', ans.split('PROMPT')[-1].split('prompt:')[-1].split("END")[0])

        def process(ans):
            array = ans.split(',')
            ready = []
            for i in array:
                if len(i) == 0 or i.count(' ') == len(i) or 'background' in i or 'man' in i or 'woman' in i:
                    continue
                else:
                    while not(i[0].isalpha()):
                        i = i[1:]
                    while not(i[-1].isalpha()):
                        i = i[:-1]
                    ready += [i]
            return ','.join(ready)
        
        print(process(ans))
