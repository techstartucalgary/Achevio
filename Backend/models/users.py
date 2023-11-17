from typing import List, Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os

from sqlalchemy import Column, ForeignKey, Table, select
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

from uuid import UUID
from uuid_extensions import uuid7, uuid7str




# Base class for our SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Our TodoItem model inherits from UUIDAuditBase which includes timestamp and UUID fields
class TodoItem(UUIDAuditBase):
    __tablename__ = 'todo_items'  # Table name in database

    # Mapped columns in the table
    title: Mapped[str] = mapped_column(primary_key=True)  # Title of the todo item, used as the primary key
    done: Mapped[bool]  # Boolean to mark if the todo item is done









#


user_community_association_table = Table(
    'user_community_association_table',
    Base.metadata,
    Column('user_id', ForeignKey('user_table.id')),
    Column('community_id', ForeignKey('community_table.id')),
)


class User(Base):
    __tablename__ = 'user_table'
    
    id: Mapped[UUID] = mapped_column(primary_key=True)
    communities: Mapped[List[UUID]] = relationship(secondary=user_community_association_table, back_populates='users')

class Community(Base):
    __tablename__ = 'community_table'

    id: Mapped[UUID] = mapped_column(primary_key=True)
    users: Mapped[List[UUID]] = relationship(secondary=user_community_association_table, back_populates='users')


