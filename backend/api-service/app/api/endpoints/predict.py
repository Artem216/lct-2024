from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto
from db.dependencies import get_current_user

from schemas.predict_schemas import PredictResponse, PredictRequest, PredictData
from services.predict_service import add_request, get_response
from services.find_service import get_card
from utils.kafka_producer import send_task, send_image_to_image_task

from typing import List, Optional

# import grpc
# import proto.service_pb2_grpc as pb2_grpc
# import proto.service_pb2 as pb2
from config import logger

router = APIRouter(prefix="", tags=["predict"])


@router.post("/predict", response_model=List[PredictResponse], status_code=status.HTTP_200_OK)
async def text_to_image(
    predict_data : PredictRequest,
    current_user: UserDto = Depends(get_current_user),
) -> List[PredictResponse]:
    """
    Генерация предиктов.

    Данный эндпойнт позволяет пользователю запросить предикты для одного или нескольких изображений. Он принимает на вход
    объект PredictRequest, содержащий данные для предсказания, и возвращает список объектов PredictResponse, содержащих
    информацию о созданных запросах.

    Args:
        predict_data (PredictRequest): Данные для предсказания.
        current_user (UserDto): Объект, содержащий информацию об авторизованном пользователе.

    Returns:
        List[PredictResponse]: Список объектов PredictResponse, содержащих id предикта.

    Raises:
        HTTPException: Если произошла ошибка при обработке запроса на предсказание.
    """

    try:
        logger.info(f"Received predict request for user: {current_user.name}")
        
        requests = []
        for _ in range(predict_data.n_variants):

            # Cохранение в бд запроса
            req = await add_request(user_id = current_user.id, predict_data= predict_data)
                        
            requests.append(PredictResponse(id=req.id, status= req.status))
            
            await send_task(req.id, predict_data, current_user.id)

        return requests
    
    except Exception as e:
        logger.error(f"Error occurred during predict request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))




@router.post("/predict_image_to_image", response_model=List[PredictResponse], status_code=status.HTTP_200_OK)
async def image_to_image(
    photo_id: int,
    predict_data : PredictRequest,
    current_user: UserDto = Depends(get_current_user),
) -> List[PredictResponse]:
    """
    Image-to-image

    Данный эндпойнт позволяет пользователю запросить предикты для одного или нескольких изображений на основе другого сгенерированного изображения. Он принимает на вход
    объект PredictRequest, содержащий данные для предсказания, photo_id, содержащий id выбранного фото и возвращает список объектов PredictResponse, содержащих
    информацию о созданных запросах.

    Args:
        photo_id (int): id сгенерированной фотограйи.
        predict_data (PredictRequest): Данные для предсказания.
        current_user (UserDto): Объект, содержащий информацию об авторизованном пользователе.

    Returns:
        List[PredictResponse]: Список объектов PredictResponse, содержащих id предикта.

    Raises:
        HTTPException: Если произошла ошибка при обработке запроса на предсказание.
    """
    # TODO
    pass
    # try:
    #     logger.info(f"Received predict request for user: {current_user.name}")
        
    #     requests = []
    #     for _ in range(predict_data.n_variants):

    #         req = await add_request(user_id = current_user.id, predict_data= predict_data)
                        
    #         requests.append(PredictResponse(id=req.id, status= req.status))

    #         s3_req = get_card(photo_id)

    #         await send_image_to_image_task(req.id, predict_data, current_user.id, s3_req.s3_url)

    #     return requests
    
    # except Exception as e:
    #     logger.error(f"Error occurred during predict request: {str(e)}")
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



@router.get("/photo_by_id", status_code=status.HTTP_200_OK)
async def get_photo_by_id(
    id: int,
    current_user: UserDto = Depends(get_current_user),
) -> Optional[PredictData]:
    """
    Получение карточки по идентификатору.

    Данный эндпойнт позволяет получить карточку по её уникальному идентификатору. Он принимает на вход идентификатор карточки
    и возвращает объект PredictData, содержащий информацию о карточке, если она существует.

    Args:
        id (int): Уникальный идентификатор карточки.
        current_user (UserDto): Объект, содержащий информацию об авторизованном пользователе.

    Returns:
        Optional[PredictData]: Объект PredictData, содержащий информацию о карточке, или None, если карточка не найдена.
    """
    ans = await get_response(id)

    if ans:
        return ans
    else:
        return None
    

