from pydantic import BaseModel, Field
from typing import List
 



product_map = {
    "ПК" : "credit",
    "TOPUP" : "credit",
    "REFIN" : "credit",
    "СС" : "credit",
    "AUTO_SCR" : "credit",
    "MORTG_SCR" : "credit",
    "AUTO" : "car loan",
    "MORTG" : "mortgage",
    "MORTG_REFI" : "mortgage",
    "DEPOSIT" : "investments",
    "SAVE_ACC" : "investments",
    "INVEST" : "investments",
    "TRUST" : "investments",
    "OMS" : "investments",
    "IZP" : "cards",
    "DC" : "cards",
    "PREMIUM" : "cards",
    "ISG" : "insurance",
    "NSG" : "insurance",
    "INS_LIFE" : "insurance",
    "INS_PROPERTY": "insurance",
    "CURR_EXC" : "currency exchange"
} 


goal_map = {
    "TMO" : "call center",
    "SMS" : "SMS",
    "PUSH" : "push in mobile bank",
    "EMAIL" : "email",
    "MOB_BANNER" : "mobile app",
    "OFFICE_BANNER" : "manager",
    "MOBILE_CHAT" : "mobile chat"
}

class PromptTags(BaseModel):
    tag: str



class PredictRequest(BaseModel):
    n_variants: int = Field(1, ge=1, le=10)
    prompt: str
    width: int
    height: int
    goal: str
    tags: List[PromptTags]
    product: str
    image_tpe: str
    color: str



class PredictResponse(BaseModel):
    id : int
    status: str


class PredictData(BaseModel):
    id: int
    s3_url: str