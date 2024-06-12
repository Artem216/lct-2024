from db.database import get_connection

from schemas.find_schemas import TopCards

from config import logger

async def change_rating(response_id : int, chng: str):
    """
    Изменение рейтинга ответа.

    Эта асинхронная функция позволяет либо увеличить рейтинг ответа на 1, либо удалить ответ из базы данных.

    Args:
        response_id (int): Уникальный идентификатор ответа.
        action (str): Действие, которое необходимо выполнить над ответом. Возможные значения: "add" (увеличить рейтинг) или "delete" (удалить ответ).
    """
    db = await get_connection()
    
    if chng == "add":
        qwery= """
        UPDATE response
        SET rating = rating + 1
        WHERE id = $1
        RETURNING s3_url, rating, fk_user;
        """

        record = await db.fetchrow(qwery, response_id)

        qwery_2 = """
        SELECT name
        FROM users
        WHERE id = $1
        """

        record_2 = await db.fetchrow(qwery_2, record['fk_user'])

    if chng == "delete":
        
        qwery= """
        DELETE FROM response
        WHERE id = $1;       
        """

        record = await db.fetchrow(qwery, response_id)

        