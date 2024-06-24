from pydantic import BaseModel, Field
from typing import List
 



product_map = {
    "ПК" : "credit",
    "TOPUP" : "credit",
    "REFIN" : "credit",
    "CC" : "credit",
    "AUTO_SCR" : "credit",
    "MORTG_SCR" : "credit",
    "AUTO" : "autocredit",
    "MORTG" : "mortgage",
    "MORTG_REFI" : "mortgage",
    "DEPOSIT" : "accounts_deposits",
    "SAVE_ACC" : "accounts_deposits",
    "INVEST" : "accounts_deposits",
    "TRUST" : "accounts_deposits",
    "OMS" : "accounts_deposits",
    "IZP" : "card",
    "DC" : "card",
    "PREMIUM" : "card",
    "ISG" : "insurance",
    "NSG" : "insurance",
    "INS_LIFE" : "insurance",
    "INS_PROPERTY": "insurance",
    "CURR_EXC" : "currency_exchange"
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
    product: str
    holiday : str
    image_type: str
    colour: str
    is_abstract : bool
    use_llm : bool



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
    child_w: int
    child_h : int
    colour : str
    rating : int

class PredictRequestFile(BaseModel):
    n_variants: int = Field(1, ge=1, le=10)
    prompt: str
    width: int
    height: int
    goal: str
    product: str
    holiday : str
    image_type: str
    colour: str
    id_user_from_csv: int
    cluster_name : str
    is_abstract: bool
    use_llm : bool

class Img2ImgRequest(PredictRequest):
    
    photo_id : int
