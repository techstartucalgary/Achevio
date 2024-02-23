from uuid import UUID
from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

from models.community import Community

from models.user import User

async def get_community_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[Community]:
    """
    Retrieve a list of communities with optional pagination.

    Args:
        session (AsyncSession): The database session for executing queries.
        limit (int): Maximum number of communities to return.
        offset (int): Number of communities to skip before starting to return results.

    Returns:
        list[Community]: A list of Community objects.
    """
    # Create a query to select communities with related users and postdays, with a limit and offset for pagination, and execute it.
    query = select(Community).options(orm.selectinload(Community.users)).options(orm.selectinload(Community.postdays)).options(orm.selectinload(Community.tags)).limit(limit).offset(offset)
    result = await session.execute(query)
    
    # Return all community records as a list.
    return result.scalars().all()


async def search_communities(session: AsyncSession, asc: bool = True) -> list[Community]:
    query = select(Community).options(orm.selectinload(Community.users)).options(orm.selectinload(Community.postdays)).options(orm.selectinload(Community.tags)).limit(limit).offset(offset)
    result = await session.execute(query)

    vals = result.scalars().all()

    if asc:
        sorted(vals)
    else:
        sorted(vals, reverse=True)
    return vals



async def get_community_by_id(session: AsyncSession, id: UUID) -> Community:
    """
    Retrieve a single community by its UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        id (UUID): The unique identifier of the community to retrieve.

    Returns:
        Community: The Community object with the specified UUID.

    Raises:
        HTTPException: If there's an error retrieving the community or if the community doesn't exist.
    """
    # Create a query to find the community by its UUID and execute it.
    query = select(Community).options(orm.selectinload(Community.users)).options(orm.selectinload(Community.tags)).options(orm.selectinload(Community.postdays)).where(Community.id == id)
    result = await session.execute(query)
    try:
        # Return the single community or None if not found.
        return result.scalar_one_or_none()
    except:
        # Raise an HTTP exception if there's an issue retrieving the community.
        raise HTTPException(status_code=401, detail="Error retrieving community")


async def get_community_by_name(session: AsyncSession, name: str) -> Community:
    """
    Retrieve a single community by its name.

    Args:
        session (AsyncSession): The database session for executing queries.
        name (str): The name of the community to retrieve.

    Returns:
        Community: The Community object with the specified name.

    Raises:
        HTTPException: If there's an error retrieving the community or if the community doesn't exist.
    """
    # Create a query to find the community by its name and execute it.
    query = select(Community).options(orm.selectinload(Community.users)).where(Community.name == name)
    result = await session.execute(query)
    try:
        # Return the single community or None if not found.
        return result.scalar_one_or_none()
    except:
        # Raise an HTTP exception if there's an issue retrieving the community.
        raise HTTPException(status_code=401, detail="Error retrieving community")
