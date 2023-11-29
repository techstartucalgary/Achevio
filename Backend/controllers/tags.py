from os import environ
from typing import Optional, Any

from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Response, Request, get, post, put
from litestar import Controller

from uuid_extensions import uuid7, uuid7str

from models.tags import Tag
from litestar.dto import DTOData

from litestar.exceptions import HTTPException


from schemas.tags import *
from crud.tags import *

from litestar.connection import ASGIConnection
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token
from litestar.openapi.config import OpenAPIConfig

from litestar.stores.memory import MemoryStore

store = MemoryStore()

class TagController(Controller):
    path = '/tag'
    return_dto=TagOutDTO

    @get('/')
    async def get_tags(self, request: "Request[Tag, Token, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[TagSchema]:
        return await get_tag_list(session, limit, offset)

    @post('/', dto=CreateTagDTO)
    async def create_tag(self, session: AsyncSession, data: DTOData[TagSchema]) -> TagSchema:
        tag_data = data.create_instance(id=uuid7(), communities=[])
        validated_tag_data = TagSchema.model_validate(tag_data)
        try:
            session.add(Tag(**validated_tag_data.__dict__))
            return TagSchema.model_validate(validated_tag_data)
        except IntegrityError:
            raise HTTPException(status_code=409, detail="Tag with that name exists")