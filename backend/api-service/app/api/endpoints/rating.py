from fastapi import APIRouter, Depends, HTTPException, status, Response

from schemas.user_schemas import UserDto
from schemas.find_schemas import TopCards
from db.dependencies import get_current_user

from services.rating_service import change_rating

from config import logger


router = APIRouter(prefix="", tags=["rating"])


@router.get("/change_rating", status_code=status.HTTP_200_OK)
async def chng_rating(
    response: Response,
    response_id: int,
    change: str,
) -> None:
    """
    Изменение рейтинга фотографии.

    Данный эндпойнт позволяет изменить рейтинг фотографии. Если в параметре `change` передано значение "add",
    то рейтинг фотографии будет увеличен на 1. Если в параметре `change` передано значение "delete", то запись
    о фотографии будет удалена.

    Args:
        response (Response): Объект Response, используемый для изменения HTTP-статуса ответа.
        response_id (int): Уникальный идентификатор фотографии, рейтинг которой необходимо изменить.
        change (str): Параметр, определяющий, что необходимо сделать с рейтингом фотографии ("add" или "delete").

    Raises:
        HTTPException: Если произошла ошибка при изменении рейтинга фотографии.
    """
    try:
        await change_rating(response_id, chng=change)
        response.status_code = status.HTTP_200_OK
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
