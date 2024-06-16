from minio import Minio
from minio.error import S3Error
import os

import requests

from datetime import timedelta

from config import logger

def get_minio_client(endpoint, access_key, secret_key):
    """Создает и возвращает клиента MinIO."""
    return Minio(
        endpoint,
        access_key=access_key,
        secret_key=secret_key,
        secure=False  # Установите в True, если используете HTTPS
    )

def upload_fileobj_to_s3(file_obj, bucket_name, object_name, client=None):
    """
    Загружает объект-файл в S3 (MinIO) и возвращает ссылку на объект с указанным временем сгорания.

    Args:
        file_obj: Файл для загрузки.
        bucket_name: Имя бакета.
        object_name: Имя объекта в бакете.
        client: Клиент MinIO.

    Returns:
        url: Ссылка на объект в S3 с указанным временем сгорания.
    """
    one_week = timedelta(weeks=1)
    if client is None:
        raise ValueError("MinIO client is not provided")
    

    try:

        if not client.bucket_exists(bucket_name):
            client.make_bucket(bucket_name)
            logger.info(f"Bucket {bucket_name} created")

        client.put_object(bucket_name, object_name, file_obj, length=-1, part_size=10*1024*1024)

        logger.info(f"File object uploaded to {bucket_name}/{object_name}")

        url = client.presigned_get_object(bucket_name, object_name, expires=one_week)
        
        return url
    except S3Error as e:
        print(f"Error uploading file object: {e}")
        raise

def download_file(url, save_path):
    # Получаем имя файла из URL
    file_name = url.split("/")[-1]
    # Полный путь для сохранения файла
    file_path = os.path.join(save_path, file_name)

    # Запрос на скачивание файла
    response = requests.get(url)
    if response.status_code == 200:
        # Если запрос успешен, сохраняем файл
        with open(file_path, 'wb') as f:
            f.write(response.content)
        print(f"Файл успешно сохранен по пути: {file_path}")
    else:
        # Если произошла ошибка при загрузке
        print(f"Ошибка загрузки файла. Код ошибки: {response.status_code}")

