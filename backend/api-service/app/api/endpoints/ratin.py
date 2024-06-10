from fastapi import APIRouter, Depends, HTTPException, status, Response

from schemas.user_schemas import UserDto
from schemas.find_schemas import TopCards
from db.dependencies import get_current_user

from services.rating_service import add_rating


from config import logger


router = APIRouter(prefix="", tags=["predict"])


@router.get("/add_rating", response_model=TopCards,  status_code=status.HTTP_200_OK)
async def add_rating(
    respons : Response,
    response_id : int 
) -> TopCards:
    
    try:
        
        new_card = await add_rating(response_id)

        return new_card
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))