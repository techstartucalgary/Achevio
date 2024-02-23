# Import necessary modules and libraries
from typing import Optional, Any, Annotated

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, delete, get, post, put, patch, MediaType
from litestar import Controller
from schemas.users import UserSchema
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
from crud.postday import *
import shutil
from litestar.contrib.jwt import OAuth2Login, Token
from models.user import User
from crud.tag import get_tag_by_name
from crud.users import user_join_community, user_leave_community
import aiofiles
from pathlib import Path

import os

class CommunityController(Controller):
    path = '/community'
    return_dto = CommunityOutDTO

    @get('/', exclude_from_auth=True)
    async def get_communities(self, request: Request, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        return await get_community_list(session, limit, offset)
    


    # @get('/search', return_dto=SearchCommunityDTO, exclude_from_auth=True)
    # async def get_communities_basic(self, request: Request, session: AsyncSession, sort: bool = 1, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
    #     return await search_communities(session, limit, offset)
    

    @post('/', dto=CreateCommunityDTO)
    async def create_community(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        '''
        Create a new community with the current user as the owner.

        Args:
            request (Request): The HTTP request object containing user and token information.
            session (AsyncSession): The database session for committing the new community.
            data (DTOData[CommunitySchema]): The data for creating the new community.

        Returns:
            CommunitySchema: The newly created community's information.

        Raises:
            HTTPException: If there's an error in creating the community.
        '''
        current_time = datetime.datetime.now(pytz.utc)

        commiunity_data = data.create_instance(id=uuid7(), users=[], created_at=current_time, updated_at=current_time, postdays=[], tags=[])
        validated_community_data = CommunitySchema.model_validate(commiunity_data)

        try:
            community = Community(**validated_community_data.__dict__)
            session.add(community)
            
            # Adds postdays to community
            postdays = data.as_builtins()['postdays']
            for i in range(len(postdays)):
                postday = await get_postday_by_name(session, postdays[i].__dict__['day'])
                community.postdays.append(postday)
            
            # Adds tags to community
            tags = data.as_builtins()['tags']
            for i in range(len(tags)):
                tag = await get_tag_by_name(session, tags[i].__dict__['name'])
                community.tags.append(tag)

            validated_community_data = CommunitySchema.model_validate(commiunity_data)
            await user_join_community(session, validated_community_data.id, request.user, 'owner')
            
            await session.commit()
            return validated_community_data
        except Exception as e:
            raise HTTPException(
                status_code=409, detail=f'Error creating community: {e}')


    @delete('/{communityID:str}/leave')
    async def leave_community(self, request: 'Request[User, Token, Any]', session: AsyncSession, communityID: str) -> None:
        '''
        Leave a community.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            communityID (str): The ID of the community to leave.

        Returns:
            str: A message indicating success.
        '''
        await user_leave_community(session, communityID, request.user)
      
    @get('/{id:str}', exclude_from_auth=True)
    async def get_community(self, session: AsyncSession, id: str) -> CommunitySchema:
        return await get_community_by_id(session, id)
    


    # @post('/')
    # async def search_community(self, request: Request, session: AsyncSession, session: AsyncSession, data: CommunitySearchSchema) -> CommunitySchema:
    @put('/{community_id:str}/image', media_type=MediaType.TEXT)
    async def upload_community_image(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: Annotated[UploadFile, Body(media_type=RequestEncodingType.MULTI_PART)], community_id: str) -> str:
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
    

    @get('/images')
    async def get_background_images(self) -> list[str]:
        return [f.name for f in Path('static/images/backgrounds').iterdir() if f.is_file()]


    @patch('/{community_id:str}/image/{image_id:str}')
    async def set_community_image(self, request: 'Request[User, Token, Any]', session: AsyncSession, community_id: str, image_id: str) -> str:
        community = await get_community_by_id(session, community_id)
        community.image = image_id
        source_path = f'static/images/backgrounds/{image_id}'
        destination_path = f'static/images/communities/{community.id}.jpg'
        shutil.copy(source_path, destination_path)
        return f"Community image updated at: {destination_path}"
    

    @get('/search', return_dto=CommunitySearchResultDTO)
    async def search_communites(self, request: 'Request[User, Token, Any]', session: AsyncSession) -> CommunitySearchResultSchema:
        community = await search_communities(session)
        return community
    

    @put('/join/{communityID:str}')
    async def join_community(self, request: 'Request[User, Token, Any]', session: AsyncSession, communityID: str) -> UserSchema:
        '''
        Join a community.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            communityID (str): The ID of the community to join.

        Returns:
            str: A message indicating success.
        '''

        user = UserSchema.model_validate(await user_join_community(session, communityID, request.user))
        await session.commit()
        return user

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

    