from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, UUID4, constr
from datetime import datetime
from pydantic import BaseModel as _BaseModel

class UserBase(BaseModel):
    id: UUID


class CommunityBase(BaseModel):
    name: str
    description: str
    post_days: str  # or List[str] if you want to store as a list

class CommunityCreate(CommunityBase):
    pass

class Community(CommunityBase):
    id: UUID
    owner: UserBase
    members: List[UserBase] = []
    # posts: List[PostBase] = []  # Assuming you have a PostBase schema
    # tags: List[TagBase] = []  # Assuming you have a TagBase schema


class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}


# Community creation DTO
class CreateCommunityDTO(BaseModel):
    name: constr(min_length=3, max_length=100)
    description: Optional[str] = None

