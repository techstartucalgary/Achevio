from __future__ import annotations

from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from litestar.contrib.sqlalchemy.base import UUIDBase


community_request = Table(
    'community_request_association_table',
    UUIDBase.metadata,
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
    Column('user_id', ForeignKey('user_table.id'), primary_key=True),
)
