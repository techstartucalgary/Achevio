from __future__ import annotations

from uuid import UUID
from enum import Enum
from .schema import Schema



class UserCommunityAssociationSchema(Schema):
    user_id: UUID
    community_id: UUID

    community: CommunityBaseSchema
    
    role: str
    current_nb_of_days: int = 0
    goal_nb_of_days: int
    streak: int = 0

from .community import CommunityBaseSchema
