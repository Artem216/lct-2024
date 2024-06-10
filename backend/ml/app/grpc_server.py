# import grpc
# from concurrent import futures
# import proto.service_pb2_grpc as pb2_grpc
# import proto.service_pb2 as pb2
# import logging

# from utils.s3_utils import get_minio_client, upload_fileobj_to_s3
# from utils.model_utils import load_model, predict

# from config import cfg

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# class MlServiceServicer(pb2_grpc.MLServiceServicer):
    
#     def __init__(self):
#         self.client = get_minio_client(cfg.s3_host, cfg.ACCESS_KEY, cfg.SECRET_KEY)
#         self.model = load_model()

#     async def ProcessPhoto(self, request, context):
#         request_id = request.id
#         request_prompt = request.promt

#         img = predict(self.model, request_prompt)

#         bucket_name = cfg.bucket_name
#         object_name = f"output_image{request_id}.png"
#         url = upload_fileobj_to_s3(img, bucket_name, object_name, client=self.client)

#         logger.info(f"Received task for video_id: {request_id}")

#         return pb2.PhotoResponse(id= request_id ,s3_url= url , status="Upload to s3")

# async def serve():
#     server = grpc.aio.server()
#     pb2_grpc.add_MLServiceServicer_to_server(MlServiceServicer(), server)
#     server.add_insecure_port('[::]:50051')
#     logger.info("Starting gRPC server on port 50051")
#     await server.start()
#     await server.wait_for_termination()
