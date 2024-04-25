from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.schedulers.blocking import BlockingScheduler
import pytz
from datetime import datetime

from sqlalchemy import select
from models.user import User
from crud.users import get_user_list
from sqlalchemy.ext.asyncio import AsyncSession
from crud.community import get_user_community_association

from datetime import UTC


scheduler = AsyncIOScheduler()

async def weekly_reset(session: AsyncSession):
    users = await get_user_list(session)
    for user in users:
        for user_community in user.communities:
            if user_community.current_days < user_community.goal_days:
                user_community.streak = 0
            else:
                user.xp += 5 * user_community.goal_days
            user_community.current_days = 0
    await session.commit()

            
