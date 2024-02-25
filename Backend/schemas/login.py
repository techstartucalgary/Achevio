from __future__ import annotations
from dataclasses import dataclass

from datetime import datetime
from uuid import UUID
from litestar import Response

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
from litestar.datastructures import UploadFile

from .schema import Schema

from pydantic import ConfigDict
from litestar.contrib.jwt import OAuth2Login, Token


# Define the CommunitySchema class for community data
# class CustomLoginSchema(Schema):
    
#     login: Token

#     test: str

@dataclass
class CustomLoginSchema(OAuth2Login):
    test: str = "WNI"
    



class CustomLoginDTO(PydanticDTO[CustomLoginSchema]):
    config = DTOConfig(
        rename_strategy='camel'
    )


