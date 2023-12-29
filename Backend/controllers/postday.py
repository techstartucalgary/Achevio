from litestar import post, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from schemas.postday import *
from crud.community import *

# PostdayController is a class that manages operations related to postdays,
# such as creating a new postday.
class PostdayController(Controller):
    path = '/postday'  # Sets the base API path for all routes in this controller.
    return_dto = PostdayDTO  # Specifies the default data transfer object for return values.

    @post('/', exclude_from_auth=True)
    # This method allows for the creation of a new postday.
    async def create_postday(self, session: AsyncSession, day: str) -> PostdaySchema:
        """
        Create a new postday.

        Args:
            session (AsyncSession): The database session for committing the new postday.
            day (str): The name of the day to create.

        Returns:
            PostdaySchema: The newly created postday's information.
        """
        # Instantiate a new Postday object and validate it against the PostdaySchema.
        postday = Postday(id=uuid7(), day=day)
        validated_postday = PostdaySchema.model_validate(Postday(id=uuid7(), day=day))

        # Add the new postday to the session and commit the transaction.
        session.add(postday)
        await session.commit()

        # Return the validated postday information.
        return validated_postday
