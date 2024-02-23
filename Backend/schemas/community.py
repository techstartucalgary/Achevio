from __future__ import annotations
from typing import Optional

from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from .schema import Schema

from datetime import datetime
    
class CommunitySchema(Schema):
    id: UUID    
    # owner_id: UUID
    name: str
    description: str
    image: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    users: list[UserCommunityAssociationSchema] = None

    postdays: list[PostdaySchema]

    tags: list[TagSchema]

class CommunitySearchSchema(Schema):
    name: str

    tags: list[TagSchema] = []


class BaseCommunitySchema(Schema):
    id: UUID    
    owner_id: UUID
    name: str
    description: str
    users: list[UserCommunityAssociationSchema] = None


class CommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )


class CreateCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        # exclude={'id', 'users', 'owner_id', 'postdays.0.id'},
        include={'name', 'description', 'postdays.0.day', 'tags'},
        max_nested_depth=2,
    )

class SearchCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        include={'id', 'name', 'tags'},
        max_nested_depth=1,
    )


class CommunityOutDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )


class ViewCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        include={'id', 'name', 'description', 'postday', 'tags'},
        max_nested_depth=2,
    )


# from .postday import PostdaySchema
from .tag import TagSchema
from .postday import PostdaySchema
from .user_community_association import UserCommunityAssociationSchema
CommunitySchema.model_rebuild()




