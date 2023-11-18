from os import environ
from typing import Optional

from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Response, get, post, put
from litestar import Controller

from uuid_extensions import uuid7, uuid7str

# from models.users import Community, User
from models.users import User
from litestar.dto import DTOData

from schemas.users import UserSchema, CreateUserDTO, UserOutDTO


from litestar.connection import ASGIConnection
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token
from litestar.openapi.config import OpenAPIConfig

MOCK_DB: dict[str, User] = {}

async def retrieve_user_handler(token: "Token", connection: "ASGIConnection[Any, Any, Any, Any]") -> Optional[User]:
    # logic here to retrieve the user instance
    return MOCK_DB.get(token.sub)

oauth2_auth = OAuth2PasswordBearerAuth[User](
    retrieve_user_handler=retrieve_user_handler,
    token_secret=environ.get("JWT_SECRET", "abcd123"),
    # we are specifying the URL for retrieving a JWT access token
    token_url="/login",
    # we are specifying which endpoints should be excluded from authentication. In this case the login endpoint
    # and our openAPI docs.
    exclude=["/login", "/schema"],
)



async def get_user_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
    query = select(User).options(orm.selectinload(User.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return [UserSchema.model_validate(user) for user in result.scalars().all()]




class UserController(Controller):
    path = '/users'

    @get('/', return_dto=UserOutDTO)
    async def get_users(self, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        return await get_user_list(session, limit, offset)

    @post('/', dto=CreateUserDTO, return_dto=UserOutDTO)
    async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
        user_data = data.create_instance(id=uuid7(), communities=[])
        validated_user_data = UserSchema.model_validate(user_data)
        session.add(User(**validated_user_data.__dict__))
        return UserSchema.model_validate(validated_user_data)


        # Given an instance of 'OAuth2PasswordBearerAuth' we can create a login handler function:
    @post("/login")
    async def login_handler(request: "Request[Any, Any, Any]", data: "User") -> "Response[OAuth2Login]":
        MOCK_DB[str(data.id)] = data
        # if we do not define a response body, the login process will return a standard OAuth2 login response.  Note the `Response[OAuth2Login]` return type.

        # you can do whatever you want to update the response instance here
        # e.g. response.set_cookie(...)
        return oauth2_auth.login(identifier=str(data.id))


    @post("/login_custom")
    async def login_custom_response_handler(data: "User") -> "Response[User]":
        MOCK_DB[str(data.id)] = data

        # you can do whatever you want to update the response instance here
        # e.g. response.set_cookie(...)
        return oauth2_auth.login(identifier=str(data.id), response_body=data)