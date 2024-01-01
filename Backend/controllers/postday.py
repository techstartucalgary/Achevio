from litestar import post, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from schemas.postday import *
from crud.community import *

from models.postday import Postday


class PostdayController(Controller):
    path = '/postday' 
    return_dto = PostdayDTO 

    @post('/', exclude_from_auth=True)
    # This method allows for the creation of a new postday.
    async def create_postday(self, session: AsyncSession, day: str) -> PostdaySchema:
        '''
        Create a new postday.

        Args:
            session (AsyncSession): The database session for committing the new postday.
            day (str): The name of the day to create.

        Returns:
            PostdaySchema: The newly created postday's information.
        '''
        postday = Postday(id=uuid7(), day=day)
        validated_postday = PostdaySchema.model_validate(Postday(id=uuid7(), day=day))

        session.add(postday)
        await session.commit()

        return validated_postday
