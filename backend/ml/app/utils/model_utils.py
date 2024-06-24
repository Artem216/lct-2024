# utils/model_utils.py

import os
import io

from utils.s3_utils import get_minio_client

from .lamma_prompts import generate_prompt
from config import logger

# from .translation_utils import translator_translate

from diffusers import DiffusionPipeline, StableDiffusionPipeline
import torch
import peft
import transformers
# from translate import Translator
from rembg import remove
import numpy as np
from tqdm.notebook import tqdm

from .lama_dataset import prompt_dataset_pipeline

from .translator import translate

from transformers import pipeline


class Model:
    def __init__(self, weights, name_model='runwayml/stable-diffusion-v1-5'):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        logger.info(self.device)
        self.name_model = name_model
        self.load_model(weights)
        self.trans_pipe = pipeline("translation", model="Helsinki-NLP/opus-mt-ru-en")

    def load_model(self, weights):
        self.pipe = StableDiffusionPipeline.from_pretrained(self.name_model, torch_dtype=torch.float16).to(self.device)
        self.pipe.safety_checker = None
        self.pipe.requires_safety_checker = False
        
        self.clear_adapters()

        for i, path_weights in enumerate(weights.keys()):
            self.pipe.load_lora_weights(path_weights, adapter_name=f'{i}')
            
        # Set new adapters and weights
        self.pipe.set_adapters([f'{i}' for i in range(len(weights))], adapter_weights=list(weights.values()))
        self.model = self.pipe
        
    def clear_adapters(self):
        if hasattr(self.pipe, 'adapter_manager'):
            self.pipe.adapter_manager.clear_adapters()
    
    def translator(self ,text: str) -> str:
        return self.trans_pipe(text)[0]['translation_text']

    # def translator(self, prompt):
    #     translator = Translator(from_lang="ru", to_lang="en")
    #     result = translator.translate(prompt)
    #     return result
    
    def remove_bg(self, img):
        return remove(img)
        
    def save_image_to_bytes(self, image):
        """Сохраняет изображение в байтовый поток."""
        
        byte_io = io.BytesIO()
        image.save(byte_io, format='PNG')
        byte_io.seek(0)
        return byte_io

    
    def get_image(self,
                  prompt,
                  negative_prompt=None):
        
        prompt_new = self.translator(prompt)
        prompt_ = ','.join([obj.strip() for obj in prompt_new.split(',')]) +',isometric,claymorphism,3d render,icon,web icon'
        negative_prompt='pig, wool, draw, noise, real, text, number, picture, texture, detail'
        with torch.no_grad():
            img = self.model(prompt_, 
                             negative_prompt=negative_prompt).images[0]
        rm_img = self.remove_bg(img)
        return self.save_image_to_bytes(rm_img), prompt_new

class Request:
    def __init__(self, model):
        self.model = model
        self.user_prompt = ""
        
    def create_imgs(self,
                    n=1,
                    prompt=None,
                    channel=None,
                    product=None, 
                    dataset=None,
                    use_llm=None):
        # only prompt
        if prompt and (not product) and (not dataset):
            self.user_prompt = [prompt for i in range(n)]
            logger.info(self.user_prompt)

        # only product
        elif product and (not prompt) and (not dataset):
            if use_llm:
                self.user_prompt = [generate_prompt(product)]
                logger.info(self.user_prompt)
            else:
                prompt_category = self.categories_prompts[product]
                self.user_prompt = np.random.choice(prompt_category, n)
                logger.info(self.user_prompt)

        # product and prompt
        elif prompt and product and (not dataset):
            # if use_llm:
            #     prompt_category = [generate_prompt(product)]
            # else:
            #     prompt_category = self.categories_prompts[product]
            #     prompt_category = list(np.random.choice(prompt_category, 5 // 2))
            # prompt_user = [prompt for i in range(5 - 5//2)]
            self.user_prompt = [prompt]
            logger.info(self.user_prompt)
        elif dataset:
            self.user_prompt = [prompt_dataset_pipeline(dataset)]
            logger.info(self.user_prompt)

        # only prompt
        else:
            self.user_prompt = [prompt for i in range(n)]
            logger.info(self.user_prompt)
        return self.model.get_image(self.user_prompt[0])
            
    categories_prompts = {
        'currency_exchange': ['dollar,dollar bill,arrow,coin,rubble,exchange,currency exchange',
                         'ATM machine,blue,dollar,coin,gold goin,exchange,currency exchange',
                         'dollar,euro,ruble,currency notes from different countries,exchange',
                         'currency exchange,rasing chart,upwise trend,orange line,exchange rate,banknote',
                         'globe,blue planet,Earth,arrow,line,exchange,currency exchange',
                         'globe,planet,arrow,line,money exchange,swap,change,exchange,currency exchang,orange,light blue,deep blue,white',
                         'gold bag of money,banknote,dollars,money,currency exchange,ruble,euro,exchange rate,orange,light blue,deep blue,white',
                         'blue chart,line,rising trend,green arrow,profitable,bag of money,currency exchange,exchange,white,orange',
                         'chart,banknote,line,increasing trend,green arrow,profitable,blue bills,pack of blue bills,silver coins,currency exchange,exchange',
                         'coin,banknote,exchange,currency exchange,profitable,chart,increasing trend,percentage sign,green line',
                         'different currencies, banknotes, calculator, dynamic exchange rate figures,currency exchange, exchange'],
    
        'credit': ['stack,stack of coins,stack of bills,credit,profitably,loan,loan approval',
                   'handshake,contract,beneficial,bills,loan,loan approval',
                   'green confirmation check mark,loan,loan approval,bundle of bills,banknotes',
                   'contract,confirmation tick,handshake,loan,loan approval,bag of money',
                   'house keys,check mark,confirmation,loan,loan approval',
                   'travel,vacation,sea,sun,beach,beach umbrella,towel,beach flip-flops,blue,light blue,orange,white,green,yellow',
                   'travel,weekend,sea,sun,beach,chaise longue,beach chair,beach ball,blue,light blue,orange,white,green,yellow',
                   'student loan,education,university,graduate hat',
                   'credit,tuition,education,graduate hat,book,pen,blue,orange,white,black',
                   'new year,gift box,red box,white ribbon bow,Santa claus hat,snow,snowdrifts',
                   'new year,gift box,blue box,Christmas tree,snow,snowdrifts'],
    
        'card': ['card,gazprombank logo,mobile phone,smartphone,black phone',
                  'card,gazprombank logo,white smartphone,open screen,blue screen',
                  'credit card,gazprombank logo,gazpromcard,percent,percent sign,profitably,card',
                  'credit card,gazprombank logo,gift box,blue box,Christmas tree,snow,snowdrifts',
                  'credit card,gift box,orange box,white ribbon bow,percent sign,profitably',
                  'card,gazprombank logo,confetti,banknotes,gold coins',
                  'card,gazprombank logo,holiday,lightnings,festive hat,blue,white,silver,light blue',
                  'cards,two cards,white,black,silver chip,proection, 3D',
                  'cards,two cards,silver,gold,silver chip,proection, 3D',
                  'card,payment,terminal,ATM machine,black,while,silver',
                  'card,payment,terminal,contactless payment,online payment,attach the card to the terminal'],
        'accounts_deposits': ['safe,safety,safe locker,gold,gold coins',
                         'safe,safety,safe locker,silver,silver coins',
                         'safe,safety,safe locker,pack of banknotes,blue,money,bills',
                         'bank,money,bank building,coin,banknote,blue,white,light blue,orange',
                         'bank,bank building,banknotes,confetti,profitably',
                         'golden piggy bank,banknotes',
                         'golden piggy bank,coins',
                         'locker,lock,money lock,bill lock,coin lock,blue',
                         'blue shield,banknotes,money',
                         'silver shield,banknotes,money'],

        'mortgage': ['house,river,tree,windows,stairs,blue sky,white house',
                    'sun,white house,without doors,without windows,lightnings,confetti',
                    'grey house key,gift,red ribbow bow',
                    'grey house key,gift,red ribbow bow,confetti',
                    'yellow house key,gift,red ribbow bow',
                    'blue house,black roof,building,tree',
                    'two buildings,tree',
                    'house,roof,ribbon bow,gift',
                    'orange house,blue roof,white ribbon bow'],

        'autocredit': ['blue car,percent sign,red ribbon bow',
                       'two cars,confetti,gift,red,blue,silver',
                       'two cars,confetti,gift,orange,blue,gold',
                       'three cars,three,percent sign,percent,orange,black,white,blue,light blue',
                       'car,red car,fast driving,smoke,orange lightning',
                       'car,blue car,fast driving,smoke,silver confetti',
                       'black steering wheel,big gift box,red gift box,ribbon bow',
                       'black steering wheel,gold silver confetti,orange ribbon bow',
                       'black steering wheel,blue percent sign,profitably',
                       'car,percent sign'],

        'insurance': ['two shields,shield,blue shield,orange shield',
                        'safe,safety,two hands,promise, care, hand,hands in the begging pose',
                        'protection, protective sign,shield,blue',
                        'shiled,silver shield,car,protection',
                        'shield,blue shield,house,protection',
                        'black steering wheel,gold shield,protection',
                        'black steering wheel,blue shield,protection',
                        'shield,money,coin,banknotes,bills',
                        'locker,shield,safety,protection,blue,light blue,orange,white']
    }