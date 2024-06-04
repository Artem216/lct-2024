from db.database import get_connection
from schemas.auth_schemas import AccessToken, Signup
from pydantic import BaseModel
from typing import Optional


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
    print(signup_data.email, signup_data.password, signup_data.name)
    
    query = """
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING id;
    """
    record = await db.fetchrow(query, signup_data.email, signup_data.password, signup_data.name)

    return AddResponse(**record)


async def get_user(email : str) -> Optional[GetUserResponse]:
    """
    Получение пользователя
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


