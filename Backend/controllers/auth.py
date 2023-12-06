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
from litestar.stores.redis import RedisStore

import datetime

import pytz


store = MemoryStore()

async def retrieve_user_handler(token: "Token", session: AsyncSession) -> Optional[User]:
    return await store.get(token.sub)


oauth2_auth = OAuth2PasswordBearerAuth[User](
    retrieve_user_handler=retrieve_user_handler,
    token_secret=environ.get("JWT_SECRET", "abcd123"),
    token_url="/login",

    exclude=["/login", "/schema"],
)



@post("/login", dto=UserLoginDTO)
async def login_handler(request: "Request[Any, Any, Any]", data: "DTOData[UserSchema]", session: AsyncSession) -> str:
# async def login_handler(request: "Request[Any, Any, Any]", data: "DTOData[UserSchema]", session: AsyncSession) -> "Response[OAuth2Login]":
    input_data = data.as_builtins()
    # data = data.create_instance()
    # return "CHIL"
    try:
        user = await get_user(session, input_data['username'])
        if user.password == input_data['password']:
            await store.set(user.username, user, expires_in=84000)
            return oauth2_auth.login(identifier=str(user.username))
        # if MOCK_DB[str(data.email)].password == data.password:
        #     return oauth2_auth.login(identifier=str(data.email))
    except KeyError:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    raise HTTPException(status_code=401, detail="Incorrect email or password")

