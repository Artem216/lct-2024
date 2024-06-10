from minio import Minio
from minio.error import S3Error
import os

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
    """Загружает объект-файл в S3 (MinIO) и возвращает ссылку на объект."""
    if client is None:
        raise ValueError("MinIO client is not provided")

    try:
        client.put_object(bucket_name, object_name, file_obj, length=-1, part_size=10*1024*1024)

        logger.info(f"File object uploaded to {bucket_name}/{object_name}")

        url = client.presigned_get_object(bucket_name, object_name)
        
        return url
    except S3Error as e:
        print(f"Error uploading file object: {e}")
        raise