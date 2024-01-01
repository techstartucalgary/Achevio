# Import necessary modules and libraries
from typing import Optional, Any

from sqlalchemy.ext.asyncio import AsyncSession
from litestar import Response, Request, get, post, put
from litestar import Controller

from schemas.community import *
from crud.community import * 
from crud.postday import *
from litestar.dto import DTOData
import datetime
import pytz
from uuid_extensions import uuid7

from schemas.postday import *

from crud.postday import *

class InitializeController(Controller):
    path = '/initialize'

    @post('/postdays', exclude_from_auth=True)
    async def create_postdays(self, session: AsyncSession) -> str:
        postdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        for day in postdays:
            postday = Postday(id=uuid7(), day=day)
            session.add(postday)
        await session.commit()
        return 'Postdays created'
