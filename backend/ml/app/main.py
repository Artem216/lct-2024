import asyncio
import logging

from utils.kafka_consumer import consume

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    logger.info("Starting ml service")
    await asyncio.gather(consume())

if __name__ == "__main__":
    asyncio.run(main())
