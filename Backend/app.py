from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os
from litestar.config.cors import CORSConfig

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Litestar
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException
from litestar.status_codes import HTTP_409_CONFLICT
from litestar.static_files.config import StaticFilesConfig

from controllers.community import CommunityController
from controllers.user import UserController
from controllers.initialize import InitializeController
from controllers.tag import TagController
from controllers.post import PostController
from controllers.admin import AdminController
from controllers.auth import oauth2_auth, login_handler, logout_handler
from lib.seed import seed_data

from lib.scheduler import scheduler, weekly_reset

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

        await conn.run_sync(Base.metadata.drop_all)        
        await conn.run_sync(UUIDBase.metadata.drop_all)
        await conn.run_sync(UUIDAuditBase.metadata.drop_all)

        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(UUIDBase.metadata.create_all)
        await conn.run_sync(UUIDAuditBase.metadata.create_all)


    async with db_config.get_session() as session:
        # Seed the database with initial data
        await seed_data(session)
        await session.commit()

        # Start the scheduler
        scheduler.add_job(weekly_reset, args=[session], trigger='cron', day_of_week='sun', hour=0, minute=0, second=0)
        # scheduler.add_job(weekly_reset, args=[session], trigger='interval', seconds=5)      # For testing purposes
        scheduler.start()






# Database configuration using environment variables
db_config = SQLAlchemyAsyncConfig(
    connection_string=os.getenv('DB_URL'))




cors_config = CORSConfig(allow_origins=["*"]) # NOTE: Change it for production

# Create the Litestar application instance
app = Litestar(
    [login_handler, logout_handler, UserController, CommunityController, InitializeController, TagController, PostController, AdminController],  # List of endpoint functions
    dependencies={"session": provide_transaction},  # Dependency to inject session into endpoints
    plugins=[SQLAlchemyPlugin(db_config)],  # Plugin for SQLAlchemy support
    stores=StoreRegistry(default_factory=cache.redis_store_factory), # Redis setup
    openapi_config=openapi.config, # OpenAPI configuration for Swagger UI
    on_startup=[on_startup],  # Startup event handler to initialize DB tables
    on_app_init=[oauth2_auth.on_app_init],  # Startup event handler to initialize OAuth2
    cors_config=cors_config, # CORS configuration
    static_files_config=[   # Static files configuration for user and post images
        StaticFilesConfig(directories=['static/images/users'], path='/user/image'),
        StaticFilesConfig(directories=['static/images/posts'], path='/post/image'),
        StaticFilesConfig(directories=['static/images/communities'], path='/community/image'), # Images provided by Freepik
        StaticFilesConfig(directories=['static/images/backgrounds'], path='/background/image'), # Images provided by Freepik
    ]
)