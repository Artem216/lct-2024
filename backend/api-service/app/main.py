from fastapi import FastAPI
from api.endpoints import auth
from contextlib import asynccontextmanager
from db.database import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await db.create_pool()
    yield
    await pool.close()
# Подключение маршрутов


app = FastAPI(lifespan=lifespan)



app.include_router(auth.router, prefix="/api/v1")
