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
    Добавление нового пользователя в бд
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
    Получение id пользователя по email
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