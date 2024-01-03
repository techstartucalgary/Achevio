from uuid import UUID
from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

from models.community import *
from uuid_extensions import uuid7

async def get_postday_list(session: AsyncSession) -> list[Postday]:
    """
    Retrieve a list of all postdays from the database.

    Args:
        session (AsyncSession): The database session for executing queries.

    Returns:
        list[Postday]: A list of Postday objects.
    """
    # Create a query to select all postdays and execute it.
    query = select(Postday).options(orm.selectinload(Postday.communities))
    result = await session.execute(query)
    
    # Return all postday records as a list.
    return result.scalars().all()


async def get_postday_by_name(session: AsyncSession, name: str) -> Postday:
    """
    Retrieve a single postday by its name.

    Args:
        session (AsyncSession): The database session for executing queries.
        name (str): The name of the postday to retrieve.

    Returns:
        Postday: The postday object with the specified name.

    Raises:
        HTTPException: If there's an error retrieving the postday or if the postday doesn't exist.
    """
    # Create a query to find the postday by name and execute it.
    query = select(Postday).options(orm.selectinload(Postday.communities)).where(Postday.day == name)
    result = await session.execute(query)
    
    try:
        # Return the single postday or None if not found.
        return result.scalar_one_or_none()
    except:
        # Raise an HTTP exception if there's an issue retrieving the postday.
        raise HTTPException(status_code=401, detail="Error retrieving postday")


async def create_postday(session: AsyncSession, day: str) -> Postday:
    """
    Create a new postday with the specified name.

    Args:
        session (AsyncSession): The database session for executing queries and committing changes.
        day (str): The name of the postday to create.

    Returns:
        Postday: The newly created postday object.
    """
    # Create a new Postday object and add it to the session.
    postday = Postday(id=uuid7(), day=day)
    session.add(postday)
    
    # Commit the new postday to the database and return it.
    await session.commit()
    return postday
