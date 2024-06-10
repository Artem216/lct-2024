from pydantic import BaseModel, Field
from typing import List
 
class PromptTags(BaseModel):
    tag: str



class PredictRequest(BaseModel):
    n_variants: int = Field(1, ge=1, le=10)
    prompt: str
    width: int
    height: int
    goal: str
    tags: List[PromptTags]



class PredictResponse(BaseModel):
    id : int
    status: str


class PredictData(BaseModel):
    id: int
    s3_url: str