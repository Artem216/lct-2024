from db.database import get_connection
from pydantic import BaseModel
from typing import Optional

from schemas.predict_schemas import  PredictRequest, PredictData

from config import logger



from schemas.user_schemas import UserDto

class AddRequestData(BaseModel):
    id: int
    status: str

class AddResponseData(BaseModel):
    id: int
    s3_url : str

async def add_request(user_id : int, predict_data : PredictRequest) -> AddRequestData:
    """
    Добавление нового запроса в базу данных.

    Эта асинхронная функция создает новый запрос в базе данных на основе предоставленных данных предсказания. Она вставляет данные о характеристиках запроса в таблицу "features" и создает новую запись в таблице "requests", связывая ее с характеристиками.

    Args:
        user_id (int): Уникальный идентификатор пользователя, создающего запрос.
        predict_data (PredictRequest): Объект, содержащий данные предсказания, включая текст запроса, высоту, ширину, цель и теги.

    Returns:
        AddRequestData: Объект, содержащий идентификатор созданного запроса и его статус.
    """

    db = await get_connection()

    qwery_features = """
    INSERT INTO features (prompt, height, widht, goal , tags, product, image_tpe, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;
    """

    features_record = await db.fetchrow(qwery_features, 
                                        predict_data.prompt, 
                                        predict_data.height, 
                                        predict_data.width, 
                                        predict_data.goal,
                                        '+'.join([el.tag for el in predict_data.tags]),
                                        predict_data.product,
                                        predict_data.image_tpe,
                                        predict_data.color )

    qwery_req = """
    INSERT INTO requests (status, fk_features, fk_user) 
    VALUES ($1, $2, $3)
    RETURNING id;
    """

    req_record = await db.fetchrow(qwery_req, "In progress", features_record['id'], user_id)

    return AddRequestData(id= req_record['id'],status="In progress")


async def add_response(req_id : str, s3_url : str, user_id: int) -> AddResponseData:
    """
    Добавление нового ответа в базу данных.

    Эта асинхронная функция создает новый ответ в базе данных, связанный с указанным запросом. Она вставляет информацию об ответе, включая URL-адрес S3, идентификатор запроса и идентификатор пользователя.

    Args:
        req_id (str): Уникальный идентификатор запроса, к которому привязан ответ.
        s3_url (str): URL-адрес S3, по которому доступен ответ.
        user_id (int): Уникальный идентификатор пользователя, создавшего ответ.

    Returns:
        AddResponseData: Объект, содержащий идентификатор созданного ответа и URL-адрес S3.
    """
    db = await get_connection()

    qwery = """
    INSERT INTO response (s3_url, fk_request, rating, fk_user)
    VALUES ($1, $2, 0, $3)
    RETURNING fk_request, s3_url;
    """

    record = await db.fetchrow(qwery, s3_url, req_id, user_id)

    return AddResponseData(id= record['fk_request'], s3_url=record['s3_url'])



async def get_response(res_id : int) -> Optional[PredictData]:
    """
    Получение информации об ответе по его идентификатору.

    Эта асинхронная функция возвращает объект `PredictData`, содержащий URL-адрес S3 ответа,
    соответствующего указанному идентификатору. Если ответ не найден, функция возвращает `None`.

    Args:
        res_id (int): Уникальный идентификатор ответа.

    Returns:
        Optional[PredictData]: Объект `PredictData`, содержащий информацию об ответе, или `None`, если ответ не найден.
    """

    db = await get_connection()

    qwery = """
    SELECT s3_url
    FROM response
    WHERE fk_request = $1; 
    """

    record = await db.fetchrow(qwery, res_id)

    if record:
        return PredictData(id= res_id, s3_url=record['s3_url'])
    
    else:
        return None