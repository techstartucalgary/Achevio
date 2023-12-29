from __future__ import annotations

from uuid import UUID
from enum import Enum
from .schema import Schema




class CommunityPostdaySchema(Schema):
    postday_id: UUID
    community_id: UUID

