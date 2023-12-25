from typing import Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os
from litestar.config.cors import CORSConfig

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from litestar import Litestar, get, post, put
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException, NotFoundException
from litestar.status_codes import HTTP_409_CONFLICT

from uuid import UUID
from uuid_extensions import uuid7, uuid7str
from controllers.community import CommunityController


from controllers.users import *
from controllers.auth import oauth2_auth, login_handler, logout_handler
from models.base import Base

from lib import (
    openapi,
    cache
)

from litestar.stores.registry import StoreRegistry

load_dotenv()



# This function is used to provide a transactional session to the endpoints
async def provide_transaction(db_session: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    try:
        async with db_session.begin():  # Begin a transaction
            yield db_session
    except IntegrityError as exc:  # Catch any integrity errors from the database
        # Raise a client exception if an integrity error occurs
        raise ClientException(
            status_code=HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc




# Function that will run on app startup
async def on_startup() -> None:
    """Initializes the database."""
    async with db_config.get_engine().begin() as conn:
        # Drop and recreate tables (remove this line if persistence is needed)

        # await conn.run_sync(Base.metadata.drop_all)        
        # await conn.run_sync(UUIDBase.metadata.drop_all)
        # await conn.run_sync(UUIDAuditBase.metadata.drop_all)

        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(UUIDBase.metadata.create_all)
        await conn.run_sync(UUIDAuditBase.metadata.create_all)






# Database configuration using environment variables
db_config = SQLAlchemyAsyncConfig(
    connection_string=os.getenv('DB_URL'))




cors_config = CORSConfig(allow_origins=["*"]) # NOTE: Change it for production

# Create the Litestar application instance
app = Litestar(
    [UserController, CommunityController, login_handler, logout_handler],  # List of endpoint functions
    dependencies={"session": provide_transaction},  # Dependency to inject session into endpoints
    plugins=[SQLAlchemyPlugin(db_config)],  # Plugin for SQLAlchemy support
    stores=StoreRegistry(default_factory=cache.redis_store_factory),
    openapi_config=openapi.config,
    on_startup=[on_startup],  # Startup event handler
    on_app_init=[oauth2_auth.on_app_init],
    cors_config=cors_config,
)