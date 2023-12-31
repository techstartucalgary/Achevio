from sqlalchemy.orm import relationship
from sqlalchemy import UUID
from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import String
from .community_postday import community_postday_association
from .community_tag import community_tag_association
from .postday import Postday
from .tag import Tag


class Community(UUIDAuditBase):
    __tablename__ = 'community_table'
    
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(String(100))
    # owner_id: Mapped[UUID] = mapped_column(UUID, nullable=False)

    users = relationship('UserCommunityAssociation', back_populates='community')
    
    postdays: Mapped[list['Postday']] = relationship(
        secondary=community_postday_association,
        back_populates='communities'
    )

    tags: Mapped[list['Tag']] = relationship(
        secondary=community_tag_association,
        # lazy='selectin'
    )
