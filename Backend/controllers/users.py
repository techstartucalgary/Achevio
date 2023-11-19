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


from litestar.connection import ASGIConnection
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token
from litestar.openapi.config import OpenAPIConfig


# Test data (replace with Redis)
MOCK_DB: dict[str, User] = {
    "string": User(
        id=uuid7(),
        username="string",
        first_name="string",
        last_name="string",
        email="string",
        password="string",
        communities=[],
    ),
    "Wilbur": User(
        id=uuid7(),
        username="string",
        first_name="Wilbur",
        last_name="string",
        email="string",
        password="string",
        communities=[],
    )}

async def retrieve_user_handler(token: "Token", connection: "ASGIConnection[Any, Any, Any, Any]") -> Optional[User]:
    return MOCK_DB.get(token.sub)

oauth2_auth = OAuth2PasswordBearerAuth[User](
    retrieve_user_handler=retrieve_user_handler,
    token_secret=environ.get("JWT_SECRET", "abcd123"),
    token_url="/login",

    exclude=["/login", "/schema"],
)



async def get_user_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
    query = select(User).options(orm.selectinload(User.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return [UserSchema.model_validate(user) for user in result.scalars().all()]




class UserController(Controller):
    path = '/user'
    return_dto=UserOutDTO

    @get('/')
    async def get_users(self, request: "Request[User, Token, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        return await get_user_list(session, limit, offset)

    @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
        user_data = data.create_instance(id=uuid7(), communities=[])
        validated_user_data = UserSchema.model_validate(user_data)
        try:
            session.add(User(**validated_user_data.__dict__))
            return UserSchema.model_validate(validated_user_data)   
        except IntegrityError:
            raise HTTPException(status_code=409, detail="User with that email exists")


@post("/login", dto=UserLoginDTO)
async def login_handler(request: "Request[Any, Any, Any]", data: "DTOData[UserLoginSchema]") -> "Response[OAuth2Login]":
    data = data.create_instance()
    try:
        if MOCK_DB[str(data.email)].password == data.password:
            return oauth2_auth.login(identifier=str(data.email))
    except KeyError:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

@get("/some-path", sync_to_thread=False)
def some_route_handler(request: "Request[User, Token, Any]") -> Any:
    assert isinstance(request.user, User)
    assert isinstance(request.auth, Token)
