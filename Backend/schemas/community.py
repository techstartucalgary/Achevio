from __future__ import annotations
from typing import Optional

from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from .schema import Schema
from datetime import datetime


class CommunityBaseSchema(Schema):
    id: UUID    
    name: str
    tags: list[TagSchema] = []
    public: str
    


class CommunitySchema(CommunityBaseSchema):
    description: str
    image: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    users: list[UserCommunityAssociationSchema] = None

    requests: list['UserSchema'] = []



class CommunitySearchResultSchema(Schema):
    popular: list[CommunityBaseSchema] = []
    trending: list[CommunityBaseSchema] = []
    for_you: list[CommunityBaseSchema] = []


class CommunitySearchResultDTO(PydanticDTO[CommunitySearchResultSchema]):
    config = DTOConfig(
        rename_strategy='camel',
        max_nested_depth=2,
    )


class CommunitySearchSchema(Schema):
    name: str

    tags: list[TagSchema] = []


# class BaseCommunitySchema(Schema):
#     id: UUID    
#     owner_id: UUID
#     name: str
#     description: str
#     users: list[UserCommunityAssociationSchema] = None


class CommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )


class CreateCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        include={'name', 'description', 'tags'},
        max_nested_depth=2,
    )

class SearchCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        include={'id', 'name', 'tags', 'public'},
        max_nested_depth=1,
    )


class CommunityOutDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        max_nested_depth=2,
        exclude={'requests'},
    )


class ViewCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(
        include={'id', 'name', 'description', 'tags'},
        max_nested_depth=2,
    )


from .tag import TagSchema
from .user_community_association import UserCommunityAssociationSchema
from .users import UserSchema
CommunitySchema.model_rebuild()




