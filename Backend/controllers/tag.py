from litestar import post, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from models.tag import Tag
from schemas.tag import TagSchema, TagDTO


class TagController(Controller):
    path = '/tag'

    return_dto = TagDTO 

    @post('/', exclude_from_auth=True)
    # This method allows for the creation of a new postday.
    async def create_tag(self, session: AsyncSession, tag: str) -> TagSchema:
        tag = Tag(id=uuid7(), name=tag)
        validated_tag = TagSchema.model_validate(Tag(id=uuid7(), name=tag.name))

        session.add(tag)
        await session.commit()

        return validated_tag


