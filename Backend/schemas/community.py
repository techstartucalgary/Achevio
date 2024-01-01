from __future__ import annotations
from typing import Optional

from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO
from .schema import Schema

# Define the CommunitySchema class for community data
class CommunitySchema(Schema):
    id: UUID    
    owner_id: UUID
    name: str
    description: str
    users: "list[UserCommunityAssociationSchema]" = None


    postdays: "list[CreatePostdaySchema]"


class BaseCommunitySchema(Schema):
    id: UUID    
    owner_id: UUID
    name: str
    description: str
    users: "list[UserCommunityAssociationSchema]" = None


# Define a DTO for community data
class CommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )

# Define a DTO for creating a new community
class CreateCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(exclude={'id', 'users', 'owner_id', 'postdays.0.id'})

# Define a DTO for community data output
class CommunityOutDTO(PydanticDTO[CommunitySchema]):
    pass


# from .postday import PostdaySchema
from .postday import CreatePostdaySchema
from .user_community_association import UserCommunityAssociationSchema
CommunitySchema.model_rebuild()




