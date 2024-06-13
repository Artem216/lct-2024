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
    SELECT id, child_s3_url, parent_s3_url, rating, fk_user, fk_request
    FROM response
    ORDER BY rating DESC
    LIMIT $1;
    """
    
    record = await db.fetch(qwery, n)

    ans = []

    for response in record: 
        
        qwery_prompt = """
        SELECT fk_features
        FROM request
        WHERE id = $1
        """
        prompt_req = await db.fetchrow(qwery_prompt, record['fk_request'])


        qwery = """
        SELECT name
        FROM users
        WHERE id = $1
        """

        record = await db.fetchrow(qwery, response['fk_user'])


        tmp = {
            "id" : response['id'],
            "user_name" : record['name'],
            "child_s3_url" : response['child_s3_url'],
            "parent_s3_url" : response['parent_s3_url'],
            "rating" : response ['rating']
        }

        ans.append(TopCards(**tmp))

    return ans 


async def get_all_cards(user_id: int, is_admin: bool) -> List[AllCards]:
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
        query = """
        SELECT r.id as req_id, r.fk_features, f.prompt, f.height, f.width, f.goal, f.tags, f.colour, f.product, f.image_type,
                res.id as res_id, res.child_s3_url, res.parent_s3_url, res.x, res.y, res.rating, res.fk_user
        FROM requests r
        JOIN features f ON r.fk_features = f.id
        JOIN response res ON r.id = res.fk_request;
        """
        records = await db.fetch(query)
    else:
        query = """
        SELECT r.id as req_id, r.fk_features, f.prompt, f.height, f.width, f.goal, f.tags, f.colour, f.product, f.image_type,
                res.id as res_id, res.child_s3_url, res.parent_s3_url, res.x, res.y, res.rating, res.fk_user
        FROM requests r
        JOIN features f ON r.fk_features = f.id
        JOIN response res ON r.id = res.fk_request
        WHERE r.fk_user = $1;
        """
        records = await db.fetch(query, user_id)

    ans = []

    for record in records:
        tmp = {
            "user_id": record['fk_user'],
            "req_id": record['req_id'],
            "child_s3_url": record['child_s3_url'],
            "parent_s3_url": record['parent_s3_url'],
            "x": record['x'],
            "y": record['y'],
            "rating": record['rating'],
            "prompt": record['prompt'],
            "width": record['width'],
            "height": record['height'],
            "goal": record['goal'],
            "tags": [PromptTags(tag=tag) for tag in record['tags'].split("+")]
        }
        ans.append(AllCards(**tmp))

    return ans

# async def get_all_cards(user_id : int, is_admin: bool) -> List[AllCards]:
#     """
#     Получение списка всех фотографий.

#     Эта асинхронная функция возвращает список всех фотографий, доступных пользователю. Если пользователь является администратором, то возвращаются все фотографии.

#     Args:
#         user_id (int): Уникальный идентификатор пользователя.
#         is_admin (bool): Флаг, указывающий, является ли пользователь администратором.

#     Returns:
#         List[AllCards]: Список объектов `AllCards`, содержащих информацию о всех фотографиях.
#     """
#     db = await get_connection()

#     if is_admin:
#         qwery= """
#         SELECT id, fk_features 
#         FROM requests
#         """

#         record = await db.fetch(qwery)


#     else:
#         qwery= """
#         SELECT id, fk_features 
#         FROM requests
#         WHERE fk_user = $1;
#         """

#         record = await db.fetch(qwery, user_id)
    

#     ans = []

#     for requests in record:

#         features_qwery = """
#         SELECT prompt, height, widht, goal, tags, colour, product, image_type
#         FROM features
#         WHERE id = $1;
#         """

#         features_record = await db.fetchrow(features_qwery, requests['fk_features'])


#         response_qwery = """
#         SELECT id, child_s3_url, parent_s3_url, x, y, rating, fk_user
#         FROM response
#         WHERE fk_request = $1;
#         """

#         response_record = await db.fetchrow(response_qwery, requests['id'])




#         tmp = {
#             "user_id" : response_record['fk_user'],
#             "req_id" : response_record['id'],
#             "child_s3_url" : response_record['child_s3_url'],
#             "parent_s3_url" : response_record['parent_s3_url'],
#             "x" : response_record['x'],
#             "y" : response_record['y'],
#             "rating" : response_record['rating'],
#             "prompt" : features_record['prompt'],
#             "widht" : features_record['widht'],
#             "height" : features_record['height'],
#             "goal" : features_record['goal'],
#             "tags" : [PromptTags(tag = el ) for el in features_record['tags'].split("+")]
#         }

#         ans.append(AllCards(**tmp))

#     return ans