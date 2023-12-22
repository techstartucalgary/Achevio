from __future__ import annotations
from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from sqlalchemy import Column, ForeignKey,Table

from .community import Community

user_community_association_table = Table(
    'user_community_association_table',
    UUIDAuditBase.metadata,
    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
)


