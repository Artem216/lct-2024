from pydantic import BaseModel
from typing import List
 
from .predict_schemas import PromptTags

class AllCards(BaseModel):
    user_id: int
    req_id : int
    status: str
    child_s3_url: str
    parent_s3_url : str
    x : int
    y : int
    colour : str
    child_w : int
    child_h : int
    rating: int
    prompt: str
    width: int
    height: int
    goal: str



class TopCards(BaseModel):
    id: int
    user_name: str
    prompt: str
    child_s3_url : str
    parent_s3_url : str
    rating: int