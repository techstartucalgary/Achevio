from typing import Optional
from collections.abc import AsyncGenerator
from dotenv import load_dotenv
import os

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from litestar import Litestar, get, post, put
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig, SQLAlchemyPlugin
from litestar.contrib.sqlalchemy.plugins import SQLAlchemyAsyncConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase, UUIDBase
from litestar.exceptions import ClientException, NotFoundException
from litestar.status_codes import HTTP_409_CONFLICT

from uuid import UUID
from uuid_extensions import uuid7, uuid7str




"""
We will be using this as starter code, following the todo example I showed you. This is essentially the same thing but now connected
to a PostgreSQL database. We will be using more relevant datatypes rather than this "TodoItem" for our project. This is just as an
example

Please refer to the documentation:
Litestar:
-   https://docs.litestar.dev/2/

SQLAchemy:
-   https://docs.sqlalchemy.org/en/14/

Things to do (exercises):

    - Split them into different directories (models, endpoints, and the app itself)
    - Make it so that creating a TodoItem does not require an id to create (have it automatically create one, hint use uuid7()!)


"""




load_dotenv()

# Base class for our SQLAlchemy models
class Base(DeclarativeBase):
    ...

# Our TodoItem model inherits from UUIDAuditBase which includes timestamp and UUID fields
class TodoItem(UUIDAuditBase):
    __tablename__ = "todo_items"  # Table name in database

    # Mapped columns in the table
    title: Mapped[str] = mapped_column(primary_key=True)  # Title of the todo item, used as the primary key
    done: Mapped[bool]  # Boolean to mark if the todo item is done

# This function is used to provide a transactional session to the endpoints
async def provide_transaction(db_session: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    try:
        async with db_session.begin():  # Begin a transaction
            yield db_session
    except IntegrityError as exc:  # Catch any integrity errors from the database
        # Raise a client exception if an integrity error occurs
        raise ClientException(
            status_code=HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

# Function to retrieve a todo item by its title
async def get_todo_by_title(todo_name, session: AsyncSession) -> TodoItem:
    query = select(TodoItem).where(TodoItem.title == todo_name)  # Query to find the item
    result = await session.execute(query)
    try:
        return result.scalar_one()  # Return a single result
    except NoResultFound as e:  # If no result is found
        # Raise a NotFoundException with a custom message
        raise NotFoundException(detail=f"TODO {todo_name!r} not found") from e

# Function to get a list of todo items, possibly filtered by their done status
async def get_todo_list(done: Optional[bool], session: AsyncSession) -> list[TodoItem]:
    query = select(TodoItem)
    if done is not None:  # If a done filter is provided
        query = query.where(TodoItem.done.is_(done))  # Apply the filter

    result = await session.execute(query)
    return result.scalars().all()  # Return all the results

# Endpoint to get the list of todo items
@get("/")
async def get_list(session: AsyncSession, done: Optional[bool] = None) -> list[TodoItem]:
    return await get_todo_list(done, session)

# Endpoint to add a new todo item
@post("/")
async def add_item(data: TodoItem, session: AsyncSession) -> TodoItem:
    session.add(data)  # Add the new item to the session
    return data  # Return the new item

# Endpoint to update an existing todo item
@put("/{item_title:str}")
async def update_item(item_title: str, data: TodoItem, session: AsyncSession) -> TodoItem:
    todo_item = await get_todo_by_title(item_title, session)  # Get the existing item
    # Update the item's title and done status
    todo_item.title = data.title
    todo_item.done = data.done
    return todo_item  # Return the updated item

# Function that will run on app startup
async def on_startup() -> None:
    """Initializes the database."""
    async with db_config.get_engine().begin() as conn:
        # Drop and recreate tables (remove this line if persistence is needed)
        await conn.run_sync(UUIDAuditBase.metadata.drop_all)
        await conn.run_sync(UUIDAuditBase.metadata.create_all)

# Database configuration using environment variables
db_config = SQLAlchemyAsyncConfig(
    connection_string=f"postgresql+psycopg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@localhost:5432/{os.getenv('POSTGRES_DB')}")

# Create the Litestar application instance
app = Litestar(
    [get_list, add_item, update_item],  # List of endpoint functions
    dependencies={"session": provide_transaction},  # Dependency to inject session into endpoints
    plugins=[SQLAlchemyPlugin(db_config)],  # Plugin for SQLAlchemy support
    on_startup=[on_startup],  # Startup event handler
)