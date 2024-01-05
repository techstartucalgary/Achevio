from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

from models.post import Post

async def get_posts_list(session: AsyncSession, limit: int, offset: int) -> list[Post]:
    query = select(Post).limit(limit).offset(offset)
    result = await session.execute(query)
    
    return result.scalars().all()


async def get_posts_by_id(session: AsyncSession, post_id: UUID) -> Post:
    query = select(Post).where(Post.id == post_id)
    result = await session.execute(query)
    try:
        return result.scalars().one_or_none()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving post")
    

async def get_posts_by_user_id(session: AsyncSession, user_id: UUID) -> list[Post]: # WIP
    query = select(Post).where(Post.user_id == user_id)
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user posts")
    

async def get_posts_by_community_id(session: AsyncSession, community_id: UUID, limit: int=100, offset: int=0) -> list[Post]: # WIP
    query = select(Post).where(Post.community_id == community_id).limit(limit).offset(offset)
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving community posts")
    

async def get_posts_by_any(session: AsyncSession, limit: int=100, offset: int=0, user_id: UUID=None, community_id: UUID=None) -> list[Post]: # WIP
    query = select(Post).limit(limit).offset(offset)

    if user_id: query = query.where(Post.user_id == user_id)
    if community_id: query = query.where(Post.community_id == community_id)

    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving posts")