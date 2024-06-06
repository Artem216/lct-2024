import asyncio
import logging
from grpc_server import serve

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    logger.info("Starting ml service")
    await asyncio.gather(serve())

if __name__ == "__main__":
    asyncio.run(main())
