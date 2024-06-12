from aiokafka import AIOKafkaProducer
import asyncio
import json
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def send_predict(task_id : int, status: str, s3_url : str, user_id : int):
    """
    Отправка информации о завершенном задании в Kafka.

    Эта асинхронная функция отправляет сообщение в Kafka с информацией о завершенном задании.

    Args:
        task_id (int): Уникальный идентификатор задания.
        status (str): Статус завершения задания (например, "complete").
        s3_url (str): URL-адрес изображения, загруженного в S3.
        user_id (int): Уникальный идентификатор пользователя, для которого было выполнено задание.
    """
    producer = AIOKafkaProducer(bootstrap_servers='kafka:29091')
    await producer.start()
    
    try:
        task = {
            "id" : task_id,
            "user_id" : user_id,
            "s3_url" : s3_url,
            "status" : status
            }
        logger.info(f"Sending task to Kafka: {task}")
        await producer.send_and_wait('confirm', key=str(task_id).encode('utf-8'), value=json.dumps(task).encode('utf-8'))
    
    finally:
    
        await producer.stop()
