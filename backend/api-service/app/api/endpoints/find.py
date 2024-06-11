from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto
from schemas.find_schemas import AllCards, TopCards

from db.dependencies import get_current_user

from services.find_service import get_all_cards, get_top_cards

from typing import List


from config import logger

router = APIRouter(prefix="", tags=["find"])


@router.get("/all_cards", response_model=List[AllCards], status_code=status.HTTP_200_OK)
async def find_all(
    current_user: UserDto = Depends(get_current_user),
) -> List[AllCards]:
    try:
       
        cards = await get_all_cards(current_user.id, current_user.is_admin)
        
        return cards

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/top_pictures", response_model=List[TopCards], status_code=status.HTTP_200_OK)
async def top_pictures(
    n: int,
    current_user: UserDto = Depends(get_current_user),
) -> List[TopCards]:
    try:
        
        cards = await get_top_cards(n)
        
        return cards

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



