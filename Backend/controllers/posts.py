from os import environ
from typing import Optional, Any

from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Response, Request, get, post, put
from litestar import Controller

from uuid_extensions import uuid7, uuid7str

from models.posts import Post
from litestar.dto import DTOData

from litestar.exceptions import HTTPException


from schemas.posts import *
from crud.posts import *

from litestar.connection import ASGIConnection
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token
from litestar.openapi.config import OpenAPIConfig

from litestar.stores.memory import MemoryStore

store = MemoryStore()

class PostController(Controller):
    path = '/post'
    return_dto=PostOutDTO
    
    @get('/')
    async def get_posts(self, request: "Request[Post, Token, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[postSchema]:
        return await get_post_list(session, limit, offset)

    @post('/', dto=createPostDTO)
    async def create_post(self, session: AsyncSession, data: DTOData[postSchema]) -> postSchema:
        post_data = data.create_instance(id=uuid7())
        validated_post_data = postSchema.model_validate(post_data)
        try:
            session.add(post(**validated_post_data.__dict__))
            return postSchema.model_validate(validated_post_data)
        except IntegrityError:
            raise HTTPException(status_code=409, detail="A post with this id already exists")