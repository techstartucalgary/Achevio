# Association.py
from sqlalchemy import Column, Integer, ForeignKey, String, UUID
from sqlalchemy.orm import relationship
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
import enum
from sqlalchemy import Integer, Enum
from .base import Base
from sqlalchemy.schema import UniqueConstraint, PrimaryKeyConstraint

class UserCommunityRoles(enum.Enum):
    Owner = "Owner"
    Admin = "Admin"
    Member = "Member"


class UserCommunityAssociation(UUIDBase):
    __tablename__ = "association_table"
    user_id = Column(UUID, ForeignKey("user_table.id"))
    community_id = Column(UUID, ForeignKey("community_table.id"))

    role = Column(String)
    community_name = Column(String)

    community = relationship("Community", back_populates="users")
    user = relationship("User", back_populates="communities")


    __table_args__ = (
        UniqueConstraint('user_id', 'community_id'),
    )