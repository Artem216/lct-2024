from db.database import get_connection
from pydantic import BaseModel
from typing import Optional, List

from schemas.admin_schemas import AllUser, UserGraphic

from schemas.user_schemas import UserDto

from config import logger


import datetime
import random

async def get_all_users(current_user_id: int) -> List[AllUser]:

    db = await get_connection()

    query = """
    SELECT
        u.id,
        u.email,
        u.name,
        u.is_admin,
        u.is_delete,
        COALESCE(positive.count, 0) AS good_generated,
        COALESCE(negative.count, 0) AS bad_generated,
        COALESCE(positive.count, 0) + COALESCE(negative.count, 0) AS all_generated
    FROM users u

    LEFT JOIN (
        SELECT fk_user, COUNT(*) AS count
        FROM response
        WHERE rating >= 0
        GROUP BY fk_user
    ) AS positive ON u.id = positive.fk_user

    LEFT JOIN (
        SELECT fk_user, COUNT(*) AS count
        FROM response
        WHERE rating < 0
        GROUP BY fk_user
    ) AS negative ON u.id = negative.fk_user
    WHERE u.id != $1 AND u.is_delete != $2
    """

    records = await db.fetch(query, current_user_id, True)

    return [AllUser(**record) for record in records]


async def raise_user(user_id :int) -> UserDto:

    db = await get_connection() 

    qwery = """
    UPDATE users
    SET is_admin = true
    WHERE id = $1
    RETURNING id, email, is_admin, name;
    """

    record = await db.fetch(qwery, user_id)

    return UserDto(**record[0])


async def delete_user(user_id :int) -> Optional[UserDto]:

    db = await get_connection() 

    qwery = """
    UPDATE users
    SET is_delete = true
    WHERE id = $1
    AND is_admin = false
    RETURNING id, email, is_admin, name;
    """

    record = await db.fetch(qwery, user_id)

    if record:
        return UserDto(**record[0])
    else:
        return None


async def user_graphic() -> UserGraphic:

    db = await get_connection()

    user_registrations = await db.fetch("SELECT created_at FROM users")

    now = datetime.datetime.now()
    dates = [
        (now - datetime.timedelta(days=i*30)).strftime("%b %Y")
        for i in range(4)
    ]
    

    registration_counts = {date: 0 for date in dates}
    
    logger.info(registration_counts)
    for record in user_registrations:
        month_year = record["created_at"].strftime("%b %Y")
        if month_year in registration_counts:
            registration_counts[month_year] += 1
        else:
            registration_counts[month_year] = 1


    # Сортируем данные по месяцам
    # sorted_registrations = sorted(registration_counts.items(), key=lambda x: x[0])
    logger.info(registration_counts)
    x_values = [key for key in registration_counts]
    y_values = [value for value in registration_counts.values()]

    return UserGraphic(x=x_values[::-1], y= y_values[::-1])


async def res_graphic() -> UserGraphic:

    db = await get_connection()

    user_registrations = await db.fetch("SELECT created_at FROM requests")

    now = datetime.datetime.now()
    dates = [
        (now - datetime.timedelta(days=i*30)).strftime("%b %Y")
        for i in range(4)
    ]
    

    registration_counts = {date: 0 for date in dates}
    
    logger.info(registration_counts)
    for record in user_registrations:
        month_year = record["created_at"].strftime("%b %Y")
        if month_year in registration_counts:
            registration_counts[month_year] += 1
        else:
            registration_counts[month_year] = 1


    # Сортируем данные по месяцам
    # sorted_registrations = sorted(registration_counts.items(), key=lambda x: x[0])
    logger.info(registration_counts)
    x_values = [key for key in registration_counts]
    y_values = [value for value in registration_counts.values()]

    return UserGraphic(x=x_values[::-1], y= y_values[::-1])