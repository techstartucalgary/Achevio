from typing import Annotated, Any
from litestar.contrib.jwt import Token
from models.user import User
from litestar import MediaType, patch, post,get, delete, Controller, Request
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.dto import DTOData
from litestar.params import Body
from litestar.enums import RequestEncodingType
from uuid import UUID
from uuid_extensions import uuid7
import os
import aiofiles

from models.post import Post
from schemas.post import CreateMultiplePostSchema, PostSchema, PostDTO, CreateMultiplePostDTO, CollageDTO
from crud.post import get_posts_list, get_posts_by_user_id, get_posts_by_community_id, delete_post_by_id, get_post_by_id, get_posts_from_id_list, get_posts_by_multiple_user_id
from crud.users import get_friends_by_id, get_user_by_id
from crud.community import get_user_community_association

class PostController(Controller):
    path = '/posts'
    dto = PostDTO

    @get('/')
    async def get_all_posts(self, session: AsyncSession, limit: int=100, offset: int=0) -> list[PostSchema]:
        return await get_posts_list(session, limit, offset)

    
    @get('/user/{user_id:str}')
    async def get_user_posts(self, session: AsyncSession, user_id: str) -> list[PostSchema]:
        return await get_posts_by_user_id(session, user_id)

    @get('/myPosts', return_dto=CollageDTO)
    async def get_my_posts(self, session: AsyncSession, request: 'Request[User, Token, Any]') -> list[PostSchema]:
        return await get_posts_by_user_id(session, request.user)
   
    
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



    @post('/', media_type=MediaType.TEXT, dto=None)
    async def create_post(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: Annotated[CreateMultiplePostSchema, Body(media_type=RequestEncodingType.MULTI_PART)]) -> str:
        '''
        Creates one or multiple posts with images associated with communities.

        Args:
            request (Request): The request object containing user and token information.
            session (AsyncSession): The database session for performing database transactions.
            data (CreateMultiplePostSchema): The data received in the request payload, expected to be in multipart form-data format.

        Returns:
            str: A message indicating the path where the image file associated with the posts has been saved.


        '''
        user = await get_user_by_id(session, request.user)
        image = await data.file.read()

        extension = data.file.filename.split('.')[-1]
        communities = data.communities_id.split(',')

        user.xp += 10

        # user_community = await get_user_community_association(session, user.id, UUID(communities[0]))




        for community_id in communities:
            post = Post(id=uuid7(), title=data.title, caption=data.caption, user_id=user.id, community_id=UUID(community_id))
            session.add(post)
            image_dir = "static/images/posts"
            os.makedirs(image_dir, exist_ok=True)
            if extension:
                filename = f'{post.id}.{extension}'
            else:
                filename = f'{post.id}.jpg'

            file_path = os.path.join(image_dir, filename)
            async with aiofiles.open(file_path, 'wb') as outfile:
                await outfile.write(image)

            user_community = await get_user_community_association(session, user.id, UUID(community_id))
            user_community.streak += 1
            user_community.current_days += 1
            user_community.season_xp += 10
        return f"File created"