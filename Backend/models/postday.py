from typing import TYPE_CHECKING

from sqlalchemy.orm import relationship
from sqlalchemy import UUID, Column, Integer
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Boolean, DateTime

from .community_postday import community_postday_association

if TYPE_CHECKING:
    from .community import Community


class Postday(UUIDBase):
    __tablename__ = "postday_table"
    day: Mapped[str] = mapped_column(String(10), unique=True)
    
    communities: Mapped[list['Community']] = relationship(
        secondary=community_postday_association,
        back_populates="postdays",
        lazy='selectin'
    )