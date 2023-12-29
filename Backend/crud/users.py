from sqlalchemy import select, delete, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException
from uuid import UUID
from models.user import User
from crud.community import get_community_by_id
from models.user_community_association import UserCommunityAssociation
from schemas.users import UserSchema

async def user_join_community(session: AsyncSession, communityID: UUID, username: User, role: str = "member") -> UserSchema:
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
    community = await get_community_by_id(session, communityID)
    user = await get_user(session, username)
    
    # Create a new association between the user and community with the given role.
    user_community_join = UserCommunityAssociation(user_id=user.id, community_id=community.id, role=role, community_name=community.name)
    user.communities.append(user_community_join)
    return user


async def user_leave_community(session: AsyncSession, communityID: UUID, username: User) -> str:
    """
    Remove a user from a community.

    Args:
        session (AsyncSession): The database session for executing queries and committing changes.
        communityID (UUID): The unique identifier of the community to leave.
        username (User): The user object or identifier.

    Returns:
        str: A message indicating the user has left the community.
    """
    # Retrieve the user and delete the association with the community.
    user = await get_user(session, username)
    query = delete(UserCommunityAssociation).where(UserCommunityAssociation.community_id == communityID).where(UserCommunityAssociation.user_id == user.id)
    await session.execute(query)
    return f"{username} has left the community with ID {communityID}"


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


async def get_user(session: AsyncSession, username: str) -> UserSchema:
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
