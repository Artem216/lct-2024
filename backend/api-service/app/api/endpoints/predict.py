from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto
from db.dependencies import get_current_user

from schemas.predict_schemas import PredictResponse, PredictRequest
from services.predict_service import add_request, add_response

import grpc
import proto.service_pb2_grpc as pb2_grpc
import proto.service_pb2 as pb2
from config import logger

router = APIRouter(prefix="", tags=["predict"])

@router.post("/predict", response_model=PredictResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    predict_data : PredictRequest,
    current_user: UserDto = Depends(get_current_user),
) -> PredictResponse:
    try:
        logger.info(f"Received predict request for user: {current_user.name}")
        

        # Cохранение в бд запроса
        req = await add_request(user_id = current_user.id, predict_data= predict_data)
        logger.info(req)

        async with grpc.aio.insecure_channel("ml:50051") as channel:
            logger.info("Привет gRPC")
            stub = pb2_grpc.MLServiceStub(channel)
            req_id = req.id
            req_tags = [pb2.Tag(name=el.tag) for el in predict_data.tags]

            logger.info(f"Sending PhotoRequest to ML service: id={req_id}, promt={predict_data.prompt}, tags={predict_data.tags}")
            response = await stub.ProcessPhoto(
                pb2.PhotoRequest(
                    id = req_id,
                    promt = predict_data.prompt,
                    # width= predict_data.width,
                    # height= predict_data.height,
                    tags= req_tags 
                    ) 
                )
        
        logger.info(f"Received response from ML service: id={response.id}, s3_url={response.s3_url}")

        # Cохранение в бд ответа
        bd_response = await add_response(req_id, response.s3_url, current_user.id)

        return PredictResponse(id=bd_response.id, s3_url= bd_response.s3_url)

    except Exception as e:
        logger.error(f"Error occurred during predict request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

