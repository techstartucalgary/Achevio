from typing import Optional
import os

from sqlalchemy import select, orm
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from litestar import Litestar, get, post, put
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException, NotFoundException
from litestar.status_codes import HTTP_409_CONFLICT
from litestar import Controller

from uuid import UUID
from uuid_extensions import uuid7, uuid7str

# from models.users import Community, User
from models.users import *
from litestar.dto import DataclassDTO, DTOConfig, DTOData

# from schemas.users import CreateUserDTO, UserSchema, UserOut, CommunitySchema, CommunityOut, UserOutDTO, UserIn
from schemas.users import *

from crud.users import get_user_list








class UserController(Controller):
    path = '/users'

    @get('/')
    async def get_users(self, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        return await get_user_list(session, limit, offset)

    @post('/', dto=CreateUserDTO, return_dto=UserOutDTO)
    async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
        user_data = data.create_instance(id=uuid7(), communities=[])
        validated_user_data = UserSchema.model_validate(user_data)
        session.add(User(**validated_user_data.__dict__))
        return UserSchema.model_validate(validated_user_data)
        

