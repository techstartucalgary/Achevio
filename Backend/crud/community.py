from typing import Any

from typing import Any
from uuid import UUID
from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

from models.user_community_association import UserCommunityAssociation
from models.community import Community
from schemas.community import CommunityBaseSchema,CommunitySearchResultSchema

from models.user import User
from sqlalchemy import func

from uuid_extensions import uuid7
import asyncio
from schemas.users import UserSchema
from schemas.tag import TagSchema

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
    query = select(Community).options(orm.selectinload(Community.users)).options(orm.selectinload(Community.tags)).limit(limit).offset(offset)
    result = await session.execute(query)
    
    # Return all community records as a list.
    return result.scalars().all()


async def get_basic_community_list(session: AsyncSession, asc: bool = True) -> list[Community]:
    query = select(Community).options(orm.selectinload(Community.users)).options(orm.selectinload(Community.tags))
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
    query = select(Community).options(orm.selectinload(Community.users)).options(orm.selectinload(Community.tags)).where(Community.id == id)
    result = await session.execute(query)
    try:
        # Return the single community or None if not found.
        return result.scalar_one()
    except:
        # Raise an HTTP exception if there's an issue retrieving the community.
        raise HTTPException(status_code=401, detail="Error retrieving community")


async def get_community_requests_by_id(session: AsyncSession, id: UUID) -> list[User]:
    """
    Retrieve a list of user requests to join a community by community UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        id (UUID): The unique identifier of the community.

    Returns:
        list[User]: A list of User objects representing the users who have requested to join the community.
    """
    # Create a query to find the user requests to join the community by its UUID and execute it.
    query = select(Community).options(orm.selectinload(Community.requests)).where(Community.id == id)
    result = await session.execute(query)
    community = result.scalar_one_or_none()
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return community.requests



async def fetch_and_convert(session: AsyncSession, query):
    result = await session.execute(query)
    return [CommunityBaseSchema(**item.__dict__) for item in result.scalars().all()]



async def search_communities(session: AsyncSession) -> CommunitySearchResultSchema:
    popular_query = (
        select(Community)
        .options(orm.selectinload(Community.tags))
        .options(orm.selectinload(Community.users))
        .where(Community.public == True)
        .group_by(Community.id)
        .order_by(func.count().desc())
    )
    
    trending_query = (
        select(Community).
        options(orm.selectinload(Community.tags)).
        where(Community.public == True).
        order_by(Community.created_at)
    )

    for_you_query = (
        select(Community).
        options(orm.selectinload(Community.tags)).
        where(Community.public == True).
        order_by(Community.created_at)
    )

    popular = await fetch_and_convert(session, popular_query)
    trending = await fetch_and_convert(session, trending_query)
    for_you = await fetch_and_convert(session, for_you_query)
    
    return CommunitySearchResultSchema(popular=popular, trending=trending, for_you=for_you)

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


async def get_community_users(session: AsyncSession, id: UUID, limit: int = 100, offset: int = 0) -> list[User]:
    """
    Retrieve a list of all users with optional pagination.

    Args:
        session (AsyncSession): The database session for executing queries.
        limit (int): Maximum number of users to return.
        offset (int): Number of users to skip before starting to return results.

    Returns:
        list[User]: A list of User objects.
    """
    
    
    
    query = select(Community).where(Community.id == id)
    result = await session.execute(query)
    community = result.scalar_one_or_none()
    
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    
 
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.community_id == id).limit(limit).offset(offset)
    result = await session.execute(query)
    user_associations = result.scalars().all()
    user_ids = [association.user_id for association in user_associations]
    users = []
    for id in user_ids:
        query = select(User).options(orm.selectinload(User.communities)).where(User.id == id)
        result = await session.execute(query)
        try:
            user = result.scalar_one()
        except:
            # Raise an HTTP exception if there's an issue retrieving the user.
            raise HTTPException(status_code=401, detail="Error retrieving user")
        users.append(user)

    return users



async def get_user_community_association(session: AsyncSession, user_id: UUID, community_id: UUID) -> UserCommunityAssociation:
    """
    Retrieve a single user community association by user and community UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        user_id (UUID): The unique identifier of the user.
        community_id (UUID): The unique identifier of the community.

    Returns:
        UserCommunityAssociation: The UserCommunityAssociation object with the specified user and community UUIDs.

    Raises:
        HTTPException: If there's an error retrieving the user community association or if the association doesn't exist.
    """
    # Create a query to find the user community association by user and community UUIDs and execute it.
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.user_id == user_id, UserCommunityAssociation.community_id == community_id)
    result = await session.execute(query)
    try:
        # Return the single user community association or None if not found.
        return result.scalar_one_or_none()
    except:
        # Raise an HTTP exception if there's an issue retrieving the user community association.
        raise HTTPException(status_code=401, detail="Error retrieving user community association")


async def get_user_community_association_by_user_id(session: AsyncSession, user_id: UUID) -> list[UserCommunityAssociation]:
    """
    Retrieve a list of user community associations by user UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        user_id (UUID): The unique identifier of the user.

    Returns:
        list[UserCommunityAssociation]: A list of UserCommunityAssociation objects with the specified user UUID.

    Raises:
        HTTPException: If there's an error retrieving the user community associations or if the associations don't exist.
    """
    # Create a query to find the user community associations by user UUID and execute it.
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.user_id == user_id)
    result = await session.execute(query)
    try:
        # Return the list of user community associations or an empty list if not found.
        return result.scalars().all()
    except:
        # Raise an HTTP exception if there's an issue retrieving the user community associations.
        raise HTTPException(status_code=401, detail="Error retrieving user community associations")


async def get_user_community_association_by_community_id(session: AsyncSession, community_id: UUID) -> list[UserCommunityAssociation]:
    """
    Retrieve a list of user community associations by community UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        community_id (UUID): The unique identifier of the community.

    Returns:
        list[UserCommunityAssociation]: A list of UserCommunityAssociation objects with the specified community UUID.

    Raises:
        HTTPException: If there's an error retrieving the user community associations or if the associations don't exist.
    """
    # Create a query to find the user community associations by community UUID and execute it.
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.community_id == community_id)
    result = await session.execute(query)
    try:
        # Return the list of user community associations or an empty list if not found.
        return result.scalars().all()
    except:
        # Raise an HTTP exception if there's an issue retrieving the user community associations.
        raise HTTPException(status_code=401, detail="Error retrieving user community associations")

async def get_users_by_tier(session, community_id):
    # Query for users in the 'bronze' tier
    bronze_users_query = select(UserCommunityAssociation).filter(
        UserCommunityAssociation.community_id == community_id,
        UserCommunityAssociation.tier == 'bronze'
    ).all()

    # Query for users in the 'silver' tier
    silver_users_query = select(UserCommunityAssociation).filter(
        UserCommunityAssociation.community_id == community_id,
        UserCommunityAssociation.tier == 'silver'
    ).all()

    # Query for users in the 'gold' tier
    gold_users_query = select(UserCommunityAssociation).filter(
        UserCommunityAssociation.community_id == community_id,
        UserCommunityAssociation.tier == 'gold'
    ).all()

    bronze_users = (await session.execute(bronze_users_query)).scalars().all()
    silver_users = (await session.execute(silver_users_query)).scalars().all()
    gold_users = (await session.execute(gold_users_query)).scalars().all()

    return bronze_users, silver_users, gold_users



async def get_community_tags(session: AsyncSession, id: UUID) -> list[str]:
    """
    Retrieve a list of tags associated with a community by community UUID.

    Args:
        session (AsyncSession): The database session for executing queries.
        id (UUID): The unique identifier of the community.

    Returns:
        list[str]: A list of strings representing the tags associated with the community.
    """
    # Create a query to find the tags associated with the community by its UUID and execute it.
    query = select(Community).options(orm.selectinload(Community.tags)).where(Community.id == id)
    result = await session.execute(query)
    community = result.scalar_one_or_none()
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return community.tags


async def get_community_name_by_id(session: AsyncSession, community_id: UUID):
    query = select(Community).where(Community.id == community_id)
    result = await session.execute(query)
    community = result.scalar_one_or_none()
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return community.name



async def get_leaderboard(session: AsyncSession, community_id: UUID) -> list[UserCommunityAssociation]:
    """
    Retrieve a list of users in a community sorted by their XP.

    Args:
        session (AsyncSession): The database session for executing queries.
        community_id (UUID): The unique identifier of the community.

    Returns:
        list[User]: A list of User objects.
    """
    # Create a query to find the users in the community sorted by their XP and execute it.
    query = select(UserCommunityAssociation).options(orm.selectinload(UserCommunityAssociation.user)).where(UserCommunityAssociation.community_id == community_id).order_by(UserCommunityAssociation.season_xp.desc())
    result = await session.execute(query)
    user_associations = result.scalars().all()
    return user_associations