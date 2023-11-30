from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid_extensions import uuid7, uuid7str

from models.posts import *
from litestar.dto import DataclassDTO, DTOConfig, DTOData

from Backend.schemas.posts import postSchema

# Get list of posts
async def get_post_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[postSchema]:
    query = select(Post).options(orm.selectinload(Post.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return [postSchema.model_validate(Post) for post in result.scalars().all()]


# Get a post using its postId
async def get_post(session: AsyncSession, postId: UUID) -> postSchema:
    query = select(Post).options(orm.selectinload(Post.communities)).where(Post.postId == postId)
    result = await session.execute(query)
    try:
        return postSchema.model_validate(result.scalar_one())
    except:
        raise HTTPException(status_code=404, detail="Post not found")