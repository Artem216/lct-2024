from fastapi import FastAPI
from api.endpoints import auth
from api.endpoints import predict
from api.endpoints import find
from contextlib import asynccontextmanager
from db.database import db

from fastapi.middleware.cors import CORSMiddleware

import os

import asyncio

from utils.kafka_consumer import consume
from config import cfg

from yoyo import read_migrations
from yoyo import get_backend

from config import logger

backend = get_backend(f"{cfg.dsn}")

migrations_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "./migrations"))

migrations = read_migrations(migrations_dir)
backend.apply_migrations(backend.to_apply(migrations))

from aiokafka import AIOKafkaConsumer



@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await db.create_pool()
    consumer = AIOKafkaConsumer(
        'confirm',
        bootstrap_servers='kafka:29091',
        auto_offset_reset='latest'
    )
    await consumer.start()
    asyncio.create_task(consume(consumer))
    yield
    await pool.close()
    await consumer.stop()



app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set this to the appropriate origins
    allow_credentials=True,
    allow_methods=["*"],  # Set this to the allowed HTTP methods
    allow_headers=["*"],  # Set this to the allowed headers
)


app.include_router(auth.router)
app.include_router(predict.router, prefix="/api/v1")
app.include_router(find.router, prefix="/api/v1")
