from db.database import get_connection
from pydantic import BaseModel
from typing import Optional

from schemas.predict_schemas import  PredictRequest, PredictData, PredictRequestFile
from schemas.find_schemas import AllCards, PromptTags
from config import logger

from schemas.predict_schemas import product_map

from schemas.user_schemas import UserDto

class AddRequestData(BaseModel):
    id: int
    status: str


class AddResponseData(BaseModel):
    id: int
    s3_url : str


from typing import Any


async def add_request(user_id : int, predict_data : PredictRequest | PredictRequestFile) -> AddRequestData:
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
    INSERT INTO features (prompt, height, width, goal , tags, product, image_type, colour)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;
    """

    features_record = await db.fetchrow(qwery_features, 
                                        predict_data.prompt, 
                                        predict_data.height, 
                                        predict_data.width, 
                                        predict_data.goal,
                                        "",
                                        product_map[predict_data.product],
                                        predict_data.image_type,
                                        predict_data.colour )

    qwery_req = """
    INSERT INTO requests (status, fk_features, fk_user) 
    VALUES ($1, $2, $3)
    RETURNING id;
    """

    req_record = await db.fetchrow(qwery_req, "In progress", features_record['id'], user_id)

    return AddRequestData(id= req_record['id'],status="In progress")



async def add_response(req_id: str, 
                       child_s3_url: str,
                       parent_s3_url: str,
                       x: int,
                       y: int,
                       user_id: int,
                       child_w: int,
                       child_h: int,
                       colour: str,
                       prompt: str) -> AddResponseData:
    """
    Добавление нового ответа в базу данных.

    Эта асинхронная функция создает новый ответ в базе данных, связанный с указанным запросом. 
    Она вставляет информацию об ответе, включая URL-адрес S3, идентификатор запроса и идентификатор пользователя.

    Args:
        req_id (str): Уникальный идентификатор запроса, к которому привязан ответ.
        child_s3_url (str): URL-адрес S3, по которому доступна фотграфия без фона.
        parent_s3_url (str): URL-адрес S3, по которому доступна фотграфия с фоном.
        x (int) : x координата нахождения ребёнка на фотграфии родителя.
        y (int) : y координата нахождения ребёнка на фотграфии родителя.
        user_id (int): Уникальный идентификатор пользователя, создавшего ответ.
        child_w (int): Ширина изображения ребенка.
        child_h (int): Высота изображения ребенка.
        colour (str): Цвет.
        prompt (str): Промпт.

    Returns:
        AddResponseData: Объект, содержащий идентификатор созданного ответа и URL-адрес S3.
    """
    db = await get_connection()


    insert_query = """
        INSERT INTO response (id, child_s3_url, parent_s3_url, x, y, child_w, child_h, colour, fk_request, rating, fk_user)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, $10)
        RETURNING id, fk_request, child_s3_url;
    """
    
    response_record = await db.fetchrow(insert_query, req_id, child_s3_url, parent_s3_url, x, y, child_w, child_h, colour, req_id, user_id)
    
    update_query = """
        UPDATE features
        SET prompt = $1
        FROM requests
        WHERE features.id = requests.fk_features AND requests.id = $2
        RETURNING features.id;
    """
    
    await db.fetchrow(update_query, prompt, req_id)
        
    return AddResponseData(id=response_record['id'], s3_url=response_record['child_s3_url'])





async def get_response(res_id : int) -> AllCards:
    """
    Получение информации об ответе по его идентификатору.

    Эта асинхронная функция возвращает объект `PredictData`, содержащий URL-адрес S3 ответа,
    соответствующего указанному идентификатору. Если ответ не найден, функция возвращает `None`.

    Args:
        res_id (int): Уникальный идентификатор ответа.

    Returns:
        PredictData: Объект `PredictData`, содержащий информацию об ответе.
    """

    db = await get_connection()

    qwery = """
    SELECT r.id as req_id, r.fk_features, f.prompt, f.height, f.width, f.goal, f.colour, f.product, f.image_type,
                res.id as res_id, res.child_s3_url, res.parent_s3_url, res.x, res.y, res.rating, res.fk_user, res.child_w, res.child_h
    FROM requests r
    JOIN features f ON r.fk_features = f.id
    JOIN response res ON r.id = res.fk_request
    WHERE res.id = $1
    """

    record = await db.fetchrow(qwery, res_id)


    if record:
        tmp = {
            "user_id": record['fk_user'],
            "req_id": res_id,
            "status" : "complete",
            "child_s3_url": record['child_s3_url'],
            "parent_s3_url": record['parent_s3_url'],
            "x": record['x'],
            "y": record['y'],
            "colour" : record['colour'],
            "child_w" : record['child_w'],
            "child_h" : record['child_h'],
            "rating": record['rating'],
            "prompt": record['prompt'],
            "width": record['width'],
            "height": record['height'],
            "goal": record['goal'],
        }
        return AllCards(**tmp)
    else:
        tmp = {
            "user_id": 0,
            "req_id": 0,
            "status" : "in_progress",
            "child_s3_url": "",
            "parent_s3_url": "",
            "x": 0,
            "y": 0,
            "colour" : "",
            "child_w" : 0,
            "child_h" : 0,
            "rating": 0,
            "prompt": "",
            "width": 0,
            "height": 0,
            "goal": "",
        }
        return AllCards(**tmp)