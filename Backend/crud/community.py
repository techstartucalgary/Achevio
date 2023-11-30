from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.exc import NoResultFound

from models.community import Community

  # Assuming this is your SQLAlchemy Community model

async def get_community_list(session: AsyncSession, limit: int, offset: int) -> list[Community]:
    result = await session.execute(
        select(Community).offset(offset).limit(limit)
    )
    return result.scalars().all()

async def get_community(session: AsyncSession, community_id: str) -> Community:
    result = await session.execute(
        select(Community).where(Community.id == community_id)
    )
    community = result.scalars().first()
    if not community:
        raise NoResultFound("Community not found")
    return community

async def create_community(session: AsyncSession, community_data: dict) -> Community:
    new_community = Community(**community_data)
    session.add(new_community)
    await session.commit()
    await session.refresh(new_community)
    return new_community

async def update_community(session: AsyncSession, community_id: str, data: dict) -> Community:
    result = await session.execute(
        update(Community).where(Community.id == community_id).values(**data).returning(Community)
    )
    updated_community = result.scalar_one_or_none()
    if not updated_community:
        raise NoResultFound("Community not found")
    await session.commit()
    return updated_community

async def delete_community(session: AsyncSession, community_id: str) -> bool:
    result = await session.execute(
        delete(Community).where(Community.id == community_id)
    )
    if result.rowcount == 0:
        raise NoResultFound("Community not found")
    await session.commit()
    return True
