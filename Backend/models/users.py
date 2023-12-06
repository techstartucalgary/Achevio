from __future__ import annotations

from typing import List, Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os

from sqlalchemy import Column, ForeignKey, Integer, String, Table, select, Boolean, DateTime
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.orm import relationship

from litestar import Litestar, get, post, put
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException, NotFoundException
from litestar.status_codes import HTTP_409_CONFLICT
from litestar.contrib.sqlalchemy.base import AuditColumns

import datetime
# from sqlalchemy import UUID

from uuid import UUID
# from sqlalchemy import UUID

from uuid_extensions import uuid7, uuid7str




# Base class for our SQLAlchemy models
class Base(DeclarativeBase):
    pass



user_community_association_table = Table(
    'user_community_association_table',
    # Base.metadata,
    UUIDAuditBase.metadata,
    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
)


class User(UUIDAuditBase):
    __tablename__ = 'user_table'
    username : Mapped[str] = mapped_column(String(100), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    profile_picture: Mapped[str] = mapped_column(String(100), nullable=True)
    password: Mapped[str] = mapped_column(String(60))
    communities: Mapped[list[Community]] = relationship("Community", secondary=user_community_association_table, back_populates='users')
    is_active: Mapped[bool] = mapped_column(Boolean)
    last_login: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True))



class Community(UUIDAuditBase):
    __tablename__ = 'community_table'

    # id: Mapped[UUID] = mapped_column(primary_key=True)
    users: Mapped[list[User]] = relationship("User", secondary=user_community_association_table, back_populates='communities')

