from __future__ import annotations

from sqlalchemy import Column, UniqueConstraint
from sqlalchemy import Table
from sqlalchemy import ForeignKey, UUID
from litestar.contrib.sqlalchemy.base import UUIDBase


# friend_association = Table(
#     'friend_association_table',
#     UUIDBase.metadata,
#     Column('user_id', UUID, ForeignKey('user_table.id'), primary_key=True),
#     Column('friend_id', UUID, ForeignKey('user_table.id'), primary_key=True),
# )


friend_association = Table(
    'friend_association_table', 
    UUIDBase.metadata,
    Column('user_id', UUID, ForeignKey('user_table.id'), index=True),
    Column('friend_id', UUID, ForeignKey('user_table.id')),
    UniqueConstraint('user_id', 'friend_id', name='unique_friendships'))