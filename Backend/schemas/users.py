from __future__ import annotations

from typing import TYPE_CHECKING, Optional
import argon2
from uuid import UUID

from litestar.dto import DTOConfig
from litestar.contrib.pydantic import PydanticDTO
# Initialize Argon2 for password hashing
ph = argon2.PasswordHasher()
from datetime import datetime
from .schema import Schema



class UserSchema(Schema):
    id: UUID
    username: str
    first_name: str
    last_name: str
    email: str
    profile_picture: Optional[str] = None
    password: str
    created_at: datetime
    updated_at: datetime
    is_active: bool
    last_login: datetime
    done_tutorial: bool = False
    # friends: list[UserSchema]

    posts: "list[PostSchema]" = []
    
    communities: "list[UserCommunityAssociationSchema]" = []

    def set_password(self, str_password):
        self.password = ph.hash(str_password)

    def check_password(self, password):
        try:
            return ph.verify(self.password, password)
        except argon2.exceptions.VerifyMismatchError:
            return False


# Define a DTO for user data
class UserDTO(PydanticDTO[UserSchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )
# Define a DTO for user login data
class UserLoginDTO(UserDTO):
    config = DTOConfig(include={'username', 'password'})

# Define a DTO for creating a new user
class CreateUserDTO(UserDTO):
    config = DTOConfig(include={'username', 'first_name', 'last_name', 'email', 'password'})



class UserOutDTO(UserDTO):
    config = DTOConfig(
        include={'id', 'username', 'done_tutorial', 'first_name', 'last_name', 'email', 'created_at', 'updated_at', 'is_active', 'last_login', 'communities'},
        max_nested_depth=2,
    )

class BasicUserOutDTO(UserDTO):
    config = DTOConfig(
        include={'id', 'username', 'first_name', 'last_name', 'email', 'created_at', 'updated_at', 'is_active', 'last_login'},
        max_nested_depth=2,
    )


class UpdateUserDTO(UserDTO):
    config = DTOConfig(
        include={'username', 'first_name', 'last_name', 'email'}
    )


from .post import PostSchema
from .user_community_association import UserCommunityAssociationSchema
UserSchema.model_rebuild()

