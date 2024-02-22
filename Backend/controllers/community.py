# Import necessary modules and libraries
from typing import Optional, Any, Annotated

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put, patch, MediaType
from litestar import Controller
from crud.users import get_user_by_id
from litestar.datastructures import UploadFile
from litestar.params import Body
from schemas.community import *
from crud.community import * 
from litestar.dto import DTOData
from litestar.enums import RequestEncodingType
import datetime
import pytz
from uuid_extensions import uuid7
from uuid import UUID
from crud.postday import *

from litestar.contrib.jwt import OAuth2Login, Token
from models.user import User
import aiofiles

import os

class CommunityController(Controller):
    path = '/community'
    return_dto = CommunityOutDTO

    @get('/', exclude_from_auth=True)
    async def get_communities(self, request: Request, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        return await get_community_list(session, limit, offset)
    


    @get('/search', return_dto=SearchCommunityDTO, exclude_from_auth=True)
    async def get_communities_basic(self, request: Request, session: AsyncSession, sort: bool = 1, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        return await search_communities(session, limit, offset)
    


    @get('/{id:str}', exclude_from_auth=True)
    async def get_community(self, session: AsyncSession, id: str) -> CommunitySchema:
        return await get_community_by_id(session, id)
    


    # @post('/')
    # async def search_community(self, request: Request, session: AsyncSession, session: AsyncSession, data: CommunitySearchSchema) -> CommunitySchema:

    @patch('/{community_id:str}/image', media_type=MediaType.TEXT)
    async def update_profile_picture(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: Annotated[UploadFile, Body(media_type=RequestEncodingType.MULTI_PART)], community_id: str) -> str:
        user = await get_user_by_id(session, request.user)
        # community = await get_community_by_id(session, community_id)

        content = await data.read()
        filename = f'{community_id}.jpg'

        image_dir = "static/images/communities"
        os.makedirs(image_dir, exist_ok=True)

        file_path = os.path.join(image_dir, filename)
        async with aiofiles.open(file_path, 'wb') as outfile:
            await outfile.write(content)

        return f"Community image updated at: {file_path}"
    




    ''' This endpoint has been deprecated, please use the user_create_community endpoint instead
    @post('/', dto=CreateCommunityDTO, exclude_from_auth=True)
    async def create_community(self, session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        current_time = datetime.datetime.now(pytz.utc)
        commiunity_data = data.create_instance(id=uuid7(), users=[], created_at=current_time, updated_at=current_time)
        validated_community_data = CommunitySchema.model_validate(commiunity_data)
        try:
            session.add(Community(**validated_community_data.__dict__))
            return validated_community_data
        except Exception as e:
            raise HTTPException(status_code=409, detail=f'Error creating community: {e}')
    '''