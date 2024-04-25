from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.schedulers.blocking import BlockingScheduler
import pytz
from datetime import datetime

from sqlalchemy import select
from models.user import User
from crud.users import get_user_list
from sqlalchemy.ext.asyncio import AsyncSession
from crud.community import get_user_community_association
from models.user_community_association import UserCommunityAssociation
from schemas.user_community_association import UserCommunityAssociationSchema








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
                user_community.season_xp += 5 * user_community.goal_days
            user_community.current_days = 0
    await session.commit()

            

async def season_reset(session: AsyncSession):
    users = await get_user_list(session)
    for user in users:
        for user_community in user.communities:
            user_community.season_xp = 0
    await session.commit()


async def promoted_users(user_community: list[UserCommunityAssociationSchema]):
    user_community.sort(key=lambda x: x.season_xp, reverse=True)
    promoted_users = user_community[:len(user_community) * 0.3]
    
    for user in promoted_users:
        if user.tier == 'Earth':
            user.tier = 'Mars'
        elif user.tier == 'Mars':
            user.tier = 'Jupiter'

    demoted_users = user_community[len(user_community) * 0.8:]
    for user in demoted_users:
        if user.tier == 'Jupiter':
            user.tier = 'Mars'
        elif user.tier == 'Mars':
            user.tier = 'Earth'