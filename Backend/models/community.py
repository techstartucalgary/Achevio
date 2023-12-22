from __future__ import annotations
from typing import TYPE_CHECKING

from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from sqlalchemy import String

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

if TYPE_CHECKING:
    from .users import User



# Define the Community model
class Community(UUIDAuditBase):
    __tablename__ = 'community_table'
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(String(100), unique=True)
    users: Mapped[list["User"]] = relationship("User", secondary="user_community_association_table", back_populates='communities')
