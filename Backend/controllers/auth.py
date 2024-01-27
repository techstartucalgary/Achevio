import os
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import AsyncSession

from litestar import Response, Request, post
from litestar.dto import DTOData
from litestar.exceptions import HTTPException
from litestar.contrib.jwt import OAuth2Login, OAuth2PasswordBearerAuth, Token

from schemas.users import UserLoginDTO, UserSchema
from models.user import User
from crud.users import *
from datetime import datetime, timedelta

load_dotenv()

from lib.redis import redis as redis


async def retrieve_user_handler(token: Token, session: AsyncSession) -> User:
    '''
    Retrieve a user from the cache or the database based on the JWT token.

    Args:
        token (Token): The JWT token containing user information.
        session (AsyncSession): The database session.

    Returns:
        User: The retrieved user object.
    '''
    try:
        # Check if the user is cached in Redis, return username if found.
        if await redis.hget(f'session:{token.sub}', 'user_id'):
            return token.sub
    except Exception as e:
        print(f'Error retrieving user: {e}')
        return None
    
    
oauth2_auth = OAuth2PasswordBearerAuth[User](
    retrieve_user_handler=retrieve_user_handler,
    token_secret = os.getenv('JWT_SECRET'),
    token_url = '/login',
    default_token_expiration = timedelta(seconds=6000),
    exclude = ['/login', '/schema'],
)


@post('/login', dto=UserLoginDTO)
async def login_handler(request: Request, data: DTOData[UserSchema], session: AsyncSession) -> Response[OAuth2Login]:
    '''
    Handle user login.

    Args:
        request (Request): The HTTP request object (Dependency Injection).
        data (DTOData[UserSchema]): The user login data.
        session (AsyncSession): The database session (Dependency Injection).

    Returns:
        Response[OAuth2Login]: The login response containing an OAuth2 token.
        
    Raises:
        HTTPException: If the login credentials are incorrect.
    '''
    input_data = data.as_builtins()
    user = UserSchema.model_validate(await get_user_by_username(session, input_data['username']))
    if user and user.check_password(input_data['password']):
        # Generate and store an OAuth2 token.
        token = oauth2_auth.login(identifier=str(user.id))

        # Store user session data in Redis.
        session_key = f'session:{user.id}'
        await redis.hmset(session_key, {'user_id': str(user.id), 'username': user.username, 'token': str(token.cookies)})
        
        return token

    # Return a 401 Unauthorized error for incorrect credentials.
    raise HTTPException(status_code=401, detail='Incorrect username or password')


@post('/logout')
async def logout_handler(request: Request, session: AsyncSession) -> str:
    '''
    Handle user logout.

    Args:
        request (Request): The HTTP request object (Dependency Injection).
        session (AsyncSession): The database session (Dependency Injection).

    Returns:
        str: A success message indicating successful logout.
    '''
    # Remove the user's session data from Redis.
    await redis.hdel(f'session:{request.id}', 'id')
    return 'Successfully logged out'
