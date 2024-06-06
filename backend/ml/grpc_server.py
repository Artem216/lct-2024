import grpc
from concurrent import futures
import proto.service_pb2_grpc as pb2_grpc
import proto.service_pb2 as pb2
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MlServiceServicer(pb2_grpc.MLServiceServicer):

    async def ProcessPhoto(self, request, context):
        request_id = request.id
        request_prompt = request.promt
        logger.info(f"Received task for video_id: {request_id}")

        return pb2.PhotoResponse(id= request_id ,s3_url= "123123" , status="Task Received to framer")

async def serve():
    server = grpc.aio.server()
    pb2_grpc.add_MLServiceServicer_to_server(MlServiceServicer(), server)
    server.add_insecure_port('[::]:50051')
    logger.info("Starting gRPC server on port 50051")
    await server.start()
    await server.wait_for_termination()
