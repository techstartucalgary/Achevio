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


from datetime import datetime

class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}



class UserSchema(Schema):
    id: UUID
    username: str
    first_name: str
    last_name: str
    email: str
    profile_picture: Optional[str] = None
    password: str
    created_at: datetime
    updated_at: datetime
    is_active: bool
    last_login: datetime

    communities: list[CommunitySchema] = []

    
class CommunitySchema(Schema):
    id: UUID    
    name: str
    description: str
    users: list[UserSchema] = []




class UserDTO(PydanticDTO[UserSchema]):
    config = DTOConfig()


class UserLoginDTO(UserDTO):
    config = DTOConfig(include={'username', 'password'})


class CreateUserDTO(PydanticDTO[UserSchema]):
    config = DTOConfig(include={'username', 'first_name', 'last_name', 'email', 'password'})


class UserOutDTO(PydanticDTO[UserSchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )



class CommunityDTO(PydanticDTO[CommunitySchema]):
    pass


class CreateCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(exclude={'id', 'users'})



class CommunityOutDTO(PydanticDTO[CommunitySchema]):
    pass


