from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List

class AllUser(BaseModel):
    id : int
    name : str
    is_admin : bool
    email : str
    good_generated : int
    bad_generated : int
    all_generated: int
    

class UserGraphic(BaseModel):
    x: List[str]
    y: List[int]