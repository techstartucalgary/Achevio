from typing import Optional
from collections.abc import AsyncGenerator

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

class Base(DeclarativeBase):
    ...


class TodoItem(UUIDAuditBase):
    __tablename__ = "todo_items"

    title: Mapped[str] = mapped_column(primary_key=True)
    done: Mapped[bool]


async def provide_transaction(db_session: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    try:
        async with db_session.begin():
            yield db_session
    except IntegrityError as exc:
        raise ClientException(
            status_code=HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


async def get_todo_by_title(todo_name, session: AsyncSession) -> TodoItem:
    query = select(TodoItem).where(TodoItem.title == todo_name)
    result = await session.execute(query)
    try:
        return result.scalar_one()
    except NoResultFound as e:
        raise NotFoundException(detail=f"TODO {todo_name!r} not found") from e


async def get_todo_list(done: Optional[bool], session: AsyncSession) -> list[TodoItem]:
    query = select(TodoItem)
    if done is not None:
        query = query.where(TodoItem.done.is_(done))

    result = await session.execute(query)
    return result.scalars().all()


@get("/")
async def get_list(session: AsyncSession, done: Optional[bool] = None) -> list[TodoItem]:
    return await get_todo_list(done, session)


@post("/")
async def add_item(data: TodoItem, session: AsyncSession) -> TodoItem:
    session.add(data)
    return data


@put("/{item_title:str}")
async def update_item(item_title: str, data: TodoItem, session: AsyncSession) -> TodoItem:
    todo_item = await get_todo_by_title(item_title, session)
    todo_item.title = data.title
    todo_item.done = data.done
    return todo_item



async def on_startup() -> None:
    """Initializes the database."""
    async with db_config.get_engine().begin() as conn:
        await conn.run_sync(UUIDAuditBase.metadata.drop_all) # Remove this line if you want to keep the data 
        await conn.run_sync(UUIDAuditBase.metadata.create_all)


db_config = SQLAlchemyAsyncConfig(
    connection_string="postgresql+psycopg://postgres:C00l!C0ff33@localhost:5432"
)


app = Litestar(
    [get_list, add_item, update_item],
    dependencies={"session": provide_transaction},
    plugins=[SQLAlchemyPlugin(db_config)],
    on_startup=[on_startup],
)