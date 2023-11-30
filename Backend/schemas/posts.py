from __future__ import annotations

from typing import Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from litestar import Litestar, get, post, put
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException, NotFoundException
from litestar.status_codes import HTTP_409_CONFLICT

from datetime import datetime
from uuid import UUID
from uuid_extensions import uuid7, uuid7str


from litestar.dto import DataclassDTO, DTOConfig

from litestar.contrib.pydantic import PydanticDTO
from pydantic import BaseModel as _BaseModel



class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}


# Required fields for posts
#
# Contains info about user, post, and community
# UUID needed for post,user,and community posted to

class postSchema(Schema):
    userId: UUID
    first_name: str
    last_name: str
    userEmail: str
    postId: UUID
    communityId: UUID
    datePosted: datetime
    imageURL: str
    caption: str

    
class postDTO(PydanticDTO[postSchema]):
    pass


class createPostDTO(PydanticDTO[postSchema]):
    config = DTOConfig(exclude={'postId'})


class PostOutDTO(PydanticDTO[postSchema]):
    config = DTOConfig()
    pass

# FOR DB

# user id
# user email
# user firstname lastname
# post id
# date/time posted
# community id - what community did user post to
# image url
# caption



## possible
# status - deleted, active
# visibility - private, public
# list of users tagged?