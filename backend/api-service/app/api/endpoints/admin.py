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
    """
    Получить список всех пользователей.

    Этот эндпоинт позволяет администратору получить список всех пользователей в системе.

    Args:
        current_user (UserDto): Текущий аутентифицированный пользователь. Получается с помощью зависимости.

    Returns:
        List[AllUser]: Список всех пользователей.

    Raises:
        HTTPException: Если текущий пользователь не администратор или если произошла ошибка при получении данных.
    """
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
    """
    Повысить пользователя до более высокой роли.

    Этот эндпоинт позволяет администратору повысить другого пользователя до более высокой роли.

    Args:
        user_id (int): Идентификатор пользователя, которого нужно повысить.
        current_user (UserDto): Текущий аутентифицированный пользователь. Получается с помощью зависимости.

    Returns:
        UserDto: Обновленная информация о пользователе.

    Raises:
        HTTPException: Если текущий пользователь не администратор, если пользователя нельзя повысить или если произошла ошибка при повышении.
    """
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
    """
    Удалить пользователя.

    Этот эндпоинт позволяет администратору удалить другого пользователя из системы.

    Args:
        user_id (int): Идентификатор пользователя, которого нужно удалить.
        current_user (UserDto): Текущий аутентифицированный пользователь. Получается с помощью зависимости.

    Returns:
        UserDto: Информация об удаленном пользователе.

    Raises:
        HTTPException: Если текущий пользователь не администратор, если пользователя нельзя удалить или если произошла ошибка при удалении.
    """
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
    """
    Получить статистику регистрации пользователей.

    Этот эндпоинт позволяет администратору получить статистику по регистрациям пользователей.

    Args:
        current_user (UserDto): Текущий аутентифицированный пользователь. Получается с помощью зависимости.

    Returns:
        UserGraphic: Статистика регистрации пользователей.

    Raises:
        HTTPException: Если текущий пользователь не администратор или если произошла ошибка при получении данных.
    """
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
    """
    Получить статистику по картам пользователей.

    Этот эндпоинт позволяет администратору получить статистику по картам пользователей.

    Args:
        current_user (UserDto): Текущий аутентифицированный пользователь. Получается с помощью зависимости.

    Returns:
        UserGraphic: Статистика по картам пользователей.

    Raises:
        HTTPException: Если текущий пользователь не администратор или если произошла ошибка при получении данных.
    """
    if current_user.is_admin:
        try:
            res = await res_graphic()
            return res
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

