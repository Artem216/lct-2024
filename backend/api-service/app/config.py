from pydantic_settings import BaseSettings, SettingsConfigDict
import logging
import os

from dotenv import load_dotenv

load_dotenv()


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # domain: str = "localhost"
    # server_host: str = "0.0.0.0"
    # server_port: int = 8000

    postgres_user: str = os.getenv("POSTGRES_USER")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD")
    postgres_host: str = os.getenv("POSTGRES_HOST")
    postgres_db: str = os.getenv("POSTGRES_DB")
    postgres_port: int = os.getenv("POSTGRES_PORT")
    @property
    def dsn(self) -> str:
        return f"postgres://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    access_token_expire_minutes: int = 60
    secret_key: str = os.getenv("SECRET_KEY")
    algorithm: str = os.getenv("ALGORITHM")

cfg = Config() 


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
