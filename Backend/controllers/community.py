# Import necessary modules and libraries
from typing import Optional, Any

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put
from litestar import Controller

from schemas.community import *
from crud.community import * 
from litestar.dto import DTOData
import datetime
import pytz
from uuid_extensions import uuid7
from uuid import UUID
from crud.postday import *

class CommunityController(Controller):
    path = '/community'
    return_dto = CommunityOutDTO

    @get('/', exclude_from_auth=True)
    async def get_communities(self, request: Request, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        return await get_community_list(session, limit, offset)

    @post('/', dto=CreateCommunityDTO, exclude_from_auth=True)
    async def create_community(self, session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        current_time = datetime.datetime.now(pytz.utc)
        commiunity_data = data.create_instance(id=uuid7(), users=[], created_at=current_time, updated_at=current_time)
        validated_community_data = CommunitySchema.model_validate(commiunity_data)
        try:
            session.add(Community(**validated_community_data.__dict__))
            return validated_community_data
        except Exception as e:
            raise HTTPException(status_code=409, detail=f"Error creating community: {e}")
        

    @get('/{id:str}', exclude_from_auth=True)
    async def get_community(self, session: AsyncSession, id: str) -> CommunitySchema:
        ans = await get_community_by_id(session, id)
        print(ans.postdays)
        return await get_community_by_id(session, id)
    

    # @get('/{community_id:str}/addPostday/{day:str}', exclude_from_auth=True)
    # async def add_postday(self, session: AsyncSession, community_id: str, day: str) -> str:
    #     day = await get_postday_by_name(session, day)
    #     community = await get_community_by_id(session, community_id)
    #     try:
    #         community.postdays.append(day)
    #         session.commit()
    #         return community
    #     except Exception as e:
    #         raise HTTPException(status_code=409, detail=f"Error adding postday: {e}")
    

    # @put('/{}', dto=CommunityOutDTO, exclude_from_auth=True)
    # async def add_member(self, request: Request, session: AsyncSession, id: UUID, data: DTOData[CommunitySchema]) -> CommunitySchema:
    #     community = await get_community_by_id(session, id)
    #     user = await get_user(session, request.user.username)
    #     community.users.append(user)
    #     try:
    #         session.add(community)
    #         return community
    #     except Exception as e:
    #         raise HTTPException(status_code=409, detail=f"Error adding member: {e}")

