from pydantic_settings import BaseSettings, SettingsConfigDict
import logging


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    domain: str = "localhost"
    server_host: str = "0.0.0.0"
    server_port: int = 8000

    postgres_user: str ="postgres"
    postgres_password: str ="postgres"
    postgres_host: str = "db"
    postgres_db: str = "dev"
    postgres_port: int = 5432
    @property
    def dsn(self) -> str:
        return f"postgres://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    access_token_expire_minutes: int = 15
    secret_key: str = "6934545212a83b8135a67477483ff734fe7b1c185f7abc940ad8cebd6388cfa0"
    algorithm: str = "HS256"
    # aws_access_key_id: str = '9Ddfk2I16fF30sN8c5OU'
    # aws_secret_access_key: str = 'y2pwWTf7AGhYXmmqUrE65Hvp2uvkC1cZJRRzjWAn'
    # bucket_name: str = 'videos'
    # s3_host: str = 'localhost:9000'

cfg = Config() 


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
