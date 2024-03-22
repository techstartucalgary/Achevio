from litestar import patch, post,get, delete, Controller
from litestar.exceptions import HTTPException
import pytz
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.dto import DTOData
from datetime import datetime
from uuid_extensions import uuid7

from crud.tag import get_tag_by_name
from crud.users import user_join_community

from models.post import Post
from schemas.post import PostSchema, PostDTO, CreateMultiplePostDTO
from schemas.community import CommunitySchema, CreateCommunityDTO
from models.community import Community
from crud.post import get_posts_list, get_posts_by_user_id, get_posts_by_community_id, delete_post_by_id, get_post_by_id

class AdminController(Controller):
    path = '/admin'

    @patch('/post/{post_id:str}', dto=PostDTO)
    async def update_post(self, session: AsyncSession, post_id: str, data: DTOData[PostSchema]) -> PostSchema:
        post = await get_post_by_id(session, post_id)
        data.update_instance(post)
        return post
    

    @patch('/post/{post_id:str}', dto=PostDTO)
    async def update_post(self, session: AsyncSession, post_id: str, data: DTOData[PostSchema]) -> PostSchema:
        post = await get_post_by_id(session, post_id)
        data.update_instance(post)
        return post
    

    @post('/', dto=CreateCommunityDTO, exclude_from_auth=True)
    async def create_community(self, session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        current_time = datetime.now(pytz.utc)
        commiunity_data = data.create_instance(id=uuid7(), users=[], created_at=current_time, updated_at=current_time, public=True, tags=[])
        validated_community_data = CommunitySchema.model_validate(commiunity_data)
        try:
            community = Community(**validated_community_data.__dict__)
            session.add(community)
            tags = data.as_builtins()['tags']
            print(tags)
            for i in range(len(tags)):
                tag = await get_tag_by_name(session, tags[i].__dict__['name'])
                community.tags.append(tag)
            validated_community_data = CommunitySchema.model_validate(commiunity_data)            
            return validated_community_data
        except Exception as e:
            raise HTTPException(status_code=409, detail=f'Error creating community: {e}')


    


    # @get('/featured')
    # async def get_featured_posts(self, session: AsyncSession) -> list[PostSchema:]