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

from pydantic import BaseModel as _BaseModel



class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}



class UserBase(Schema):
    id: UUID
    
    first_name: str
    last_name: str
    email: str
    password: str
    

class CommunityBase(Schema):
    id: UUID

    name: str
    description: str
    

class UserSchema(UserBase):
    users: list[UserBase]


class CommunitySchema(CommunityBase):
    communities: list[CommunityBase]