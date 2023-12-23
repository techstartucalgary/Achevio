from sqlalchemy import select, delete, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid import UUID
from models.user import *
from crud.community import get_community_by_id
from models.user_community_association import UserCommunityAssociation
from schemas.users import UserSchema




async def user_join_community(session: AsyncSession, communityID: UUID, username: User, role: str = "member") -> UserSchema:
    community = await get_community_by_id(session, communityID)
    user = await get_user(session, username)
    user_community_join = UserCommunityAssociation(user_id=user.id, community_id=community.id, role=role, community_name=community.name)
    user.communities.append(user_community_join)
    return user


async def user_leave_community(session: AsyncSession, communityID: UUID, username: User) -> str:
    user = await get_user(session, username)
    query = delete(UserCommunityAssociation).where(UserCommunityAssociation.community_id == communityID).where(UserCommunityAssociation.user_id == user.id)
    await session.execute(query)
    return f"{username} has left the community with ID {communityID}"


async def get_user_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[User]:
    query = select(User).options(orm.selectinload(User.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return result.scalars().all()


async def get_user(session: AsyncSession, username: str) -> UserSchema:
    query = select(User).options(orm.selectinload(User.communities)).where(User.username == username)
    result = await session.execute(query)
    try:
        return result.scalar_one()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user")
