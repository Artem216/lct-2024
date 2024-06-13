from pydantic_settings import BaseSettings, SettingsConfigDict


import logging

import os
from dotenv import load_dotenv

load_dotenv()

class Config(BaseSettings):

    ACCESS_KEY: str = os.getenv("ACCESS_KEY")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    bucket_name_1: str = os.getenv("bucket_name_1")
    bucket_name_2: str = os.getenv("bucket_name_2")
    S3_HOST: str = os.getenv("S3_HOST")

cfg = Config() 


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
