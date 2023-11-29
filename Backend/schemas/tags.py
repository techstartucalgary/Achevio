from __future__ import annotations

from typing import Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from litestar import Litestar, get, post, put
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException, NotFoundException
from litestar.status_codes import HTTP_409_CONFLICT

from uuid import UUID
from uuid_extensions import uuid7, uuid7str

from litestar.dto import DataclassDTO, DTOConfig

from litestar.contrib.pydantic import PydanticDTO
from pydantic import BaseModel as _BaseModel
from users import CommunitySchema

class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}

class TagSchema(Schema):
    id: UUID
    name: str
    communities: list[CommunitySchema] = []



class TagDTO(PydanticDTO[TagSchema]):
    pass


class CreateTagDTO(PydanticDTO[TagSchema]):
    config = DTOConfig(exclude={'id', 'communities'})

class TagOutDTO(PydanticDTO[TagSchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )

