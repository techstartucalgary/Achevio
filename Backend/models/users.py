from __future__ import annotations

import argon2
from dotenv import load_dotenv

from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase

from sqlalchemy import Column, ForeignKey, Integer, String, Table, select, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.orm import relationship

import datetime
from uuid import UUID
from uuid_extensions import uuid7, uuid7str

# Base class for our SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Hash passwords using Argon2
ph = argon2.PasswordHasher()

# Define an association table for user-community relationships
user_community_association_table = Table(
    'user_community_association_table',
    UUIDAuditBase.metadata,
    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
)

# Define the User model
class User(UUIDAuditBase):
    __tablename__ = 'user_table'
    username : Mapped[str] = mapped_column(String(100), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    profile_picture: Mapped[str] = mapped_column(String(100), nullable=True)
    password: Mapped[str] = mapped_column(String(255))
    communities: Mapped[list[Community]] = relationship("Community", secondary=user_community_association_table, back_populates='users')
    is_active: Mapped[bool] = mapped_column(Boolean)
    last_login: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True))

# Define the Community model
class Community(UUIDAuditBase):
    __tablename__ = 'community_table'
    users: Mapped[list[User]] = relationship("User", secondary=user_community_association_table, back_populates='communities')
