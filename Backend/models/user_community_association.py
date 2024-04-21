# Association.py
from sqlalchemy import Column, ForeignKey, String, UUID, Integer
from sqlalchemy.orm import relationship
from litestar.contrib.sqlalchemy.base import UUIDBase
import enum

from sqlalchemy.schema import UniqueConstraint

class UserCommunityRoles(enum.Enum):
    Owner = 'Owner'
    Admin = 'Admin'
    Member = 'Member'


class UserCommunityAssociation(UUIDBase):
    __tablename__ = 'user_community_association_table'
    user_id = Column(UUID, ForeignKey('user_table.id'))
    community_id = Column(UUID, ForeignKey('community_table.id'))

    role = Column(String)
    community_name = Column(String)

    goal_days = Column(Integer)
    current_days = Column(Integer, default = 0)
    streak = Column(Integer, default = 0)

    community = relationship('Community', back_populates='users')
    user = relationship('User', back_populates='communities')


    __table_args__ = (
        UniqueConstraint('user_id', 'community_id'),
    )