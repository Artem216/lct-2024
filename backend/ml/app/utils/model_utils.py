# utils/model_utils.py

import os
import io

from diffusers import DiffusionPipeline, DPMSolverSinglestepScheduler
from utils.s3_utils import get_minio_client 

from config import logger

from .translation_utils import translator_translate

def load_model():
    """Загружает модель из локального файла или MinIO."""

    pipeline = DiffusionPipeline.from_pretrained("nota-ai/bk-sdm-small")
    # pipeline.to("cuda")
    path_to_lora = "/"

    pipeline.load_lora_weights(path_to_lora)

    logger.info("Model loaded successfully")
    
    return pipeline


def predict(pipe, prompt: str, goal: str, tags: str):
    """Делает предсказание на основе входных данных с использованием модели."""

    pipe.scheduler = DPMSolverSinglestepScheduler.from_config(pipe.scheduler.config, timestep_spacing="trailing")

    main_eng_prompt = translator_translate(prompt)

    goal_prompt = goal

    tags_prompt = tags

    prompt = f"GAZPROMBANK,isometric,claymorphism,3d render,icon,web icon,clean background,3d figure,minimalistic,simple,<lora:GAZPROMBANK:0.5>,{eng_prompt}"
    negative_prompt = "pattern, clone, (lineart, contour, black lines), (texture, noise), (floating small parts), [ deformed | disfigured ], poorly drawn, blurry, (flatten, flat, vector), low resolution, defocus, cropped, creature, humanoid, person, (multiply objects), text"
    images = pipe(prompt = prompt, negative_prompt = negative_prompt, num_inference_steps = 20, guidance_scale = 3).images[0]
    
    return save_image_to_bytes(images)

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
