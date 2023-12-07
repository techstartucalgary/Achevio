# Import necessary modules and libraries
from os import environ
from typing import Optional, Any
import datetime
import pytz
from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put
from litestar import Controller
from uuid_extensions import uuid7, uuid7str
from models.users import User
from litestar.dto import DTOData
from litestar.exceptions import HTTPException
from schemas.users import *
from crud.users import *
from litestar.connection import ASGIConnection
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token
from litestar.openapi.config import OpenAPIConfig
from litestar.stores.memory import MemoryStore
from .auth import oauth2_auth, login_handler
from lib.redis import redis

# Define a UserController class that inherits from Controller
class UserController(Controller):
    # Define the base path for this controller
    path = '/user'
    # Specify the return DTO (Data Transfer Object) for the controller
    return_dto = UserOutDTO

    # Define a GET route for retrieving a list of users
    @get('/')
    async def get_users(self, request: "Request[User, Token, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        """
        Get a list of users.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            limit (int): The maximum number of users to retrieve.
            offset (int): The offset for paginating through users.

        Returns:
            list[UserSchema]: A list of user objects in UserSchema format.
        """
        return await get_user_list(session, limit, offset)

    # Define a GET route for retrieving the current user's information
    @get('/me')
    async def get_me(self, request: "Request[User, Token, Any]", session: AsyncSession) -> UserSchema:
        """
        Get the user's own information.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.

        Returns:
            UserSchema: The user's information in UserSchema format.
        """
        return UserSchema.model_validate(request.user)

    # Define a POST route for creating a new user
    @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
        """
        Create a new user.

        Args:
            session (AsyncSession): The database session.
            data (DTOData[UserSchema]): Data for creating the new user.

        Returns:
            UserSchema: The created user's information in UserSchema format.
        
        Raises:
            HTTPException: If a user with the same username already exists.
        """
        current_time = datetime.datetime.now(pytz.utc)
        user_data = data.create_instance(id=uuid7(), communities=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)
        validated_user_data = UserSchema.model_validate(user_data)
        validated_user_data.set_password(validated_user_data.password)
        try:
            session.add(User(**validated_user_data.__dict__))
            return validated_user_data
        except Exception as e:
            raise HTTPException(status_code=409, detail=f"User with that username exists")

    # Define a GET route for testing, excluding it from authentication Delete later on!
    @get('/test', exclude_from_auth=True)
    async def test(self) -> str:
        """
        Test route for Redis functionality.

        Returns:
            str: A test message from Redis.
        """
        await redis.set("foo", "bar")
        return await redis.get("foo")
