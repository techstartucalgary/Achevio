# Import necessary modules and libraries
from typing import Optional, Any

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put, delete
from litestar import Controller
from schemas.community import CommunityOutDTO, CommunitySchema
from crud.community import get_community_list, get_community_by_id, delete_community_by_id 
from litestar.dto import DTOData
import datetime
import pytz
from uuid_extensions import uuid7
from uuid import UUID


from litestar.contrib.jwt import OAuth2Login, Token
from models.user import User


class CommunityController(Controller):
    path = '/community'
    return_dto = CommunityOutDTO
    
    @get('/', exclude_from_auth=True)
    async def get_communities(self, request: Request, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        return await get_community_list(session, limit, offset)

    @get('/{id:str}', exclude_from_auth=True)
    async def get_community(self, session: AsyncSession, id: str) -> CommunitySchema:
        return await get_community_by_id(session, id)
    
    @delete('/{id:str}')
    async def delete_community(self, request: Request['User','Token',Any], session: AsyncSession, id: str, ) -> None:
        
        await delete_community_by_id(session, id, request.user)
        print(f"Community {id} deleted")
        return  None
   
    

    


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