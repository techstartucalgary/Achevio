from __future__ import annotations

from uuid import UUID
from enum import Enum
from .schema import Schema



class RoleEnum(str, Enum):
    Owner = "owner"
    Admin = "admin"
    Member = "member"


class UserCommunityAssociationSchema(Schema):
    user_id: UUID
    community_id: UUID
    role: str
    community_name: str
    # community: "CommunitySchema" = None
    # user: "UserSchema" = None



from .users import UserSchema
from .community import CommunitySchema
UserCommunityAssociationSchema.model_rebuild()