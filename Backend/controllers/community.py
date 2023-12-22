# Import necessary modules and libraries
from typing import Optional, Any

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put
from litestar import Controller


# from schemas.community import CommunitySchema
# from schemas.users import *
# from models.users import User
# from crud.users import *

from schemas.community import *
from crud.community import * 

# Define a UserController class that inherits from Controller
class CommunityController(Controller):
    # Define the base path for this controller
    path = '/community'
    # Specify the return DTO (Data Transfer Object) for the controller
    return_dto = CommunityOutDTO

    @get('/weew', exclude_from_auth=True)
    async def get_communities(self, request: Request, session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
        # return "Word"
        return await get_community_list(session, limit, offset)


    # # Define a POST route for creating a new user
    # @post('/', dto=CreateUserDTO, exclude_from_auth=True)
    # async def create_user(self, session: AsyncSession, data: DTOData[UserSchema]) -> UserSchema:
    #     """
    #     Create a new user.

    #     Args:
    #         session (AsyncSession): The database session.
    #         data (DTOData[UserSchema]): Data for creating the new user.

    #     Returns:
    #         UserSchema: The created user's information in UserSchema format.
        
    #     Raises:
    #         HTTPException: If a user with the same username already exists.
    #     """
    #     current_time = datetime.datetime.now(pytz.utc)
    #     user_data = data.create_instance(id=uuid7(), communities=[], created_at=current_time, updated_at=current_time, is_active=True, last_login=current_time)
    #     validated_user_data = UserSchema.model_validate(user_data)
    #     validated_user_data.set_password(validated_user_data.password)
    #     try:
    #         session.add(User(**validated_user_data.__dict__))
    #         return validated_user_data
    #     except Exception as e:
    #         raise HTTPException(status_code=409, detail=f"User with that username exists")

    # # Define a GET route for testing, excluding it from authentication Delete later on!
    # @get('/test', exclude_from_auth=True)
    # async def test(self) -> str:
    #     """
    #     Test route for Redis functionality.

    #     Returns:
    #         str: A test message from Redis.
    #     """
    #     await redis.set("foo", "bar")
    #     return await redis.get("foo")
