from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, UTC
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from .friend import friend_association

from .tag import Tag
from .post import Post
from .user_tag import user_tag_association

from typing import List

class User(UUIDAuditBase):
    __tablename__ = 'user_table'
    username : Mapped[str] = mapped_column(String(100), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    profile_picture: Mapped[str] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now(UTC))
    password: Mapped[str] = mapped_column(String(255))
    done_tutorial: Mapped[bool] = mapped_column(Boolean, default=False)

    interests: Mapped[list['Tag']] = relationship(
        secondary=user_tag_association,
        lazy='selectin',
    )

    xp: Mapped[int] = mapped_column(Integer, default=0)
    

    communities = relationship('UserCommunityAssociation', back_populates='user')

    posts: Mapped[List['Post']] = relationship(lazy='selectin')
    
    # friends: Mapped[list["User"]] = relationship(
    #     "User",
    #     secondary=friend_association,
    #     primaryjoin=id == friend_association.c.user_id,
    #     secondaryjoin=id == friend_association.c.friend_id,
    #     back_populates="friends",
    #     foreign_keys=[friend_association.c.user_id, friend_association.c.friend_id],
    # )


    friends = relationship('User',
                           secondary=friend_association,
                           primaryjoin='User.id==friend_association_table.c.user_id',
                           secondaryjoin='User.id==friend_association_table.c.friend_id',
                           lazy='selectin',
    )