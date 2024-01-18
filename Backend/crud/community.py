from uuid import UUID
from sqlalchemy import select, orm, delete
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from models.user_community_association import UserCommunityAssociation

from models.community import Community

from models.user import User
#from crud.users import get_user_by_id
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



async def delete_community_by_id(session: AsyncSession, id: UUID, userID: UUID) -> None:
    """
    Delete a single community by its UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        id (UUID): The unique identifier of the community to delete.

    Raises:
        HTTPException: If there's an error deleting the community or if the community doesn't exist.
    """
    community = await get_community_by_id(session, id)
    if community is None:
        raise HTTPException(status_code=401, detail="Community not found")
    user = await get_user_by_id(session, userID)
    await validate_ownership(session, id, userID)

    query = select(UserCommunityAssociation).where(UserCommunityAssociation.community_id == id)
    result = await session.execute(query)
    user_associations = result.scalars().all()
    print(user_associations, len(user_associations))
    if len(user_associations) > 1:
        raise HTTPException(status_code=401, detail="Cannot delete community with more than one user")
    
    query = delete(Community).where(Community.id == id)
    result = await session.execute(query)
    try:
        pass


    except:
        # Raise an HTTP exception if there's an issue deleting the community.
        raise HTTPException(status_code=401, detail="Error deleting community")

from crud.users import get_user_by_id
async def validate_ownership(session: AsyncSession, id: UUID, userID: UUID):
    user = await get_user_by_id(session, userID)
    
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.community_id == id, UserCommunityAssociation.user_id == user.id)
    result = await session.execute(query)
    user_association = result.scalar_one_or_none()
    if user_association is None:
        raise HTTPException(status_code=401, detail="Unauthrized Operation")
    if user_association.role != "owner":
        raise HTTPException(status_code=401, detail="Unauthrized Operation")
    return
    
