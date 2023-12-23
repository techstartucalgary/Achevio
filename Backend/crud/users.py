from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid import UUID
# from models.users import Community, User
from models.user import *
from crud.community import get_community_by_id
from models.user_community_association import UserCommunityAssociation
# from schemas.users import CreateUserDTO, UserSchema, UserOut, CommunitySchema, CommunityOut, UserOutDTO, UserIn
from schemas.users import UserSchema




async def user_join_community(session: AsyncSession, communityID: UUID, username: User, role: str = "member") -> UserSchema:
    community = await get_community_by_id(session, communityID)
    user = await get_user(session, username)
    user_community_join = UserCommunityAssociation(user_id=user.id, community_id=community.id, role=role, community_name=community.name)
    user.communities.append(user_community_join)
    return user


# Function to get a list of todo items, possibly filtered by their done status
async def get_user_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[User]:
    query = select(User).options(orm.selectinload(User.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    # for i in result.scalars().all():
    #     print(UserSchema.model_validate(i))
    return result.scalars().all()



async def get_user(session: AsyncSession, username: str) -> UserSchema:
    query = select(User).options(orm.selectinload(User.communities)).where(User.username == username)
    result = await session.execute(query)
    try:
        return result.scalar_one()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user")
