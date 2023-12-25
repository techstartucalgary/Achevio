from __future__ import annotations
from typing import Optional

from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO
from .schema import Schema
from uuid_extensions import uuid7, uuid7str

from models.community import Community

# Define the CommunitySchema class for community data
class CommunitySchema(Schema):
    id: UUID    
    owner_id: UUID
    name: str
    description: str
    users: "list[UserCommunityAssociationSchema]" = None




# Define a DTO for community data
class CommunityDTO(PydanticDTO[CommunitySchema]):
    pass

# Define a DTO for creating a new community
class CreateCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(exclude={'id', 'users', 'owner_id'})

# Define a DTO for community data output
class CommunityOutDTO(PydanticDTO[CommunitySchema]):
    pass


# class CreateCommunityDTO(SQLAlchemyDTO[Community]):
#     config = DTOConfig(exclude={'id', 'users'})

# class CommunityOutDTO(SQLAlchemyDTO[Community]):
#     pass


from .user_community_association import UserCommunityAssociationSchema
CommunitySchema.model_rebuild()




