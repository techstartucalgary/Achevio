from sqlalchemy import select, delete, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid import UUID
from models.user import User
from crud.community import get_community_by_id
from models.user_community_association import UserCommunityAssociation
from schemas.users import UserSchema
from models.community import Community

async def user_join_community(session: AsyncSession, community_id: UUID, user_id: User, goal_nb_of_days: int, role: str = "member") -> UserSchema:
    """
    Add a user to a community with a specified role.

    Args:
        session (AsyncSession): The database session for executing queries and committing changes.
        communityID (UUID): The unique identifier of the community to join.
        username (User): The user object or identifier.
        role (str): The role to assign to the user within the community (default is "member").

    Returns:
        UserSchema: The updated user object after joining the community.
    """
    # Retrieve the specified community and user.
    community = await get_community_by_id(session, community_id)
    user = await get_user_by_id(session, user_id)
    
    # Create a new association between the user and community with the given role.
    user_community_join = UserCommunityAssociation(user_id=user.id, community_id=community.id, role=role, community_name=community.name, goal_nb_of_days=goal_nb_of_days)
    user.communities.append(user_community_join)
    return user


async def user_leave_community(session: AsyncSession, communityID: UUID, user_id: UUID) -> None:
    """
    Remove a user from a community.

    Args:
        session (AsyncSession): The database session for executing queries and committing changes.
        communityID (UUID): The unique identifier of the community to leave.
        username (User): The user object or identifier.

    Returns:
        None
    """
    # Retrieve the user and delete the association with the community.
    query = delete(UserCommunityAssociation).where(UserCommunityAssociation.community_id == communityID).where(UserCommunityAssociation.user_id == user_id)
    await session.execute(query)
        

async def get_user_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[User]:
    """
    Retrieve a list of users with optional pagination.

    Args:
        session (AsyncSession): The database session for executing queries.
        limit (int): Maximum number of users to return.
        offset (int): Number of users to skip before starting to return results.

    Returns:
        list[User]: A list of User objects.
    """
    # Create a query to select users with a limit and offset for pagination and execute it.
    query = select(User).options(orm.selectinload(User.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return result.scalars().all()


async def get_user_by_username(session: AsyncSession, username: str) -> User:
    """
    Retrieve a single user by their username.

    Args:
        session (AsyncSession): The database session for executing queries.
        username (str): The username of the user to retrieve.

    Returns:
        UserSchema: The user object with the specified username.

    Raises:
        HTTPException: If there's an error retrieving the user or if the user doesn't exist.
    """
    # Create a query to find the user by username and execute it.
    query = select(User).options(orm.selectinload(User.communities)).where(User.username == username)
    result = await session.execute(query)
    try:
        return result.scalar_one()
    except:
        # Raise an HTTP exception if there's an issue retrieving the user.
        raise HTTPException(status_code=401, detail="Error retrieving user")


async def get_user_friends(session: AsyncSession, id: UUID) -> list[User]:
    query = select(User.friends).options(orm.selectinload(User.communities)).where(User.id == id)
    result = await session.execute(query)
    return result.scalars().all()


async def get_user_by_id(session: AsyncSession, id: UUID) -> User:
    """
    Retrieve a single user by their username.

    Args:
        session (AsyncSession): The database session for executing queries.
        username (str): The username of the user to retrieve.

    Returns:
        UserSchema: The user object with the specified username.

    Raises:
        HTTPException: If there's an error retrieving the user or if the user doesn't exist.
    """
    # Create a query to find the user by username and execute it.
    query = select(User).options(orm.selectinload(User.communities)).options(orm.selectinload(User.friends)).where(User.id == id)
    result = await session.execute(query)
    try:
        return result.scalar_one()
    except:
        # Raise an HTTP exception if there's an issue retrieving the user.
        raise HTTPException(status_code=401, detail="Error retrieving user")


async def get_friends_by_id(session: AsyncSession, id: UUID) -> list[User]:
    query = select(User).options(orm.selectinload(User.friends)).where(User.id == id)
    result = await session.execute(query)
    try:
        return result.scalars().all()
    except:
        raise HTTPException(status_code=401, detail="Error retrieving user")
    


async def transfer_community_ownership(session: AsyncSession, id: UUID, user: User, new_owner: str) -> str:
    """
    Transfer ownership of a community to a new user.

    Args:
        session (AsyncSession): The database session for executing queries.
        id (UUID): The unique identifier of the community to transfer ownership of.
        new_owner (UUID): The unique identifier of the new owner.

    Returns:
        Community: The Community object with the specified UUID.

    Raises:
        HTTPException: If there's an error retrieving the community or if the community doesn't exist.
    """
    community = await get_community_by_id(session, id)
    
    if community is None:
        raise HTTPException(status_code=401, detail="Community not found")

    new_owner = await get_user_by_id(session, new_owner)
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.community_id == id, UserCommunityAssociation.user_id == user.id)
    result = await session.execute(query)
    user_association = result.scalar_one_or_none()
    if user_association is None:
        raise HTTPException(status_code=401, detail="Unauthrized Transfer")
    if user_association.role != "owner":
        raise HTTPException(status_code=401, detail="Unauthrized Transfer")
 
        
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.community_id == id, UserCommunityAssociation.user_id == new_owner.id)
    result = await session.execute(query)
    new_owner_association = result.scalar_one_or_none()
    if new_owner_association is None:
        raise HTTPException(status_code=401, detail="The new owner is not a member of the community")

    user_association.role = "admin"
    new_owner_association.role = "owner"

    await session.commit()
    return community


async def get_user_communities(session: AsyncSession, user_id: UUID):
    query = select(Community).join(UserCommunityAssociation, Community.id == UserCommunityAssociation.community_id).filter(UserCommunityAssociation.user_id == user_id).options(orm.selectinload(Community.tags))
    result = await session.execute(query)
    return result.scalars().all()


    query = select(Community)
    result = await session.execute(query)
    return result.scalars().all()


async def get_user_community_association_by_id(session: AsyncSession, user_id: UUID, community_id: UUID):
    query = select(UserCommunityAssociation).where(UserCommunityAssociation.user_id == user_id, UserCommunityAssociation.community_id == community_id)
    result = await session.execute(query)
    return result.scalar_one_or_none()



async def get_all_timezones(session: AsyncSession):
    query = select(User.timezone).distinct()
    result = await session.execute(query)
    return result.scalars().all()


async def get_user_ids_for_timezone(session: AsyncSession, timezone: str):
    query = select(User.id).where(User.timezone == timezone)
    result = await session.execute(query)
    return result.scalars().all()