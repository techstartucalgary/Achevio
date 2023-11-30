from typing import Any
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Controller, Request, get, post, put, delete
from litestar.dto import DTOData
from litestar.exceptions import HTTPException
from crud.community import *
from models.users import Community
from uuid_extensions import uuid7, uuid7str
from uuid import UUID

from schemas.users import CommunitySchema, CreateCommunityDTO

# Assuming the community models and schemas are defined in these modules
# from models.communities import Community
# from schemas.communities import CommunitySchema, CreateCommunityDTO
# from crud.communities import get_community_list, get_community, create_community, update_community, delete_community

class CommunityController(Controller):
    path = '/community'
    return_dto = CommunitySchema  # Assuming CommunitySchema is your output DTO

    @get('/')
    async def get_communities(self, request: "Request[Any, Any, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        return await get_community_list(session, limit, offset)

    @get('/{community_id:str}')
    async def get_single_community(self, request: "Request[Any, Any, Any]", session: AsyncSession, community_id: UUID) -> CommunitySchema:
        community = await get_community(session, community_id)
        if not community:
            raise HTTPException(status_code=404, detail="Community not found")
        return CommunitySchema.model_validate(community)

    @post('/', dto=CreateCommunityDTO)
    async def create_new_community(self, session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        community_data = data.create_instance(id=uuid7())
        validated_community_data = CommunitySchema.model_validate(community_data)
        try:
            session.add(Community(**validated_community_data.__dict__))
            return CommunitySchema.model_validate(validated_community_data)
        except IntegrityError:
            raise HTTPException(status_code=409, detail="Community with that name already exists")

    @put('/{community_id:str}')
    async def update_existing_community(self, session: AsyncSession, community_id: UUID, data: DTOData[CommunitySchema]) -> CommunitySchema:
        community = await update_community(session, community_id, data)
        if not community:
            raise HTTPException(status_code=404, detail="Community not found")
        return CommunitySchema.model_validate(community)

    @delete('/{community_id:str}')
    async def delete_community(self, request: "Request[Any, Any, Any]", session: AsyncSession, community_id: UUID) -> dict:
        success = await delete_community(session, community_id)
        if not success:
            raise HTTPException(status_code=404, detail="Community not found")
        return {"detail": "Community deleted successfully"}

# CRUD operations in crud.communities module
