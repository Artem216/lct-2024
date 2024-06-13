from pydantic import BaseModel
from typing import List
 
from .predict_schemas import PromptTags

class AllCards(BaseModel):
    user_id: int
    req_id : int
    child_s3_url: str
    parent_s3_url : str
    x : int
    y : int
    rating: int
    prompt: str
    width: int
    height: int
    goal: str
    tags: List[PromptTags]



class TopCards(BaseModel):
    id: int
    user_name: str
    child_s3_url : str
    parent_s3_url : str
    rating: int