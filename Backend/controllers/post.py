from typing import Any
from litestar.contrib.jwt import Token
from models.user import User
from litestar import patch, post,get, delete, Controller, Request
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.dto import DTOData

from models.post import Post
from schemas.post import PostSchema, PostDTO, CreateMultiplePostDTO
from crud.post import get_posts_list, get_posts_by_user_id, get_posts_by_community_id, delete_post_by_id, get_post_by_id, get_posts_from_id_list, get_posts_by_multiple_user_id
from crud.users import get_friends_by_id, get_user_by_id
class PostController(Controller):
    path = '/posts'
    dto = PostDTO

    @get('/')
    async def get_all_posts(self, session: AsyncSession, limit: int=100, offset: int=0) -> list[PostSchema]:
        return await get_posts_list(session, limit, offset)

    
    @get('/user/{user_id:str}')
    async def get_user_posts(self, session: AsyncSession, user_id: str) -> list[PostSchema]:
        return await get_posts_by_user_id(session, user_id)
   
    
    @get('/community/{community_id:str}')
    async def get_community_posts(self, session: AsyncSession, community_id: str, limit: int=100, offset: int=0) -> list[PostSchema]:
        result = await get_posts_by_community_id(session,community_id, limit, offset)
        return result
    
    
    @delete('/{post_id:str}')
    async def delete_post(self, session: AsyncSession, post_id: str) -> None:
        result = await delete_post_by_id(session, post_id)


    @patch('/{post_id:str}', dto=CreateMultiplePostDTO)
    async def update_post(self, session: AsyncSession, post_id: str, data: DTOData[PostSchema]) -> PostSchema:
        post = await get_post_by_id(session, post_id)
        data.update_instance(post)
        return post
    

    @get('/friends')
    async def get_friends_post(self, request: 'Request[User, Token, Any]', session: AsyncSession, limit: int=10, offset: int=0) -> list[PostSchema]:
        user = await get_user_by_id(session, request.user)
        friend_ids = [friend.id for friend in user.friends] 
        posts = await get_posts_by_multiple_user_id(session, friend_ids, limit, offset)
        return posts

    

        # return user.friends
    # @get('/featured')
    # async def get_featured_posts(self, session: AsyncSession) -> list[PostSchema:]