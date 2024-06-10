# utils/model_utils.py

import os
import io

from diffusers import DiffusionPipeline, DPMSolverSinglestepScheduler
from utils.s3_utils import get_minio_client 

from config import logger


def load_model():
    """Загружает модель из локального файла или MinIO."""
    # endpoint = config['minio']['endpoint']
    # access_key = config['minio']['access_key']
    # secret_key = config['minio']['secret_key']
    # bucket_name = config['model']['bucket_name']
    # model_key = config['model']['key']
    # local_model_path = os.path.join(config['model']['local_path'], os.path.basename(model_key))
    
    # client = get_minio_client(endpoint, access_key, secret_key)
    
    # if not os.path.isfile(local_model_path):
    #     logger.info(f"Downloading model from MinIO bucket: {bucket_name}")
    #     download_file_from_s3(bucket_name, model_key, local_model_path, client=client)
    #     logger.info(f"Model downloaded and saved to {local_model_path}")
    # else:
    #     logger.info(f"Model already exists at {local_model_path}")

    pipeline = DiffusionPipeline.from_pretrained("nota-ai/bk-sdm-small")

    logger.info("Model loaded successfully")
    
    return pipeline


def predict(pipe, prompt):
    """Делает предсказание на основе входных данных с использованием модели."""

    pipe.scheduler = DPMSolverSinglestepScheduler.from_config(pipe.scheduler.config, timestep_spacing="trailing")

    prompt = "Create a 3D unrealistic cartoon-style image on a white background. The image should be simple for cutting out an object and not too detailed. Blue car with orange bow"
    image = pipe(prompt, num_inference_steps = 1, guidance_scale = 3).images[0]
    
    return save_image_to_bytes(image)

def save_image_to_bytes(image):
    """Сохраняет изображение в байтовый поток."""
    
    byte_io = io.BytesIO()
    image.save(byte_io, format='PNG')
    byte_io.seek(0)
    return byte_io


def preprocess_input(input_data):
    """Преобразует входные данные в нужный формат для модели."""
    pass


def postprocess_output(output_data):
    """Преобразует вывод модели в нужный формат для дальнейшего использования."""
    pass
