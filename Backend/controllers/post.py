from litestar import post, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from models.post import Post
from schemas.post import PostSchema, PostDTO
from crud.post import get_posts_list, get_posts_by_user_id

class PostController(Controller):
    path = '/posts'
    return_dto = PostDTO

    @post('/', exclude_from_auth=True)
    async def get_all_posts(self, session: AsyncSession, limit: int=100, offset: int=0) -> PostSchema:
        return await get_posts_list(session, limit, offset)


    @post('/{user_id:str}', exclude_from_auth=True)
    async def get_user_posts(self, session: AsyncSession, limit: int=100, offset: int=0) -> PostSchema:
        return await get_posts_list(session, limit, offset)