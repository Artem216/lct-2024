from aiokafka import AIOKafkaConsumer
import asyncio
import json

from config import cfg, logger

from services.predict_service import add_response



async def consume(consumer: AIOKafkaConsumer):
    

    try:
        logger.info("Starting Kafka consumer")
        async for msg in consumer:
            logger.info("Message resive")
            task = json.loads(msg.value.decode('utf-8'))

            task_id = task['id']
            child_s3_url = task['child_s3_url']
            parent_s3_url = task['parent_s3_url']
            x = task['x']
            y = task['y']
            status = task['status']
            child_w = task['child_w']
            child_h = task['child_h']
            user_id = task['user_id']
            colour= task['colour'] 
            prompt = task['prompt']


            res = await add_response(task_id, 
                                     child_s3_url, 
                                     parent_s3_url, 
                                     x, 
                                     y, 
                                     user_id, 
                                     child_w, 
                                     child_h, 
                                     colour,
                                     prompt
                                     )

    except Exception as ex:
        logger.info(ex)

    finally:
        logger.info("Stop")

if __name__ == "__main__":
    asyncio.run(consume())
