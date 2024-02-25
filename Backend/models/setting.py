from sqlalchemy import UUID, ForeignKey, Boolean
from litestar.contrib.sqlalchemy.base import UUIDBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String


class Setting(UUIDBase):
    __tablename__ = 'settings_table'

    user_id: Mapped[UUID] = mapped_column(UUID)

    dark_mode: Mapped[bool] = mapped_column(Boolean)
    notifications: Mapped[bool] = mapped_column(Boolean)
