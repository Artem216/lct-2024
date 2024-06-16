from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto

from schemas.admin_schemas import AllUser, UserGraphic
from services.admin_services import get_all_users, raise_user, delete_user, user_graphic, res_graphic
from db.dependencies import get_current_user


from typing import List


from config import logger

router = APIRouter(prefix="", tags=["admin"])



@router.get("/all_user", response_model=List[AllUser], status_code=status.HTTP_200_OK)
async def find_all(
    current_user: UserDto = Depends(get_current_user),
) -> List[AllUser]:
    if current_user.is_admin:
        try:
            res = await get_all_users(current_user.id)
            return res
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        


@router.post("/raise_user", response_model=UserDto, status_code=status.HTTP_200_OK)
async def raise_user_(
    user_id : int,
    current_user: UserDto = Depends(get_current_user),
) -> UserDto:
    if current_user.is_admin:
        try:
            res = await raise_user(user_id)
            return res
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")


@router.delete("/delete_user", response_model=UserDto, status_code=status.HTTP_200_OK)
async def delete_user_(
    user_id : int,
    current_user: UserDto = Depends(get_current_user),
) -> UserDto:
    if current_user.is_admin:
    
        try:
            res = await delete_user(user_id)
            if res:
                return res
            else:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")             
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")






@router.get("/user_registration", response_model=UserGraphic, status_code=status.HTTP_200_OK)
async def user_registration_graphic(
    current_user: UserDto = Depends(get_current_user),
) -> UserGraphic:
    if current_user.is_admin:
        try:
            res = await user_graphic()
            return res
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")



@router.get("/user_cards_graphic", response_model=UserGraphic, status_code=status.HTTP_200_OK)
async def user_cards_graphic(
    current_user: UserDto = Depends(get_current_user),
) -> UserGraphic:
    if current_user.is_admin:
        try:
            res = await res_graphic()
            return res
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

