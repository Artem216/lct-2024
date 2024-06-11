from aiokafka import AIOKafkaConsumer
import asyncio
import json

from .model_utils import load_model, predict
from .s3_utils import upload_fileobj_to_s3, get_minio_client
from config import cfg, logger

from .kafka_producer import send_predict

async def consume():
    consumer = AIOKafkaConsumer(
        'predict',
        bootstrap_servers='kafka:29091',
        auto_offset_reset='latest'
    )

    model = load_model()

    await consumer.start()
    try:
        logger.info("Starting Kafka consumer")
        async for msg in consumer:
            task = json.loads(msg.value.decode('utf-8'))

            task_id = task["id"]
            user_id = task['user_id']
            prompt = task['prompt']
            width = task['width']
            height = task['height']
            goal = task['goal']
            tags = task['tags'] 


            logger.info(f"Received task status from Kafka: {task_id}")
            

            img = predict(model, prompt)
            

            bucket_name = cfg.bucket_name
            object_name = f"output_image{task_id}.png"
            url = upload_fileobj_to_s3(img, bucket_name, object_name, client=get_minio_client(cfg.S3_HOST, cfg.ACCESS_KEY, cfg.SECRET_KEY))

            await send_predict(task_id= task_id, status="complete", s3_url=url, user_id= user_id)
    finally:
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(consume())