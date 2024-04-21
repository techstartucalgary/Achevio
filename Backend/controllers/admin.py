from litestar import patch, post,get, delete, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.dto import DTOData

from models.post import Post
from schemas.post import PostSchema, PostDTO, CreateMultiplePostDTO
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
    


    # @get('/featured')
    # async def get_featured_posts(self, session: AsyncSession) -> list[PostSchema:]