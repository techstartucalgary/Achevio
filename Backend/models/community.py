from sqlalchemy.orm import relationship
from sqlalchemy import UUID, Column, Integer
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from .community_postday import community_postday_association
from .postday import Postday

class Community(UUIDAuditBase):
    __tablename__ = "community_table"
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(String(100))
    owner_id: Mapped[UUID] = mapped_column(UUID, nullable=False)
    users = relationship("UserCommunityAssociation", back_populates="community")

    
    postdays: Mapped[list['Postday']] = relationship(
        secondary=community_postday_association,
        back_populates="communities",
        lazy='selectin'
    )
1