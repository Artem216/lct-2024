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
            s3_url = task['s3_url']
            status = task['status']
            user_id = task['user_id'] 


            res = await add_response(task_id, s3_url, user_id)
    except Exception as ex:
        logger.info(ex)

    finally:
        logger.log("Stop")

if __name__ == "__main__":
    asyncio.run(consume())
