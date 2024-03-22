from __future__ import annotations

from uuid import UUID
from enum import Enum
from .schema import Schema


class UserCommunityAssociationSchema(Schema):
    user_id: UUID
    community_id: UUID
    
    role: str
    current_nb_of_days: int
    goal_nb_of_days: str
    streak: int = 0

