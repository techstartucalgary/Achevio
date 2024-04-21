from typing import TYPE_CHECKING

from litestar.contrib.sqlalchemy.base import UUIDBase
from sqlalchemy import String
from sqlalchemy.orm import relationship, Mapped, mapped_column

if TYPE_CHECKING:
    from .community import Community


class Tag(UUIDBase):
    __tablename__ = 'tag_table'
    name: Mapped[str] = mapped_column(String(100), unique=True)
    color: Mapped[str] = mapped_column(String(100), unique=True)