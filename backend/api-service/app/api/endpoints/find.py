from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto
from schemas.find_schemas import AllCards

from db.dependencies import get_current_user

from services.find_service import get_all_cards

from typing import List


from config import logger

router = APIRouter(prefix="", tags=["predict"])


@router.get("/all_cards", response_model=List[AllCards], status_code=status.HTTP_201_CREATED)
async def signup(
    current_user: UserDto = Depends(get_current_user),
) -> List[AllCards]:
    try:
        cards = await get_all_cards(current_user.id)
        
        return cards

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

