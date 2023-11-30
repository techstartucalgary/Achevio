from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from uuid import UUID
from models.users import User  # Import User model
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
    pass

# Association table for User and Community Many-to-Many relationship
user_community_association = Table(
    'user_community_association',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('user_table.id')),  # Ensure correct table name
    Column('community_id', Integer, ForeignKey('community_table.id'))
)

class Community(Base):
    __tablename__ = 'community_table'

    id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(255))
    post_days: Mapped[str] = mapped_column(String(100))  # Storing days as a comma-separated string
    owner_id: Mapped[UUID] = mapped_column(ForeignKey('user_table.id'))  # Ensure correct table name
    #frequency:

    # Relationships
    owner: Mapped[User] = relationship("User", backref="owned_communities")
    users: Mapped[list[User]] = relationship(
        "User",
        secondary=user_community_association,
        back_populates='communities'
    )

    # Placeholder for posts and tags
    # posts = relationship("Post", back_populates='community')
    # tags = relationship("Tag", secondary=tag_community_association)

class User(Base):
    __tablename__ = 'user_table'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    # ... other fields ...

    # Relationship with Community
    communities: Mapped[list[Community]] = relationship(
        "Community",
        secondary=user_community_association,
        back_populates="users"
    )

    # No changes needed here since 'owned_communities' backref is already defined in Community
