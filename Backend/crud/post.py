from uuid import UUID
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

import os

from models.post import Post

async def get_posts_list(session: AsyncSession, limit: int, offset: int) -> list[Post]:
    """
    Fetches a paginated list of Posts.

    Args:
        session: Database session for query execution.
        limit: Maximum number of Posts to return.
        offset: Number of Posts to skip before returning the results.

    Returns:
        A list of Post instances within specified limit and offset.
    """
    query = select(Post).limit(limit).offset(offset)
    result = await session.execute(query)
    
    return result.scalars().all()


async def get_post_by_id(session: AsyncSession, post_id: UUID) -> Post:
    """
    Fetches a single Post by its ID.

    Args:
        session: Database session for query execution.
        post_id: UUID of the Post to fetch.

    Returns:
        The Post object if found, None otherwise.

    Raises:
        HTTPException: If there's an issue retrieving the Post.
    """
    query = select(Post).where(Post.id == post_id)
    result = await session.execute(query)
    try:
        return result.scalars().one_or_none()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving post")
    

async def get_posts_by_user_id(session: AsyncSession, user_id: UUID) -> list[Post]:
    """
    Fetches all Posts made by a specific user.

    Args:
        session: Database session for query execution.
        user_id: UUID of the user whose Posts are to be retrieved.

    Returns:
        A list of Post instances made by the specified user.

    Raises:
        HTTPException: If there's an issue retrieving the Posts.
    """
    query = select(Post).where(Post.user_id == user_id).order_by(Post.created_at.desc())
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user posts")
    

async def get_posts_by_multiple_user_id(session: AsyncSession, user_ids: list[UUID], limit: int=100, offset: int=0) -> list[Post]:
    query = select(Post).where(Post.user_id.in_(user_ids)).limit(limit).offset(offset)
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving users posts")

async def get_posts_by_community_id(session: AsyncSession, community_id: UUID, limit: int=100, offset: int=0) -> list[Post]:
    """
    Fetches a paginated list of Posts belonging to a specific community.

    Args:
        session: Database session for query execution.
        community_id: UUID of the community whose Posts are to be retrieved.
        limit: Maximum number of Posts to return (default 100).
        offset: Number of Posts to skip before returning the results (default 0).

    Returns:
        A paginated list of Post instances belonging to the specified community.

    Raises:
        HTTPException: If there's an issue retrieving the Posts.
    """
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
    


async def delete_post_by_id(session: AsyncSession, post_id: UUID) -> None:
    query = delete(Post).where(Post.id == post_id)
    result = await session.execute(query)
    image_dir = "static/images/posts"
    post_image = os.path.join(image_dir, f'{post_id}.jpg')
    
    try:
        os.remove(post_image)
    except:
        return None
    

async def get_posts_from_id_list(session: AsyncSession, user_id: UUID) -> Post:
    query = select(Post).where(Post.id.in_())
    result = await session.execute(query)
    try:
        return result.scalars().one_or_none()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving post")
    



async def get_most_recent_user_post(session: AsyncSession, user_id: UUID) -> Post:
    query = select(Post).where(Post.user_id == user_id).order_by(Post.created_at.desc())
    result = await session.execute(query)
    try:
        return result.scalars().first()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving post")