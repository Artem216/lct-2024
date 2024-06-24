from aiokafka import AIOKafkaProducer
import asyncio
import json
import logging

from schemas.predict_schemas import PredictRequest, PredictRequestFile, Img2ImgRequest

from schemas.predict_schemas import product_map

from config import logger

from services.find_service import get_card
import io

import base64

async def send_task(task_id : int, predict_data : PredictRequest, user_id: int):
    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    await producer.start()
    if predict_data.product != "":
        new_product = product_map[predict_data.product]
    else:
        new_product = ""
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "prompt" : predict_data.prompt,
            "width" : predict_data.width,
            "height" : predict_data.height,
            "goal" : predict_data.goal,
            "product" : new_product,
            "image_type" : predict_data.image_type,
            "colour" : predict_data.colour,
            "holiday": predict_data.holiday,
            "is_abstract" : predict_data.is_abstract,
            "use_llm" : predict_data.use_llm
            }
        
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
    
        await producer.stop()


async def send_file_task(task_id : int, predict_data : PredictRequestFile, user_id: int, file ):

    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    await producer.start()
    if predict_data.product != "":
        new_product = product_map[predict_data.product]
    else:
        new_product = ""
    logger.info(file)
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "prompt" : predict_data.prompt,
            "width" : predict_data.width,
            "height" : predict_data.height,
            "goal" : predict_data.goal,
            "product" : new_product,
            "image_type" : predict_data.image_type,
            "colour" : predict_data.colour,
            "holiday": predict_data.holiday, 
            "file" : file,
            "is_abstract" : predict_data.is_abstract,
            "use_llm" : predict_data.use_llm
            }
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
        await producer.stop()



async def send_img2img_task(task_id : int, img2img_data : Img2ImgRequest, user_id: int):

    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    if img2img_data.product != "":
        new_product = product_map[img2img_data.product]
    else:
        new_product = ""

    req = await get_card(img2img_data.photo_id)
    
    await producer.start()
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "prompt" : img2img_data.prompt,
            "width" : img2img_data.width,
            "height" : img2img_data.height,
            "goal" : img2img_data.goal,
            "product" : new_product,
            "holiday": img2img_data.holiday,
            "image_type" : img2img_data.image_type,
            "colour" : img2img_data.colour, 
            "photo_s3_url" : req.child_s3_url,
            "is_abstract" : img2img_data.is_abstract,
            "use_llm" : img2img_data.use_llm
            }
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
        await producer.stop()


async def send_img2img_file_task(task_id : int, predict_data : PredictRequest, user_id: int, file_photo: io.BytesIO):
    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    if predict_data.product != "":
        new_product = product_map[predict_data.product]
    else:
        new_product = ""

    
    await producer.start()
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "prompt" : predict_data.prompt,
            "width" : predict_data.width,
            "height" : predict_data.height,
            "goal" : predict_data.goal,
            "holiday": predict_data.holiday,
            "product" : new_product,
            "image_type" : predict_data.image_type,
            "colour" : predict_data.colour, 
            "use_llm" : predict_data.use_llm,
            "is_abstract" : predict_data.is_abstract,
            "file_photo" : base64.b64encode(file_photo.getvalue()).decode('utf-8')
            }
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
        await producer.stop()