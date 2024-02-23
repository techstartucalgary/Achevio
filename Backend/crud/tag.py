from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid_extensions import uuid7
from models.tag import Tag
from schemas.tag import TagSchema


async def get_tag_by_name(session: AsyncSession, name: str) -> Tag:
    """
    Fetches a Tag by its name.

    Args:
        session: Database session for query execution.
        name: Name of the Tag to fetch.

    Returns:
        The Tag object if found, None otherwise.

    Raises:
        HTTPException: If no Tag is found or multiple Tags are found.
    """
    query = select(Tag).where(Tag.name == name)
    result = await session.execute(query)
    try:
        return result.scalar_one_or_none()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving postday")


async def get_tags_list(session: AsyncSession,) -> list[TagSchema]:
    query = select(Tag)
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving tags")


# async def create_tag(session: AsyncSession, name: str) -> Tag:
#     """
#     Creates a new Tag with a given name.

#     Args:
#         session: Database session for committing new Tag.
#         name: Name for the new Tag.

#     Returns:
#         The newly created Tag object.
#     """
#     tag = Tag(id=uuid7(), name=name)
#     session.add(tag)
#     await session.commit()
#     return tag
