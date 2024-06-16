from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Query, Form, Body
from fastapi.encoders import jsonable_encoder

from db.dependencies import get_current_user

from schemas.user_schemas import UserDto
from schemas.find_schemas import AllCards
from schemas.predict_schemas import PredictResponse, PredictRequest, PredictData, PredictRequestFile

from services.predict_service import add_request, get_response
# from services.find_service import get_card

from utils.kafka_producer import send_task, send_file_task
from utils.csv_utils import find_row_by_id, get_values_by_cluster

from typing import List, Optional

from pydantic import  ValidationError

import asyncio
import csv
import io

from config import logger

router = APIRouter(prefix="", tags=["predict"])


def checker(data: str = Form(...)):
    try:
        return PredictRequestFile.model_validate_json(data)
    except ValidationError as e:
        raise HTTPException(
            detail=jsonable_encoder(e.errors()),
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


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


@router.post("/predict_file", response_model=List[PredictResponse], status_code=status.HTTP_200_OK)
async def file_to_text(
    predict_data_file: PredictRequestFile = Depends(checker),
    file: UploadFile = File(...),
    current_user: UserDto = Depends(get_current_user),
) -> List[PredictResponse]:
    try:
        logger.info(f"Received predict request for user: {current_user.name}")
        contents = await file.read()
        csv_reader = csv.DictReader(io.StringIO(contents.decode('utf-8')))
        
        requests = []

        for _ in range(predict_data_file.n_variants):
            req = await add_request(user_id=current_user.id, predict_data=predict_data_file)
            requests.append(PredictResponse(id=req.id, status=req.status))

            if predict_data_file.id_user_from_csv:
                for row in csv_reader:
                    if int(row.get('id', -1)) == predict_data_file.id_user_from_csv:
                        new_file = row
                logger.info(new_file)
                if new_file:
                    await send_file_task(req.id, predict_data_file, current_user.id, new_file)
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{new_file}")

            if predict_data_file.cluster_name:
                new_file = []
                for row in csv_reader:
                    if str(row.get('super_clust', '-1')) == predict_data_file.cluster_name:
                        new_file.append(row)
                logger.info(new_file)
                if new_file:
                    await send_file_task(req.id, predict_data_file, current_user.id, new_file)
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{new_file}")
                
        return requests
    
    except Exception as e:
        logger.error(f"Error occurred during predict request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))




@router.get("/photo_by_id", status_code=status.HTTP_200_OK)
async def get_photo_by_id(
    q: List[int] = Query(None),
    current_user: UserDto = Depends(get_current_user),
) -> List[AllCards]:
    """
    Получение карточки по идентификатору.

    Данный эндпойнт позволяет получить карточку по её уникальному идентификатору. Он принимает на вход идентификатор карточки
    и возвращает объект PredictData, содержащий информацию о карточке, если она существует.

    Args:
        id (int): Уникальный идентификатор карточки.
        current_user (UserDto): Объект, содержащий информацию об авторизованном пользователе.

    Returns:
        List[AllCards]: Объект PredictData, содержащий информацию о карточке, или None, если карточка не найдена.
    """
    try:
        if q:
            result = await asyncio.gather(*[ get_response(id) for id in q ])

        if result:
            return result
        else:
            return None
    except Exception as e:
        logger.error(f"Error occurred during predict request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))    



