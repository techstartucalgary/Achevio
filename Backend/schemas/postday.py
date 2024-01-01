from __future__ import annotations

from typing import TYPE_CHECKING, Optional, Any
from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from .schema import Schema


class PostdaySchema(Schema):
    id: UUID
    day: str
    
    communities: list[CommunitySchema] = []


class CreatePostdaySchema(Schema):
    day: str


class PostdayDTO(PydanticDTO[PostdaySchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )


class CreatePostdayDTO(PydanticDTO[PostdaySchema]):
    config = DTOConfig(exclude={'id', 'communities'})


from .community import CommunitySchema
from .user_community_association import UserCommunityAssociationSchema
PostdaySchema.model_rebuild()
