from __future__ import annotations

from datetime import datetime
from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from litestar.datastructures import UploadFile

from .schema import Schema

from pydantic import ConfigDict


# Define the CommunitySchema class for community data
class PostSchema(Schema):
    id: UUID
    title: str
    caption: str

    created_at: datetime
    updated_at: datetime

    user_id: UUID
    community_id: UUID
    


class CreatePostSchema(Schema):
    file: UploadFile    
    title: str
    caption: str
    community_id: UUID

    model_config = ConfigDict(arbitrary_types_allowed=True)

class CreateMultiplePostSchema(Schema):
    file: UploadFile    
    title: str
    caption: str
    communities_id: list[str]

    model_config = ConfigDict(arbitrary_types_allowed=True)

class PostDTO(PydanticDTO[PostSchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )


class CreatePostDTO(PydanticDTO[PostSchema]):
    # pass
    config = DTOConfig(include=['file'])
    
    # config = DTOConfig(include=['title', 'caption', 'file', 'community_id'])

class CreateMultiplePostDTO(PostDTO):
    config = DTOConfig(
        include=['file', 'title', 'caption']
    )



