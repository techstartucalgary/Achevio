from litestar import post, get, Controller
from sqlalchemy.ext.asyncio import AsyncSession
from uuid_extensions import uuid7

from models.tag import Tag
from schemas.tag import TagSchema, TagDTO
from litestar.dto import DTOData

from crud.tag import get_tags_list


class TagController(Controller):
    path = '/tag'
    dto = TagDTO 

    @post('/', exclude_from_auth=True)
    async def create_tag(self, session: AsyncSession, data: DTOData[TagSchema]) -> TagSchema:
        tag_data = data.create_instance()
        # validated_tag = TagSchema.model_validate(tag_data)

        session.add(Tag(**tag_data.__dict__))
        await session.commit()

        return tag_data

    @get('/', exclude_from_auth=True)
    async def get_tags(self, session: AsyncSession) -> list[TagSchema]:
        return await get_tags_list(session)



