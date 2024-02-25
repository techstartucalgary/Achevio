from litestar import post,get, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from models.post import Post
from schemas.post import PostSchema, PostDTO
from crud.post import get_posts_list, get_posts_by_user_id, get_posts_by_community_id

class PostController(Controller):
    path = '/posts'
    return_dto = PostDTO

    @post('/', exclude_from_auth=True)
    async def get_all_posts(self, session: AsyncSession, limit: int=100, offset: int=0) -> PostSchema:
        return await get_posts_list(session, limit, offset)


    # @post('/{user_id:str}', exclude_from_auth=True)
    # async def get_user_posts(self, session: AsyncSession, limit: int=100, offset: int=0) -> PostSchema:
    #     return await get_posts_list(session, limit, offset)
    

    
    @get('/user/{user_id:str}', exclude_from_auth=True)
    async def get_user_posts(self, session: AsyncSession, user_id: str) -> list[PostSchema]:
        return await get_posts_by_user_id(session, user_id)
   
    
    @get('/community/{community_id:str}', exclude_from_auth=True)
    async def get_community_posts(self, session: AsyncSession, community_id: str, limit: int=100, offset: int=0) -> list[PostSchema]:
        result = await get_posts_by_community_id(session,community_id, limit, offset )
        return result
    