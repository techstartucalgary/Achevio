# Import necessary modules and libraries
from typing import Any, Annotated
import os
import datetime
import pytz
from uuid import UUID
from litestar import Response, Request, get, post, put, patch, MediaType
from litestar import Controller
from litestar.dto import DTOData
from litestar.exceptions import HTTPException
from litestar.contrib.jwt import OAuth2Login, Token
from litestar.datastructures import UploadFile
from litestar.enums import RequestEncodingType
from litestar.params import Body
from lib.redis import redis
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7
import aiofiles

from schemas.users import CreateUserDTO, UserSchema, UserOutDTO, UpdateUserDTO, BasicUserOutDTO
from schemas.community import CommunitySchema, CreateCommunityDTO, ViewCommunityDTO
from schemas.post import PostSchema, CreatePostSchema, PostDTO, CreatePostDTO, CreateMultiplePostDTO, CreateMultiplePostSchema
from models.user import User
from models.community import Community
from models.post import Post
from crud.users import get_user_by_username, get_user_by_id,get_user_list, user_join_community, user_leave_community, transfer_community_ownership, get_user_communities, get_friends_by_id
from crud.tag import get_tag_by_name
from .auth import oauth2_auth


from schemas.login import CustomLoginSchema, CustomLoginDTO

from crud.community import get_community_list



class UserController(Controller):
    path = '/user'
    return_dto = UserOutDTO

    @patch('/', dto=UpdateUserDTO)
    async def update_user(self, session: AsyncSession, request: 'Request[User, Token, Any]', data: DTOData[UserSchema]) -> str:
        user = await get_user_by_id(session, request.user)
        data.update_instance(user)
        return "User Updated"



    @get('/', exclude_from_auth=True)
    async def get_users(self, request: 'Request[User, Token, Any]', session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        '''
        Get a list of users.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            limit (int): The maximum number of users to retrieve.
            offset (int): The offset for paginating through users.

        Returns:
            list[UserSchema]: A list of user objects in UserSchema format.
        '''
        user = await get_user_list(session, limit, offset)
        return user

    @get('/me')
    async def get_me(self, request: 'Request[User, Token, Any]', session: AsyncSession) -> UserSchema:
        '''
        Get the user's own information.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.

        Returns:
            UserSchema: The user's information in UserSchema format.
        '''
        return UserSchema.model_validate(await get_user_by_id(session, request.user))


    @get('/myCommunities')
    async def get_my_communities(self, request: 'Request[User, Token, Any]', session: AsyncSession) -> list[CommunitySchema]:
        '''
        Retrieves the communities associated with the current user. 

        Args:
            request (Request[User, Token, Any]): The request object containing user and token information.
            session (AsyncSession): The database session for asynchronous operations.

        Returns:
            list[CommunitySchema]: A list of communities in Schema format that the user belongs to.
        '''
        return [CommunitySchema.model_validate(community) for community in await get_user_communities(session, request.user)]


    # DEPRECATED
    # @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    # async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
    #     '''
    #     Create a new user.

    #     Args:
    #         session (AsyncSession): The database session.
    #         data (DTOData[UserSchema]): Data for creating the new user.

    #     Returns:
    #         UserSchema: The created user's information in UserSchema format.
        
    #     Raises:
    #         HTTPException: If a user with the same username already exists.
    #     '''
    #     current_time = datetime.datetime.now(pytz.utc)
    #     user_data = data.create_instance(id=uuid7(), communities=[], posts=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)
    #     validated_user_data = UserSchema.model_validate(user_data)
    #     validated_user_data.set_password(validated_user_data.password)
    #     try:
    #         session.add(User(**validated_user_data.__dict__))
    #         return validated_user_data
    #     except Exception as e:
    #         raise HTTPException(status_code=409, detail=f'Error {e}')



    @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    async def create_user_login(self, session: AsyncSession, data: DTOData[UserSchema]) -> Response[OAuth2Login]:

        '''
        Create a new user and logs in. This might become the new default way of creating users.

        Args:
            session (AsyncSession): The database session.
            data (DTOData[UserSchema]): Data for creating the new user.

        Returns:
            UserSchema: The created user's information in UserSchema format.

        Raises:
            HTTPException: If a user with the same username already exists.
        '''
        current_time = datetime.datetime.now(pytz.utc)

        user_data = data.create_instance(id=uuid7(),communities=[], posts=[], friends=[],created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)

        validated_user_data = UserSchema.model_validate(user_data)
        validated_user_data.set_password(validated_user_data.password)
        try:
            session.add(User(**validated_user_data.__dict__))

            token = oauth2_auth.login(identifier=str(validated_user_data.id))
            session_key = f'session:{validated_user_data.id}'
            await redis.hmset(session_key, {'user_id': str(validated_user_data.id), 'username': validated_user_data.username, 'token': str(token.cookies)})
            

            return token
        except Exception as e:
            raise HTTPException(
                status_code=409, detail=f'Error: {e}')


    @patch('/profile_image', media_type=MediaType.TEXT)
    async def update_profile_picture(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: Annotated[UploadFile, Body(media_type=RequestEncodingType.MULTI_PART)]) -> str:
        user = await get_user_by_id(session, request.user)

        content = await data.read()
        filename = f'{user.id}.jpg'

        image_dir = "static/images/users"
        os.makedirs(image_dir, exist_ok=True)

        file_path = os.path.join(image_dir, filename)
        async with aiofiles.open(file_path, 'wb') as outfile:
            await outfile.write(content)

        return f"Profile picture updated at: {file_path}"

    


    # This endpoint is deprecated, please use the new create_post
    # @post('/post', media_type=MediaType.TEXT)
    # async def create_post(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: Annotated[CreatePostSchema, Body(media_type=RequestEncodingType.MULTI_PART)]) -> str:
    #     user = await get_user_by_id(session, request.user)
    #     image = await data.file.read()

    #     post = Post(id=uuid7(), title=data.title, caption=data.caption, user_id=user.id, community_id=data.community_id)
    #     session.add(post)

        
    #     image_dir = "static/images/posts"
    #     os.makedirs(image_dir, exist_ok=True)
    #     filename = f'{post.id}.jpg'

    #     file_path = os.path.join(image_dir, filename)
    #     async with aiofiles.open(file_path, 'wb') as outfile:
    #         await outfile.write(image)
    #     return f"File created at {file_path}"
    



    @post('/post', media_type=MediaType.TEXT)
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
        

        communities = data.communities_id.split(',')



        for community_id in communities:
            post = Post(id=uuid7(), title=data.title, caption=data.caption, user_id=user.id, community_id=UUID(community_id))
            session.add(post)

            image_dir = "static/images/posts"
            os.makedirs(image_dir, exist_ok=True)
            filename = f'{post.id}.jpg'

            file_path = os.path.join(image_dir, filename)
            async with aiofiles.open(file_path, 'wb') as outfile:
                await outfile.write(image)
        return f"File created"

    

    
    @post('/TransferOwnership/{id:str}/{newUser:str}')
    async def transfer_ownership(self, request: 'Request[User, Token, Any]', session: AsyncSession, communityID: str, newUserID: str) -> str:
        user = await get_user_by_id(session, request.user)
        await transfer_community_ownership(session, communityID, user, newUserID)
        return f"Ownership Transfered to {newUserID}"


    @get('/GetNameByID/{id:str}')
    async def get_name_by_id(self, session: AsyncSession, id: str) -> str:
        user = await get_user_by_id(session, id)
        return str(user.username)
    

    @get('/GetNames')
    async def get_names_by_id(self, session: AsyncSession, parameters: list[UUID]) -> list[str]:

        users = []
        for id in parameters:
            user = await get_user_by_id(session, id)
            users.append(str(user.username))
        return users

    # Define a GET route for testing, excluding it from authentication Delete later on!

    @get('/test', exclude_from_auth=True)
    async def test(self) -> str:
        '''
        Test route for Redis functionality.

        Returns:
            str: A test message from Redis.
        '''
        await redis.set('foo', 'bar')
        return await redis.get('foo')
    

    
    # @get('/friends')
    # async def get_friends(self) -> list[UserSchema]:
    #     user = awa



    @post('/friend/{friend_id:str}') # WIP
    async def add_friend(self, request: 'Request[User, Token, Any]', session: AsyncSession, friend_id: str) -> str:
        user = await get_user_by_id(session, request.user)
        friend = await get_user_by_id(session, friend_id)
        user.friends.append(friend)
        return "Added friend!"
    

    @post('/friends', return_dto=BasicUserOutDTO) # WIP
    async def get_friends(self, request: 'Request[User, Token, Any]', session: AsyncSession) -> list[UserSchema]:
        user = await get_user_by_id(session, request.user)
        return user.friends
        # return user.friends
    

    @post('/doneTutorial', return_dto=BasicUserOutDTO)
    async def done_tutorial(self, request: 'Request[User, Token, Any]', session: AsyncSession) -> UserSchema:
        user = await get_user_by_id(session, request.user)
        user.done_tutorial = True
        return user



    # @post('/featured-posts')


