from pydantic import BaseModel
from typing import List
 
class PromptTags(BaseModel):
    tag: str



class PredictRequest(BaseModel):
    prompt: str
    tags: List[PromptTags]

class PredictResponse(BaseModel):
    id : int
    s3_url: str
