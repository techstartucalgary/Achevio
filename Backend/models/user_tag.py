from __future__ import annotations

from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from litestar.contrib.sqlalchemy.base import UUIDBase


user_tag_association = Table(
    'user_tag_association_table',
    UUIDBase.metadata,
    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
    Column('tag_id', ForeignKey('tag_table.id'), primary_key=True),
)
