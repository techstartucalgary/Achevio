from os import environ
from typing import Optional, Any

from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Response, Request, post
from litestar.dto import DTOData
from litestar.exceptions import HTTPException
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token

from schemas.users import *
from models.users import User
from crud.users import *

from uuid_extensions import uuid7, uuid7str




from dotenv import load_dotenv
import os
load_dotenv()

# store = MemoryStore()


from lib.redis import redis as store


async def retrieve_user_handler(token: "Token", session: AsyncSession) -> Optional[User]:
    return await store.get(token.sub)


oauth2_auth = OAuth2PasswordBearerAuth[User](
    retrieve_user_handler=retrieve_user_handler,
    # token_secret=environ.get("JWT_SECRET", "abcd123"),
    token_secret=os.getenv("JWT_SECRET"),
    token_url="/login",

    exclude=["/login", "/schema"],
)



@post("/login", dto=UserLoginDTO)
async def login_handler(request: "Request[Any, Any, Any]", data: "DTOData[UserSchema]", session: AsyncSession) -> "Response[OAuth2Login]":
    input_data = data.as_builtins()
    try:
        user = await get_user(session, input_data['username'])
        if user.password == input_data['password']:
            token = oauth2_auth.login(identifier=str(user.username))
            await store.set(user.username, str(token.cookies), ex=84000)
            return token
    except KeyError:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    raise HTTPException(status_code=401, detail="Incorrect email or password")

