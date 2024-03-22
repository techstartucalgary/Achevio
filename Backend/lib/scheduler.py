from apscheduler.schedulers.asyncio import AsyncIOScheduler
import pytz
from datetime import datetime

from sqlalchemy import select
from models.user import User
from crud.users import get_all_users, get_all_timezones, get_user_ids_for_timezone
from sqlalchemy.ext.asyncio import AsyncSession


scheduler = AsyncIOScheduler()



async def weekly_reset(session: AsyncSession):
    users = await get_all_users(session)
    for user in users:
        user.post_count = 0
    await session.commit()