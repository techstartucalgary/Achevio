from __future__ import annotations
from typing import TYPE_CHECKING

import argon2
from dotenv import load_dotenv

from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase

from sqlalchemy import Column, ForeignKey, Integer, String, Table, select, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.orm import relationship

import datetime
from uuid import UUID
from uuid_extensions import uuid7, uuid7str


if TYPE_CHECKING:
    from .community import Community


# Hash passwords using Argon2
ph = argon2.PasswordHasher()

# from .community import Community
from .user_community import user_community_association_table


# Define the User model
class User(UUIDAuditBase):
    __tablename__ = 'user_table'
    username : Mapped[str] = mapped_column(String(100), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    profile_picture: Mapped[str] = mapped_column(String(100), nullable=True)
    password: Mapped[str] = mapped_column(String(255))
    communities: Mapped[list["Community"]] = relationship("Community", secondary=user_community_association_table, back_populates='users')
    is_active: Mapped[bool] = mapped_column(Boolean)
    last_login: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True))


