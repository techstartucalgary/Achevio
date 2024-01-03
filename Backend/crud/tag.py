from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid_extensions import uuid7
from models.tag import Tag



async def get_tag_by_name(session: AsyncSession, name: str) -> Tag:
    query = select(Tag).where(Tag.name == name)
    result = await session.execute(query)
    try:
        return result.scalar_one_or_none()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving postday")


async def create_postday(session: AsyncSession, name: str) -> Tag:
    tag = Tag(id=uuid7(), name=name)
    session.add(tag)
    await session.commit()
    return tag
