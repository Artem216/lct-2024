from fastapi import FastAPI
from api.endpoints import auth
from api.endpoints import predict
from api.endpoints import find
from contextlib import asynccontextmanager
from db.database import db

import os

from config import cfg

from yoyo import read_migrations
from yoyo import get_backend

backend = get_backend(f"{cfg.dsn}")

migrations_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "./migrations"))

migrations = read_migrations(migrations_dir)
backend.apply_migrations(backend.to_apply(migrations))





@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await db.create_pool()
    yield
    await pool.close()

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(predict.router, prefix="/api/v1")
app.include_router(find.router, prefix="/api/v1")
