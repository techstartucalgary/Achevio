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



store = MemoryStore()

async def retrieve_user_handler(token: "Token", session: AsyncSession) -> Optional[User]:
    return await store.get(token.sub)

oauth2_auth = OAuth2PasswordBearerAuth[User](
    retrieve_user_handler=retrieve_user_handler,
    token_secret=environ.get("JWT_SECRET", "abcd123"),
    token_url="/login",

    exclude=["/login", "/schema"],
)



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
        user_data = data.create_instance(id=uuid7(), communities=[])
        validated_user_data = UserSchema.model_validate(user_data)
        try:
            session.add(User(**validated_user_data.__dict__))
            return UserSchema.model_validate(validated_user_data)   
        except IntegrityError:
            raise HTTPException(status_code=409, detail="User with that username exists")


@post("/login", dto=UserLoginDTO)
async def login_handler(request: "Request[Any, Any, Any]", data: "DTOData[UserLoginSchema]", session: AsyncSession) -> "Response[OAuth2Login]":
    data = data.create_instance()
    try:
        user = await get_user(session, data.username)
        if user.password == data.password:
            await store.set(user.username, user, expires_in=84000)
            return oauth2_auth.login(identifier=str(user.username))
        # if MOCK_DB[str(data.email)].password == data.password:
        #     return oauth2_auth.login(identifier=str(data.email))
    except KeyError:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    raise HTTPException(status_code=401, detail="Incorrect email or password")

