from aiokafka import AIOKafkaProducer
import asyncio
import json
import logging

from schemas.predict_schemas import PredictRequest

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
            "tags" : [el.tag for el in predict_data.tags] 
            }
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('predict', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
    
        await producer.stop()
