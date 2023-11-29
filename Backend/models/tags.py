from sqlalchemy import Table, Column, ForeignKey, String
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase

from uuid_extensions import uuid7, uuid7str

from uuid import UUID

class Base(DeclarativeBase):
    pass

tag_community_association_table = Table(
    'tag_community_association_table',
    Base.metadata,
    Column('tag_id', ForeignKey('tag_table.id'), primary_key=True),
    Column('community_id', ForeignKey('community_table.id'), primary_key=True),
)

class Tag(Base):
    __tablename__ = 'tag_table'

    id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    communities: Mapped[list['Community']] = relationship("Community", secondary=tag_community_association_table, back_populates='tags')