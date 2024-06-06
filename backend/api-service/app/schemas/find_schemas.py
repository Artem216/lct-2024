from pydantic import BaseModel
from typing import List
 
from .predict_schemas import PromptTags

class AllCards(BaseModel):
    user_id: int
    s3_url: str
    rating: int
    prompt: str
    widht: int
    height: int
    goal: str
    tags: List[PromptTags]