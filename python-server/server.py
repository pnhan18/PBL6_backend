import grpc
from concurrent import futures
import sys
sys.path.append('generated')
from sign_language_pb2 import RecognitionFileResult
from sign_language_pb2_grpc import add_SignLanguageRecognitionServiceServicer_to_server
from services.RecognitionService import RecognitionService



def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_SignLanguageRecognitionServiceServicer_to_server(RecognitionService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051.")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
