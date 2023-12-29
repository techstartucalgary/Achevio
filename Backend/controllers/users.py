# Import necessary modules and libraries
from typing import Any
import datetime
import pytz
from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put
from litestar import Controller
from uuid_extensions import uuid7
from Backend.crud.postday import get_postday_by_name
from models.user import User
from litestar.dto import DTOData
from litestar.exceptions import HTTPException
from litestar.contrib.jwt import OAuth2Login, Token
from .auth import oauth2_auth
from lib.redis import redis
from schemas.community import CommunitySchema, CreateCommunityDTO

from schemas.users import CreateUserDTO, UserSchema, UserOutDTO
from models.user import User
from models.community import Community
from crud.users import get_user, get_user_list, user_join_community, user_leave_community


# Define a UserController class that inherits from Controller
class UserController(Controller):
    # Define the base path for this controller
    path = '/user'
    # Specify the return DTO (Data Transfer Object) for the controller
    return_dto = UserOutDTO

    @put('/join/{communityID:str}')
    async def join_community(self, request: "Request[User, Token, Any]", session: AsyncSession, communityID: str) -> UserSchema:
        """
        Join a community.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            communityID (str): The ID of the community to join.

        Returns:
            str: A message indicating success.
        """

        user = UserSchema.model_validate(await user_join_community(session, communityID, request.user))
        await session.commit()
        return user
        

    # Define a GET route for retrieving a list of users
    @get('/', exclude_from_auth=True)
    async def get_users(self, request: "Request[User, Token, Any]", session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
        """
        Get a list of users.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            limit (int): The maximum number of users to retrieve.
            offset (int): The offset for paginating through users.

        Returns:
            list[UserSchema]: A list of user objects in UserSchema format.
        """
        user = await get_user_list(session, limit, offset)
        return user


    # Define a GET route for retrieving the current user's information
    @get('/me')
    async def get_me(self, request: "Request[User, Token, Any]", session: AsyncSession) -> UserSchema:
        """
        Get the user's own information.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.

        Returns:
            UserSchema: The user's information in UserSchema format.
        """
        return UserSchema.model_validate(await get_user(session, request.user))

    # Define a POST route for creating a new user
    @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
        """
        Create a new user.

        Args:
            session (AsyncSession): The database session.
            data (DTOData[UserSchema]): Data for creating the new user.

        Returns:
            UserSchema: The created user's information in UserSchema format.
        
        Raises:
            HTTPException: If a user with the same username already exists.
        """
        current_time = datetime.datetime.now(pytz.utc)
        user_data = data.create_instance(id=uuid7(), communities=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)
        validated_user_data = UserSchema.model_validate(user_data)
        validated_user_data.set_password(validated_user_data.password)
        try:
            session.add(User(**validated_user_data.__dict__))
            return validated_user_data
        except Exception as e:
            raise HTTPException(status_code=409, detail=f"User with that username exists")


    @post('/create_user_and_login', dto=CreateUserDTO, exclude_from_auth=True)
    async def create_user_and_login(self, session: AsyncSession, data: DTOData[UserSchema]) -> Response[OAuth2Login]:
        """
        Create a new user and logs in. This might become the new default way of creating users.

        Args:
            session (AsyncSession): The database session.
            data (DTOData[UserSchema]): Data for creating the new user.

        Returns:
            UserSchema: The created user's information in UserSchema format.
        
        Raises:
            HTTPException: If a user with the same username already exists.
        """
        current_time = datetime.datetime.now(pytz.utc)
        user_data = data.create_instance(id=uuid7(), communities=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)
        validated_user_data = UserSchema.model_validate(user_data)
        validated_user_data.set_password(validated_user_data.password)
        try:
            session.add(User(**validated_user_data.__dict__))
            token = oauth2_auth.login(identifier=str(validated_user_data.username))
            session_key = f"session:{validated_user_data.username}"
            await redis.hmset(session_key, {"userId": str(validated_user_data.id), "username": validated_user_data.username, "token": str(token.cookies)})
            
            return token
        except Exception as e:
            raise HTTPException(status_code=409, detail=f"User with that username exists")



    @post('/community', dto=CreateCommunityDTO)
    async def create_community(self, request: "Request[User, Token, Any]", session: AsyncSession, data: DTOData[CommunitySchema]) -> CommunitySchema:
        """
        Create a new community with the current user as the owner.

        Args:
            request (Request): The HTTP request object containing user and token information.
            session (AsyncSession): The database session for committing the new community.
            data (DTOData[CommunitySchema]): The data for creating the new community.

        Returns:
            CommunitySchema: The newly created community's information.

        Raises:
            HTTPException: If there's an error in creating the community.
        """
        user = await get_user(session, request.user)
        current_time = datetime.datetime.now(pytz.utc)
        commiunity_data = data.create_instance(id=uuid7(), users=[], created_at=current_time, updated_at=current_time, owner_id=user.id, postdays=[])
        validated_community_data = CommunitySchema.model_validate(commiunity_data)
        try:
            community = Community(**validated_community_data.__dict__)
            session.add(community)
            postdays = data.as_builtins()['postdays']
            for i in range(len(postdays)):
                print(i)
                postday = await get_postday_by_name(session, postdays[i].__dict__['day'])
                community.postdays.append(postday)
            validated_community_data = CommunitySchema.model_validate(commiunity_data)
            await user_join_community(session, validated_community_data.id, request.user, "owner")
            await session.commit()
            return validated_community_data
        except Exception as e:
            raise HTTPException(status_code=409, detail=f"Error creating community: {e}") 


    @post('/{communityID:str}/leave')
    async def leave_community(self, request: "Request[User, Token, Any]", session: AsyncSession, communityID: str) -> str:
        """
        Leave a community.

        Args:
            request (Request): The HTTP request object.
            session (AsyncSession): The database session.
            communityID (str): The ID of the community to leave.

        Returns:
            str: A message indicating success.
        """
        return await user_leave_community(session, communityID, request.user)

    # Define a GET route for testing, excluding it from authentication Delete later on!
    @get('/test', exclude_from_auth=True)
    async def test(self) -> str:
        """
        Test route for Redis functionality.

        Returns:
            str: A test message from Redis.
        """
        await redis.set("foo", "bar")
        return await redis.get("foo")


