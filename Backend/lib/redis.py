from redis.asyncio import Redis

from dotenv import load_dotenv
import os

load_dotenv()

__all__ = ["redis"]

redis = Redis.from_url(os.getenv("REDIS_URL"))

