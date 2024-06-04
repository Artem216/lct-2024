import asyncio
import asyncpg
from dotenv import load_dotenv
import os
from config import Config, cfg



class DB:
    def __init__(self, cfg: Config) -> None:
        self.__cfg = cfg

    async def create_pool(self) -> asyncpg.Pool:
        pool = await asyncpg.pool.create_pool(dsn=self.__cfg.dsn)
        if pool is None:
            raise Exception("can't connect to postgresql")
        self.pool = pool
        return pool



    

db = DB(cfg)

async def get_connection():
    return db.pool


# if __name__ == "__main__":
#     config = Config()  # type: ignore
#     print(config)
#     config.postgres_db = "dev"
#     loop = asyncio.get_event_loop()
#     loop.run_until_complete(run(config))