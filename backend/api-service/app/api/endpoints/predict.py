from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto
from db.dependencies import get_current_user

from schemas.predict_schemas import PredictResponse, PredictRequest, PredictData
from services.predict_service import add_request, get_response
from utils.kafka_producer import send_task

from typing import List, Optional

# import grpc
# import proto.service_pb2_grpc as pb2_grpc
# import proto.service_pb2 as pb2
from config import logger

router = APIRouter(prefix="", tags=["predict"])


@router.post("/predict", response_model=List[PredictResponse], status_code=status.HTTP_200_OK)
async def predict(
    predict_data : PredictRequest,
    current_user: UserDto = Depends(get_current_user),
) -> List[PredictResponse]:
    try:
        logger.info(f"Received predict request for user: {current_user.name}")
        
        requests = []
        for _ in range(predict_data.n_variants):

            # Cохранение в бд запроса
            req = await add_request(user_id = current_user.id, predict_data= predict_data)
                        
            requests.append(PredictResponse(id=req.id, status= req.status))
            
            await send_task(req.id, predict_data, current_user.id)


        # gRPC если вдруг kafka не заведётся 

        # async with grpc.aio.insecure_channel("localhost:50051") as channel:
        #     stub = pb2_grpc.MLServiceStub(channel)
        #     req_id = req.id
        #     req_tags = [pb2.Tag(name=el.tag) for el in predict_data.tags]

        #     logger.info(f"Sending PhotoRequest to ML service: id={req_id}, promt={predict_data.prompt}, tags={predict_data.tags}")
        #     response = await stub.ProcessPhoto(
        #         pb2.PhotoRequest(
        #             id = req_id,
        #             promt = predict_data.prompt,
        #             widht= predict_data.width,
        #             height= predict_data.height,
        #             goal = predict_data.goal,
        #             tags= req_tags 
        #             ) 
        #         )
        
        # logger.info(f"Received response from ML service: id={response.id}, s3_url={response.s3_url}")

        # Cохранение в бд ответа
        # bd_response = await add_response(req_id, response.s3_url, current_user.id)

        return requests
    
    except Exception as e:
        logger.error(f"Error occurred during predict request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))




@router.get("/photo_by_id", status_code=status.HTTP_200_OK)
async def get_photo_by_id(
    id: int,
    current_user: UserDto = Depends(get_current_user),
) -> Optional[PredictData]:
    
    ans = await get_response(id)

    if ans:
        return ans
    else:
        return None