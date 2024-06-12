import asyncio
import asyncpg
from dotenv import load_dotenv
import os
from config import Config, cfg


class DB:
    """
    Класс, который предоставляет пул соединений с базой данных PostgreSQL.

    Атрибуты:
        __cfg (Config): Объект конфигурации, который хранит данные для подключения к базе данных.
        pool (asyncpg.Pool): Пул соединений с базой данных PostgreSQL.

    Методы:
        __init__(self, cfg: Config) -> None:
            Инициализирует класс DB с предоставленным объектом Config.

        create_pool(self) -> asyncpg.Pool:
            Создает пул соединений с базой данных PostgreSQL, используя данные конфигурации из объекта Config.
            Если пул соединений не может быть создан, генерируется исключение.
    """

    def __init__(self, cfg: Config) -> None:
        """
        Инициализирует класс DB с предоставленным объектом Config.

        Args:
            cfg (Config): Объект конфигурации, который хранит данные для подключения к базе данных.
        """
        self.__cfg = cfg

    async def create_pool(self) -> asyncpg.Pool:
        """
        Создает пул соединений с базой данных PostgreSQL, используя данные конфигурации из объекта Config.

        Returns:
            asyncpg.Pool: Пул соединений с базой данных PostgreSQL.

        Raises:
            Exception: Если пул соединений не может быть создан.
        """
        pool = await asyncpg.pool.create_pool(dsn=self.__cfg.dsn)
        if pool is None:
            raise Exception("Не удалось подключиться к PostgreSQL")
        self.pool = pool
        return pool




    

db = DB(cfg)

async def get_connection():
    """Возвращает объект подключения к базе данных."""
    return db.pool
