from __future__ import annotations

from uuid import UUID
from enum import Enum
from .schema import Schema

from litestar.contrib.pydantic import PydanticDTO



class RoleEnum(str, Enum):
    Owner = "owner"
    Admin = "admin"
    Member = "member"


class UserCommunityAssociationSchema(Schema):
    user_id: UUID
    community_id: UUID
    role: str

    goal_days: int
    current_days: int
    streak: int

    season_xp: int

    tier: str

class UserCommunityAssociationSchemaView(UserCommunityAssociationSchema):
    tags: list[TagSchema] = []
    name: str


class UserCommunityAssociationDTO(PydanticDTO[UserCommunityAssociationSchema]):
    pass

class UserCommunityAssociationSchemaViewDTO(PydanticDTO[UserCommunityAssociationSchemaView]):
    pass

from .tag import TagSchema
from .community import CommunitySchema
UserCommunityAssociationSchema.model_rebuild()