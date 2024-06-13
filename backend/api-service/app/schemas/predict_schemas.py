from pydantic import BaseModel, Field
from typing import List
 



product_map = {
    "ПК" : "Кредит",
    "TOPUP" : "Кредит",
    "REFIN" : "Кредит",
    "CC" : "Кредит",
    "AUTO_SCR" : "Кредит",
    "MORTG_SCR" : "Кредит",
    "AUTO" : "Автокредит",
    "MORTG" : "Ипотека",
    "MORTG_REFI" : "Ипотека",
    "DEPOSIT" : "Счета_вклады",
    "SAVE_ACC" : "Счета_вклады",
    "INVEST" : "Счета_вклады",
    "TRUST" : "Счета_вклады",
    "OMS" : "Счета_вклады",
    "IZP" : "Карта",
    "DC" : "Карта",
    "PREMIUM" : "Карта",
    "ISG" : "Страхованиe",
    "NSG" : "Страхованиe",
    "INS_LIFE" : "Страхованиe",
    "INS_PROPERTY": "Страхованиe",
    "CURR_EXC" : "Обмен валюты"
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
    image_type: str
    colour: str



class PredictResponse(BaseModel):
    id : int
    status: str


class PredictData(BaseModel):
    id: int
    status: str
    child_s3_url: str
    parent_s3_url: str
    x : int
    y : int
    rating : int