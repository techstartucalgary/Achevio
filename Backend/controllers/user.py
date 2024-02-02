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

from schemas.users import CreateUserDTO, UserSchema, UserOutDTO, UpdateUserDTO
from schemas.community import CommunitySchema, CreateCommunityDTO, ViewCommunityDTO
from schemas.post import PostSchema, CreatePostSchema, PostDTO, CreatePostDTO, CreateMultiplePostDTO, CreateMultiplePostSchema, CreateMultiplePostSchemaTest
from models.user import User
from models.community import Community
from models.post import Post
from crud.users import get_user_by_username, get_user_by_id,get_user_list, user_join_community, user_leave_community, transfer_community_ownership, get_user_communities
from crud.postday import get_postday_by_name
from crud.tag import get_tag_by_name
from .auth import oauth2_auth


from crud.community import get_community_list



class UserController(Controller):
    path = '/user'
    return_dto = UserOutDTO

    @patch('/', dto=UpdateUserDTO)
    async def update_user(self, session: AsyncSession, request: 'Request[User, Token, Any]', data: DTOData[UserSchema]) -> str:
        user = await get_user_by_id(session, request.user)
        data.update_instance(user)
        return "chill"

    @put('/join/{communityID:str}')
    async def join_community(self, request: 'Request[User, Token, Any]', session: AsyncSession, communityID: str) -> UserSchema:
        '''
        Join a community.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            communityID (str): The ID of the community to join.

        Returns:
            str: A message indicating success.
        '''

        user = UserSchema.model_validate(await user_join_community(session, communityID, request.user))
        await session.commit()
        return user

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
            list[CommunitySchema]: A list of communities in CommunitySchema format that the user belongs to.
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

        user_data = data.create_instance(id=uuid7(),communities=[], posts=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)

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
                status_code=409, detail=f'User with that username exists')

    @post('/community', dto=CreateCommunityDTO)
    async def create_community(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        '''
        Create a new community with the current user as the owner.

        Args:
            request (Request): The HTTP request object containing user and token information.
            session (AsyncSession): The database session for committing the new community.
            data (DTOData[CommunitySchema]): The data for creating the new community.

        Returns:
            CommunitySchema: The newly created community's information.

        Raises:
            HTTPException: If there's an error in creating the community.
        '''
        current_time = datetime.datetime.now(pytz.utc)

        commiunity_data = data.create_instance(id=uuid7(), users=[
        ], created_at=current_time, updated_at=current_time, postdays=[], tags=[])

        validated_community_data = CommunitySchema.model_validate(
            commiunity_data)
        try:
            community = Community(**validated_community_data.__dict__)
            session.add(community)
            
            # Adds postdays to community
            postdays = data.as_builtins()['postdays']
            for i in range(len(postdays)):
                postday = await get_postday_by_name(session, postdays[i].__dict__['day'])
                community.postdays.append(postday)
            
            # Adds tags to community
            tags = data.as_builtins()['tags']
            for i in range(len(tags)):
                tag = await get_tag_by_name(session, tags[i].__dict__['name'])
                community.tags.append(tag)

            
            validated_community_data = CommunitySchema.model_validate(commiunity_data)

            await user_join_community(session, validated_community_data.id, request.user, 'owner')
            await session.commit()

            return validated_community_data
        except Exception as e:
            raise HTTPException(
                status_code=409, detail=f'Error creating community: {e}')

    @post('/{communityID:str}/leave')
    async def leave_community(self, request: 'Request[User, Token, Any]', session: AsyncSession, communityID: str) -> str:
        '''
        Leave a community.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            communityID (str): The ID of the community to leave.

        Returns:
            str: A message indicating success.
        '''
        return await user_leave_community(session, communityID, request.user)

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
    async def create_post(self, request: 'Request[User, Token, Any]', session: AsyncSession, data: Annotated[CreateMultiplePostSchemaTest, Body(media_type=RequestEncodingType.MULTI_PART)]) -> str:
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
        return f"File(s) created"

    

    
    @post('/TransferOwnership/{id:str}/{newUser:str}')
    async def transfer_ownership(self, request: 'Request[User, Token, Any]', session: AsyncSession, communityID: str, newUserID: str) -> str:
        user = await get_user_by_id(session, request.user)
        await transfer_community_ownership(session, id, user, newUserID)
        return f"Ownership Transfered to {newUserID}"



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
