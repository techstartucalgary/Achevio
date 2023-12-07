from __future__ import annotations

from typing import Optional
import argon2


from uuid import UUID

from litestar.dto import DTOConfig

from litestar.contrib.pydantic import PydanticDTO
from pydantic import BaseModel as _BaseModel

# Initialize Argon2 for password hashing
ph = argon2.PasswordHasher()

from datetime import datetime

# Define a base schema class that extends Pydantic's BaseModel
class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}

# Define the UserSchema class for user data
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

    communities: list[CommunitySchema] = []

    def set_password(self, str_password):
        self.password = ph.hash(str_password)

    def check_password(self, password):
        try:
            return ph.verify(self.password, password)
        except argon2.exceptions.VerifyMismatchError:
            return False

# Define the CommunitySchema class for community data
class CommunitySchema(Schema):
    id: UUID    
    name: str
    description: str
    users: list[UserSchema] = []

# Define a DTO for user data
class UserDTO(PydanticDTO[UserSchema]):
    config = DTOConfig()

# Define a DTO for user login data
class UserLoginDTO(UserDTO):
    config = DTOConfig(include={'username', 'password'})

# Define a DTO for creating a new user
class CreateUserDTO(PydanticDTO[UserSchema]):
    config = DTOConfig(include={'username', 'first_name', 'last_name', 'email', 'password'})

# Define a DTO for user data output
class UserOutDTO(PydanticDTO[UserSchema]):
    config = DTOConfig(
        max_nested_depth=2,
    )

# Define a DTO for community data
class CommunityDTO(PydanticDTO[CommunitySchema]):
    pass

# Define a DTO for creating a new community
class CreateCommunityDTO(PydanticDTO[CommunitySchema]):
    config = DTOConfig(exclude={'id', 'users'})

# Define a DTO for community data output
class CommunityOutDTO(PydanticDTO[CommunitySchema]):
    pass
