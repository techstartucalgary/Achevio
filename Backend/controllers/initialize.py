# Import necessary modules and libraries
from typing import Optional, Any

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put
from litestar import Controller
from models.user import User

from schemas.community import *
from crud.community import * 
from crud.postday import *
from litestar.dto import DTOData
import datetime
import pytz
from uuid_extensions import uuid7

from schemas.postday import *

from crud.postday import *

from faker import Faker

fake = Faker()

class InitializeController(Controller):
    path = '/initialize'

    @post('/postdays', exclude_from_auth=True)
    async def initialize_postdays(self, session: AsyncSession) -> str:
        postdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        for day in postdays:
            postday = Postday(id=uuid7(), day=day)
            session.add(postday)
        await session.commit()
        return 'Postdays created'
    
    @post('users', exclude_from_auth=True)
    async def initialize_users(self, session: AsyncSession) -> str:
        for i in range(5):
            name = fake.first_name()
            user = User(id=uuid7(), username=name, email=fake.email(), password=fake.password(), first_name=name, last_name=fake.last_name(),is_active=True, last_login=datetime.datetime.now(pytz.utc), posts=[], communities=[], profile_picture=None)
            session.add(user)
        await session.commit()
        return 'Users created'
