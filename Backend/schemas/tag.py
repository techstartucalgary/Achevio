from __future__ import annotations

from typing import TYPE_CHECKING, Optional, Any
from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from .schema import Schema


class TagSchema(Schema):
    # id: UUID
    name: str
    


class TagDTO(PydanticDTO[TagSchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )

# from .user_community_association import UserCommunityAssociationSchema
from .community import CommunitySchema
from .postday import PostdaySchema
TagSchema.model_rebuild()
