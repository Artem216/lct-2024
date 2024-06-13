from db.database import get_connection
from pydantic import BaseModel
from typing import Optional, List



from schemas.find_schemas import AllCards, TopCards
from schemas.predict_schemas import PromptTags

from config import logger



class Card(BaseModel):
    id: int
    s3_url: str

async def get_card(req_id: int) -> Card:
    """
    Получение карточки фотографии по id

    Args:
        req_id (int): id карточки 

    Returns:
        Card: объект содержащий информацию о карточке.

    """
    db = await get_connection()

    qwery = """
    SELECT id, s3_url
    FROM response
    WHERE id = $1;
    """

    record = await db.fetchrow(qwery, req_id)

    return Card(**record)

async def get_top_cards(n : int) -> List[TopCards]:
    # TODO: Рассмотреть возможность выдавать промт 
    """
    Получение списка топ-рейтинговых фотографий.

    Эта асинхронная функция возвращает список из `n` фотографий, отсортированных по убыванию рейтинга.

    Args:
        n (int): Количество фотографий, которое необходимо получить.

    Returns:
        List[TopCards]: Список объектов `TopCards`, содержащих информацию о топовых фотографиях.

    """
    db = await get_connection()

    qwery = """
    SELECT id, s3_url, rating, fk_user
    FROM response
    ORDER BY rating DESC
    LIMIT $1;
    """
    
    record = await db.fetch(qwery, n)

    ans = []

    for response in record: 

        qwery = """
        SELECT name
        FROM users
        WHERE id = $1
        """

        record = await db.fetchrow(qwery, response['fk_user'])


        tmp = {
            "id" : response['id'],
            "user_name" : record['name'],
            "s3_url" : response['s3_url'],
            "rating" : response ['rating']
        }

        ans.append(TopCards(**tmp))

    return ans 

async def get_all_cards(user_id : int, is_admin: bool) -> List[AllCards]:
    """
    Получение списка всех фотографий.

    Эта асинхронная функция возвращает список всех фотографий, доступных пользователю. Если пользователь является администратором, то возвращаются все фотографии.

    Args:
        user_id (int): Уникальный идентификатор пользователя.
        is_admin (bool): Флаг, указывающий, является ли пользователь администратором.

    Returns:
        List[AllCards]: Список объектов `AllCards`, содержащих информацию о всех фотографиях.
    """
    db = await get_connection()

    if is_admin:
        qwery= """
        SELECT id, fk_features 
        FROM requests
        """

        record = await db.fetch(qwery)


    else:
        qwery= """
        SELECT id, fk_features 
        FROM requests
        WHERE fk_user = $1;
        """

        record = await db.fetch(qwery, user_id)
    

    ans = []

    for requests in record:

        features_qwery = """
        SELECT prompt, height, widht, goal, tags, colour, product, image_type
        FROM features
        WHERE id = $1;
        """

        features_record = await db.fetchrow(features_qwery, requests['fk_features'])


        response_qwery = """
        SELECT id, s3_url, rating, fk_user
        FROM response
        WHERE fk_request = $1;
        """

        response_record = await db.fetchrow(response_qwery, requests['id'])




        tmp = {
            "user_id" : response_record['fk_user'],
            "req_id" : response_record['id'],
            "s3_url" : response_record['s3_url'],
            "rating" : response_record['rating'],
            "prompt" : features_record['prompt'],
            "widht" : features_record['widht'],
            "height" : features_record['height'],
            "goal" : features_record['goal'],
            "tags" : [PromptTags(tag = el ) for el in features_record['tags'].split("+")]
        }

        ans.append(AllCards(**tmp))

    return ans