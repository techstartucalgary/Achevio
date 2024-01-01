from sqlalchemy import UUID, ForeignKey
from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String


class Post(UUIDAuditBase):
    __tablename__ = 'post_table'
    
    title: Mapped[str] = mapped_column(String(100), unique=True)
    caption: Mapped[str] = mapped_column(String(100))
    image: Mapped[UUID] = mapped_column(UUID, nullable=False)

    user_id: Mapped[UUID] = mapped_column(ForeignKey('user_table.id'))
    community_id: Mapped[UUID] = mapped_column(ForeignKey('community_table.id'))
    # user: Mapped['User'] = relationship('User', back_populates='posts')    

