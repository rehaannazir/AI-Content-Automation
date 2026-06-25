import time
import logging
from fastapi import Request

logger = logging.getLogger(__name__)

async def logging_middleware(request : Request, call_next):

    start_time = time.perf_counter()

    response = call_next(request)

    actual_time = time.perf_counter() - start_time

    logger.info(
        f"{request.method} "
        f"{request.url} "
        f"{response.status_code} "
        f"{actual_time}s"
    )

    return response
