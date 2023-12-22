from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

# from models.users import Community, User
# from models.users import *
from models.community import *

# from schemas.users import CreateUserDTO, UserSchema, UserOut, CommunitySchema, CommunityOut, UserOutDTO, UserIn
# from schemas.users import UserSchema



from schemas.community import CommunitySchema


# Function to get a list of todo items, possibly filtered by their done status
async def get_community_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[CommunitySchema]:
    query = select(Community).limit(limit).offset(offset)
    print(query)

    result = await session.execute(query)
    # return "woah"
    print(result)

    return [CommunitySchema.model_validate(community) for community in result.scalars().all()]



# async def get_community(session: AsyncSession, name: str) -> UserSchema:
#     query = select(User).options(orm.selectinload(Community.users)).where(Community.name == name)
#     result = await session.execute(query)
#     try:
#         return CommunitySchema.model_validate(result.scalar_one())
#     except:
#         raise HTTPException(status_code=401, detail="Error retrieving user")
#     # return result.scalar_one()