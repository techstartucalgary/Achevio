from sqlalchemy import select, orm
from sqlalchemy.ext.asyncio import AsyncSession
from litestar.exceptions import HTTPException

from models.tags import Tag
from schemas.tags import TagSchema

# Function to get a list of tags
async def get_tag_list(session: AsyncSession, limit: int = 100, offset: int = 0) -> list[TagSchema]:
    query = select(Tag).options(orm.selectinload(Tag.communities)).limit(limit).offset(offset)
    result = await session.execute(query)
    return [TagSchema.model_validate(tag) for tag in result.scalars().all()]

# Function to get a specific tag by id
async def get_tag(session: AsyncSession, tag_id: UUID) -> TagSchema:
    query = select(Tag).options(orm.selectinload(Tag.communities)).where(Tag.id == tag_id)
    result = await session.execute(query)
    try:
        return TagSchema.model_validate(result.scalar_one())
    except:
        raise HTTPException(status_code=404, detail="Tag not found")



# # Function to create a new tag
# async def create_tag(session: AsyncSession, tag_data: TagSchema) -> TagSchema:
#     tag = Tag(**tag_data.dict())
#     session.add(tag)
#     await session.commit()
#     await session.refresh(tag)
#     return TagSchema.from_orm(tag)
#
# # Function to update an existing tag
# async def update_tag(session: AsyncSession, tag_id: UUID, tag_data: TagSchema) -> TagSchema:
#     tag = await get_tag(session, tag_id)
#     for key, value in tag_data.dict().items():
#         setattr(tag, key, value)
#     await session.commit()
#     await session.refresh(tag)
#     return TagSchema.from_orm(tag)
#
# # Function to delete a tag
# async def delete_tag(session: AsyncSession, tag_id: UUID):
#     tag = await get_tag(session, tag_id)
#     session.delete(tag)
#     await session.commit()