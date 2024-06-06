import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from enum import Enum

from typing import Optional


class UserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    is_admin: bool 
    name: str