from uuid import UUID
from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

from models.post import Post

async def get_posts_list(session: AsyncSession, limit: int, offset: int) -> list[Post]:
    query = select(Post).limit(limit).offset(offset)
    result = await session.execute(query)
    
    return result.scalars().all()


async def get_posts_by_user_id(session: AsyncSession, user_id: UUID) -> list[Post]: # WIP
    query = select(Post).where(Post.user_id == user_id)
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user posts")