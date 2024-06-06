from db.database import get_connection
from pydantic import BaseModel
from typing import Optional

from schemas.predict_schemas import  PredictRequest

from config import logger



from schemas.user_schemas import UserDto

class AddRequestData(BaseModel):
    id: int
    status: str

class AddResponseData(BaseModel):
    id: int
    s3_url : str

async def add_request(user_id : int, predict_data : PredictRequest) -> AddRequestData:
    
    db = await get_connection()

    qwery_features = """
    INSERT INTO features (prompt, height, widht, goal , tags)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    """

    features_record = await db.fetchrow(qwery_features, predict_data.prompt, predict_data.height, predict_data.width, predict_data.goal, '+'.join([el.tag for el in predict_data.tags]))

    qwery_req = """
    INSERT INTO requests (status, fk_features, fk_user) 
    VALUES ($1, $2, $3)
    RETURNING id;
    """

    req_record = await db.fetchrow(qwery_req, "In progress", features_record['id'], user_id)

    return AddRequestData(id= req_record['id'],status="In progress")

# @parlorsky

async def add_response(req_id : str, s3_url : str, user_id: int) -> AddResponseData:
    
    db = await get_connection()

    qwery = """
    INSERT INTO response (s3_url, fk_request, rating, fk_user)
    VALUES ($1, $2, 0, $3)
    RETURNING fk_request, s3_url;
    """

    record = await db.fetchrow(qwery, s3_url, req_id, user_id)

    return AddResponseData(id= record['fk_request'], s3_url=record['s3_url'])