from litestar import post, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from models.post import Post
from schemas.post import PostSchema, PostDTO

class PostController(Controller):
    path = '/posts'
    return_dto = PostDTO

    @post('/', exclude_from_auth=True)
    async def get_posts(self, session: AsyncSession, day: str) -> PostSchema:
        return await

        
