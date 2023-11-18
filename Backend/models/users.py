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




# Base class for our SQLAlchemy models
class Base(DeclarativeBase):
    pass



user_community_association_table = Table(
    'user_community_association_table',
    Base.metadata,
    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
)


class User(Base):
    __tablename__ = 'user_table'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    password: Mapped[str] = mapped_column(String(60))
    communities: Mapped[list[Community]] = relationship("Community", secondary=user_community_association_table, back_populates='users')



class Community(Base):
    __tablename__ = 'community_table'

    id: Mapped[UUID] = mapped_column(primary_key=True)
    users: Mapped[list[User]] = relationship("User", secondary=user_community_association_table, back_populates='communities')




# book_authors = Table('book_authors', Base.metadata,
#     Column('book_id', ForeignKey('books.id'), primary_key=True),
#     Column('author_id', ForeignKey('authors.id'), primary_key=True)
# )

# class Book(Base):
#     __tablename__ = 'books'
#     id = Column(Integer, primary_key=True)
#     title = Column(String, nullable=False)
#     authors = relationship("Author", secondary="book_authors", back_populates='books')

# class Author(Base):
#     __tablename__ = 'authors'
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     books = relationship("Book", secondary="book_authors", back_populates='authors')




# user_communities = Table('user_communities', Base.metadata,
#     Column('community_id', ForeignKey('communities.id'), primary_key=True),
#     Column('user_id', ForeignKey('users.id'), primary_key=True)
# )

# class Community(Base):
#     __tablename__ = 'communities'
#     id = Column(Integer, primary_key=True)
#     title = Column(String, nullable=False)
#     users = relationship("User", secondary="user_communities", back_populates='communities')

# class User(Base):
#     __tablename__ = 'users'
#     id = Column(Integer, primary_key=True)
#     first_name: Mapped[str] = mapped_column(String(100))
#     last_name: Mapped[str] = mapped_column(String(100))
#     email: Mapped[str] = mapped_column(String(100))
#     password: Mapped[str] = mapped_column(String(60))
#     communities = relationship("Community", secondary=user_communities, back_populates='users')




# user_communities = Table('user_communities', UUIDBase.metadata,
#     Column('community_id', ForeignKey('communities.id'), primary_key=True),
#     Column('user_id', ForeignKey('users.id'), primary_key=True)
# )

# class Community(UUIDBase):
#     __tablename__ = 'communities'
#     title = Column(String, nullable=False)
#     users = relationship("User", secondary="user_communities", back_populates='communities')

# class User(UUIDBase):
#     __tablename__ = 'users'
#     first_name: Mapped[str] = mapped_column(String(100))
#     last_name: Mapped[str] = mapped_column(String(100))
#     email: Mapped[str] = mapped_column(String(100))
#     password: Mapped[str] = mapped_column(String(60))
#     communities = relationship("Community", secondary=user_communities, back_populates='users')