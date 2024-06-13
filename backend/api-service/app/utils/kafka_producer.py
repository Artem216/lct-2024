from aiokafka import AIOKafkaProducer
import asyncio
import json
import logging

from schemas.predict_schemas import PredictRequest

from schemas.predict_schemas import product_map

from config import logger

async def send_task(task_id : int, predict_data : PredictRequest, user_id: int):
    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    await producer.start()
    
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "prompt" : predict_data.prompt,
            "width" : predict_data.width,
            "height" : predict_data.height,
            "goal" : predict_data.goal,
            "tags" : [el.tag for el in predict_data.tags] ,
            "product" : product_map[predict_data.product],
            "image_type" : predict_data.image_type,
            "colour" : predict_data.colour
            }
        
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
    
        await producer.stop()


async def send_image_to_image_task(task_id : int, predict_data : PredictRequest, user_id: int, s3_url: str):
    # TODO
    pass
    # producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    # await producer.start()
    
    # try:
    #     task = {
    #         "id" : task_id,
    #         "user_id" : user_id,
    #         "s3_url" : s3_url,
    #         "prompt" : predict_data.prompt,
    #         "width" : predict_data.width,
    #         "height" : predict_data.height,
    #         "goal" : predict_data.goal,
    #         "tags" : [el.tag for el in predict_data.tags] 
    #         }
    #     logger.info(f"Sending task to Kafka: {task}")
    #     await producer.send_and_wait('predict_image_to_image', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    # finally:
    
    #     await producer.stop()
