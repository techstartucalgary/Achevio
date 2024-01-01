from __future__ import annotations

from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO

from datetime import datetime

from .schema import Schema

# Define the CommunitySchema class for community data
class PostSchema(Schema):
    id: UUID
    title: str
    caption: str
    image: str

    created_at: datetime
    updated_at: datetime

    user_id: UUID
    community_id: UUID
    


class PostDTO(PydanticDTO[PostSchema]):
    config = DTOConfig()