from aiokafka import AIOKafkaProducer
import asyncio
import json
import logging

from schemas.predict_schemas import PredictRequest, PredictRequestFile

from schemas.predict_schemas import product_map

from config import logger

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
            "use_llm" : predict_data.use_llm
            }
        
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
    
        await producer.stop()


async def send_file_task(task_id : int, predict_data : PredictRequestFile, user_id: int, file ):

    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    await producer.start()
    logger.info(file)
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "prompt" : predict_data.prompt,
            "width" : predict_data.width,
            "height" : predict_data.height,
            "goal" : predict_data.goal,
            "product" : product_map[predict_data.product],
            "image_type" : predict_data.image_type,
            "colour" : predict_data.colour, 
            "id_user_from_csv" : predict_data.id_user_from_csv,
            "cluster_name" : predict_data.cluster_name,
            "file" : file,
            "use_llm" : predict_data.use_llm
            }
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
        await producer.stop()
