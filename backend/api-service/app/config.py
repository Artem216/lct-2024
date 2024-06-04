from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    domain: str = "localhost"
    server_host: str = "0.0.0.0"
    server_port: int = 8000

    postgres_user: str ="postgres"
    postgres_password: str ="postgres"
    postgres_host: str = "0.0.0.0"
    postgres_db: str = "video_db"
    postgres_port: int = 5432
    @property
    def dsn(self) -> str:
        return f"postgres://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    aws_access_key_id: str = '9Ddfk2I16fF30sN8c5OU'
    aws_secret_access_key: str = 'y2pwWTf7AGhYXmmqUrE65Hvp2uvkC1cZJRRzjWAn'
    bucket_name: str = 'videos'
    s3_host: str = 'localhost:9000'

cfg = Config() 