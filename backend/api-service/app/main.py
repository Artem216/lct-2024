from fastapi import FastAPI
from app.api.endpoints import video, frames
from contextlib import asynccontextmanager
from app.db.database import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await db.create_pool()
    yield
    await pool.close()
# Подключение маршрутов


app = FastAPI(lifespan=lifespan)



app.include_router(video.router, prefix="/api/v1/video", tags=["video"])
app.include_router(frames.router, prefix="/api/v1/frames", tags=["frames"])
