from litestar.config.response_cache import ResponseCacheConfig
from litestar.stores.redis import RedisStore

from .redis import redis

__all__ = ["redis_store_factory"]


def redis_store_factory(name: str) -> RedisStore:
    return RedisStore(redis, namespace=f"{name}")


config = ResponseCacheConfig(default_expiration=84000)
"""Cache configuration for application."""