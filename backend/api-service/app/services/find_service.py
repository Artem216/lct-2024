from db.database import get_connection
from pydantic import BaseModel
from typing import Optional, List



from schemas.find_schemas import AllCards, TopCards
from schemas.predict_schemas import PromptTags

from config import logger



# class Card(BaseModel):
#     id: int
#     s3_url: str

# async def get_card(req_id: int) -> Card:
#     """
#     Получение карточки фотографии по id

#     Args:
#         req_id (int): id карточки 

#     Returns:
#         Card: объект содержащий информацию о карточке.

#     """
#     db = await get_connection()

#     qwery = """
#     SELECT id, s3_url
#     FROM response
#     WHERE id = $1;
#     """

#     record = await db.fetchrow(qwery, req_id)

#     return Card(**record)


async def get_top_cards(n: int) -> List[TopCards]:
    """
    Получение списка топ-рейтинговых фотографий.

    Эта асинхронная функция возвращает список из `n` фотографий, отсортированных по убыванию рейтинга.

    Args:
        n (int): Количество фотографий, которое необходимо получить.

    Returns:
        List[TopCards]: Список объектов `TopCards`, содержащих информацию о топовых фотографиях.
    """
    db = await get_connection()

    query = """
    SELECT r.id, r.child_s3_url, r.parent_s3_url, r.rating, u.name AS user_name, f.prompt
    FROM response r
    JOIN users u ON r.fk_user = u.id
    JOIN requests req ON r.fk_request = req.id
    JOIN features f ON req.fk_features = f.id
    ORDER BY r.rating DESC
    LIMIT $1;
    """
    
    records = await db.fetch(query, n)
    
    ans = [
        TopCards(
            id=record['id'],
            user_name=record['user_name'],
            prompt=record['prompt'],
            child_s3_url=record['child_s3_url'],
            parent_s3_url=record['parent_s3_url'],
            rating=record['rating']
        ) for record in records
    ]

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
        SELECT res.id as req_id, r.fk_features, f.prompt, f.height, f.width, f.goal, f.tags, f.colour, f.product, f.image_type,
                res.id as res_id, res.child_s3_url, res.parent_s3_url, res.x, res.y, res.rating, res.fk_user, res.child_w, res.child_h
        FROM requests r
        JOIN features f ON r.fk_features = f.id
        JOIN response res ON r.id = res.fk_request
        """
        records = await db.fetch(query)
    else:
        query = """
        SELECT res.id as req_id, r.fk_features, f.prompt, f.height, f.width, f.goal, f.tags, f.colour, f.product, f.image_type,
                res.id as res_id, res.child_s3_url, res.parent_s3_url, res.x, res.y, res.rating, res.fk_user, res.child_w, res.child_h
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
            "status": "complete",
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
            "tags": [PromptTags(tag=tag) for tag in record['tags'].split("+")]
        }
        ans.append(AllCards(**tmp))

    return ans



async def get_cards_by_theme(theme: str) -> List[TopCards]:
    """
    Получение списка топ-рейтинговых фотографий.

    Эта асинхронная функция возвращает список из `n` фотографий, отсортированных по убыванию рейтинга.

    Args:
        n (int): Количество фотографий, которое необходимо получить.

    Returns:
        List[TopCards]: Список объектов `TopCards`, содержащих информацию о топовых фотографиях.
    """

    db = await get_connection()

    query = """
    SELECT r.id, 
       r.child_s3_url, 
       r.parent_s3_url, 
       r.rating, 
       u.name AS user_name, 
       f.prompt,
       f.product
    FROM response r
    JOIN requests req ON r.fk_request = req.id
    JOIN features f ON req.fk_features = f.id
    JOIN users u ON r.fk_user = u.id
    WHERE f.product = $1
    """
    # ORDER BY r.rating DESC
    # LIMIT $1;

    records = await db.fetch(query, theme)
    
    ans = [
        TopCards(
            id=record['id'],
            user_name = record['user_name'],
            prompt=record['prompt'],
            child_s3_url=record['child_s3_url'],
            parent_s3_url=record['parent_s3_url'],
            rating=record['rating']
        ) for record in records
    ]

    return ans