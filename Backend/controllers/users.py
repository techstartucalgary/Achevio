from os import environ
from typing import Optional, Any

from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Response, Request, get, post, put
from litestar import Controller

from uuid_extensions import uuid7, uuid7str

# from models.users import Community, User
from models.users import User
from litestar.dto import DTOData

from litestar.exceptions import HTTPException

# from schemas.users import UserSchema, CreateUserDTO, UserOutDTO, UserLoginDTO
from schemas.users import *
from crud.users import *

from litestar.connection import ASGIConnection
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token
from litestar.openapi.config import OpenAPIConfig

from litestar.stores.memory import MemoryStore

import datetime

import pytz

from .auth import oauth2_auth, login_handler




class UserController(Controller):
    path = '/user'
    return_dto=UserOutDTO

    @get('/')
    async def get_users(self, request: "Request[User, Token, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        return await get_user_list(session, limit, offset)
    

    @get('/me')
    async def get_me(self, request: "Request[User, Token, Any]", session: AsyncSession) -> UserSchema:
        return UserSchema.model_validate(request.user)
    

    @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
        print(data.as_builtins())
        current_time = datetime.datetime.now(pytz.utc)
        user_data = data.create_instance(id=uuid7(), communities=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)
        validated_user_data = UserSchema.model_validate(user_data)
        try:
            session.add(User(**validated_user_data.__dict__))
            return validated_user_data
        except Exception as e:
            raise HTTPException(status_code=409, detail="User with that username exists")


