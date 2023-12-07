from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

# from models.users import Community, User
from models.users import *

# from schemas.users import CreateUserDTO, UserSchema, UserOut, CommunitySchema, CommunityOut, UserOutDTO, UserIn
from schemas.users import UserSchema






# Function to get a list of todo items, possibly filtered by their done status
async def get_user_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[UserSchema]:
    query = select(User).options(orm.selectinload(User.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return [UserSchema.model_validate(user) for user in result.scalars().all()]



async def get_user(session: AsyncSession, username: str) -> UserSchema:
    query = select(User).options(orm.selectinload(User.communities)).where(User.username == username)
    result = await session.execute(query)
    try:
        return UserSchema.model_validate(result.scalar_one())
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user")
    # return result.scalar_one()