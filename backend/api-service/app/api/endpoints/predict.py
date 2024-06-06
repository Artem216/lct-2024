from fastapi import APIRouter, Depends, HTTPException, status

from schemas.user_schemas import UserDto
from db.dependencies import get_current_user

from schemas.predict_schemas import PredictResponse, PredictRequest
import grpc
import proto.service_pb2_grpc as pb2_grpc
import proto.service_pb2 as pb2
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["predict"])

@router.post("/predict", response_model=PredictResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    predict_data : PredictRequest,
    current_user: UserDto = Depends(get_current_user),
) -> PredictResponse:
    try:
        logger.info(f"Received predict request for user: {current_user.name}")
        
        async with grpc.aio.insecure_channel("ml:50051") as channel:
            stub = pb2_grpc.MLServiceStub(channel)
            tags_1 = 123
            logger.info(f"Sending PhotoRequest to ML service: id={1}, promt={predict_data.prompt}, tags={predict_data.tags}")
            response = await stub.ProcessPhoto(
                pb2.PhotoRequest(
                    id = 1,
                    promt = predict_data.prompt,
                    tags= [pb2.Tag(name=el.tag) for el in predict_data.tags]
                    ) 
                )
        logger.info(f"Received response from ML service: id={response.id}, s3_url={response.s3_url}")

        return PredictResponse(id=response.id, s3_url= response.s3_url)

    except Exception as e:
        logger.error(f"Error occurred during predict request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

