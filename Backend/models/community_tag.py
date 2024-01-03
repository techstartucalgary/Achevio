from __future__ import annotations

from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from litestar.contrib.sqlalchemy.base import UUIDBase


community_tag_association = Table(
    'community_tag_association_table',
    UUIDBase.metadata,
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
    Column('tag_id', ForeignKey('tag_table.id'), primary_key=True),
)
