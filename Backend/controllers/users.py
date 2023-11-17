from typing import Optional
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
from litestar import Controller

from uuid import UUID
from uuid_extensions import uuid7, uuid7str

from models.users import TodoItem, User
from litestar.dto import DataclassDTO, DTOConfig, DTOData

from schemas.users import UserSchema




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



# Function to get a list of todo items, possibly filtered by their done status
async def get_users(session: AsyncSession) -> list[User]:
    query = select(User)
    result = await session.execute(query)
    return result.scalars().all()  # Return all the results    



class UserController(Controller):
    path = '/users'


    @get('/')
    async def get_users(session: AsyncSession, done: Optional[bool] = None) -> list[UserSchema]:
        return await get_users(session)


    # Endpoint to get the list of todo items
    # @get("/")
    # async def get_list(session: AsyncSession, done: Optional[bool] = None) -> list[TodoItem]:
    #     return await get_todo_list(done, session)

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
