from typing import TYPE_CHECKING

from litestar.contrib.sqlalchemy.base import UUIDBase
from sqlalchemy import String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .community_postday import community_postday_association

if TYPE_CHECKING:
    from .community import Community


class Postday(UUIDBase):
    __tablename__ = 'postday_table'
    day: Mapped[str] = mapped_column(String(10), unique=True)
    
    communities: Mapped[list['Community']] = relationship(
        secondary=community_postday_association,
        back_populates='postdays',
        lazy='selectin'
    )