from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Boolean, DateTime
import datetime
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from .friend import friend_association

from .post import Post


class User(UUIDAuditBase):
    __tablename__ = 'user_table'
    username : Mapped[str] = mapped_column(String(100), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    profile_picture: Mapped[str] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean)
    last_login: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True))
    password: Mapped[str] = mapped_column(String(255))

    communities = relationship('UserCommunityAssociation', back_populates='user')

    posts: Mapped[list['Post']] = relationship(lazy='selectin')
    
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