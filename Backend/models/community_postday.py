from __future__ import annotations

from sqlalchemy import Column
from sqlalchemy import Table
from sqlalchemy import ForeignKey
from litestar.contrib.sqlalchemy.base import UUIDBase


community_postday_association = Table(
    "community_postday_association_table",
    UUIDBase.metadata,
    Column("community_id", ForeignKey("community_table.id"), primary_key=True),
    Column("postday_id", ForeignKey("postday_table.id"), primary_key=True),
)
