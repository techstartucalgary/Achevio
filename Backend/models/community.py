from sqlalchemy.orm import relationship
from sqlalchemy import UUID, Boolean
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
    # owner_id: Mapped[UUID] = mapped_column(UUID, nullable=False)2

    image: Mapped[str] = mapped_column(String(100))

    users = relationship('UserCommunityAssociation', back_populates='community')

    public: Mapped[bool] = mapped_column(Boolean, default=False)


    tags: Mapped[list['Tag']] = relationship(
        secondary=community_tag_association,
        lazy='selectin'
    )

    image: Mapped[str] = mapped_column(String(100), nullable=True)
