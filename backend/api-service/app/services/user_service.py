from db.database import get_connection
from schemas.auth_schemas import AccessToken, Signup
from pydantic import BaseModel
from typing import Optional

from schemas.user_schemas import UserDto


class AddResponse(BaseModel):
    id: int

class GetUserResponse(BaseModel):
    id: int
    password: str


async def add_user(signup_data: Signup) -> AddResponse:
    """
    Добавление нового пользователя в базу данных.

    Эта асинхронная функция создает нового пользователя в базе данных на основе предоставленных данных регистрации.
    Она вставляет данные пользователя, такие как email, пароль и имя, в таблицу "users" и возвращает идентификатор созданного пользователя.

    Args:
        signup_data (Signup): Объект, содержащий данные регистрации нового пользователя, включая email, пароль и имя.

    Returns:
        AddResponse: Объект, содержащий идентификатор созданного пользователя.
    """
    db = await get_connection()
    
    query = """
    INSERT INTO users (email, password, name, is_admin)
    VALUES ($1, $2, $3, false)
    RETURNING id;
    """
    record = await db.fetchrow(query, signup_data.email, signup_data.password, signup_data.name)

    return AddResponse(**record)


async def get_user_by_email(email : str) -> Optional[GetUserResponse]:
    """
    Получение пользователя по email.

    Эта асинхронная функция возвращает объект `GetUserResponse`, содержащий идентификатор и пароль пользователя,
    соответствующего указанному email. Если пользователь не найден, функция возвращает `None`.

    Args:
        email (str): Email пользователя.

    Returns:
        Optional[GetUserResponse]: Объект `GetUserResponse`, содержащий информацию о пользователе, или `None`, если пользователь не найден.
    """

    db = await get_connection()

    query = """
    SELECT id, password
    FROM users
    WHERE email = $1;
    """

    try:
        record = await db.fetchrow(query, email)
        
        return GetUserResponse(**record)
    except:
        return None



async def get_user_by_id(id : int) -> UserDto:
    """
    Получение пользователя по id
    """

    db = await get_connection()

    query = """
    SELECT id, email, is_admin, name
    FROM users
    WHERE id = $1;
    """
    
    try:
        record = await db.fetchrow(query, id)
        
        return UserDto(**record)
    except:

        return None