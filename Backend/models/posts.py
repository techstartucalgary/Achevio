from __future__ import annotations

from typing import List, Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os

from sqlalchemy import Column, ForeignKey, Integer, String, Table, select
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

# from sqlalchemy import UUID

from uuid import UUID
# from sqlalchemy import UUID

from uuid_extensions import uuid7, uuid7str

import datetime

# Base class for our SQLAlchemy models
class Base(DeclarativeBase):
    pass

#post_user_association_table = Table(
#    'post_user_association_table',
#    Base.metadata,
#    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
#    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
#)
class Post(Base):
    __tablename__ = 'post_table'
    postId: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(primary_key=True)
    communityId: Mapped[UUID] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    userEmail: Mapped[str] = mapped_column(String(100))   
    datePosted: Mapped[datetime.date] = mapped_column(datetime())   
    imageURL: Mapped[str] = mapped_column(String(100))   

    # set caption char limit to 512 for now
    caption: Mapped[str] = mapped_column(String(512))
   
