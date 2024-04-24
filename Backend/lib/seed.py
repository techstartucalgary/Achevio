from models.tag import Tag
from models.user import User
from models.community import Community
from models.user_community_association import UserCommunityAssociation
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .hasher import ph
from uuid_extensions import uuid7

async def seed_data(session: AsyncSession):
    running_tag = Tag(
        name = "Running",
        color = "#E53935"  # Deep red
    )

    swimming_tag = Tag(
        name = "Swimming",
        color = "#1E88E5"  # Ocean blue
    )

    cycling_tag = Tag(
        name = "Cycling",
        color = "#FB8C00"  # Bright orange
    )

    guitar_tag = Tag(
        name = "Guitar",
        color = "#6F42C1"  # Purple
    )

    piano_tag = Tag(
        name = "Piano",
        color = "#00ACC1"  # Teal
    )

    cooking_tag = Tag(
        name = "Cooking",
        color = "#7CB342"  # Light green
    )

    hiking_tag = Tag(
        name = "Hiking",
        color = "#8E24AA"  # Plum
    )

    reading_tag = Tag(
        name = "Reading",
        color = "#FDD835"  # Sunflower yellow
    )

    soccer_tag = Tag(
        name = "Soccer",
        color = "#D81B60"  # Pink
    )

    basketball_tag = Tag(
        name = "Basketball",
        color = "#8D6E63"  # Brown
    )

    golf_tag = Tag(
        name = "Golf",
        color = "#43A047"  # Golf green
    )

    surfing_tag = Tag(
        name = "Surfing",
        color = "#00BFA5"  # Sea green
    )

    skateboarding_tag = Tag(
        name = "Skateboarding",
        color = "#FFB300"  # Amber
    )

    singing_tag = Tag(
        name = "Singing",
        color = "#E91E63"  # Magenta
    )

    dancing_tag = Tag(
        name = "Dancing",
        color = "#C0CA33"  # Lime green
    )

    painting_tag = Tag(
        name = "Painting",
        color = "#00897B"  # Teal green
    )

    drawing_tag = Tag(
        name = "Drawing",
        color = "#3949AB"  # Indigo
    )

    violin_tag = Tag(
        name = "Violin",
        color = "#F4511E"  # Burnt orange
    )

    sculpting_tag = Tag(
        name = "Sculpting",
        color = "#546E7A"  # Blue grey
    )

    photography_tag = Tag(
        name = "Photography",
        color = "#5E35B1"  # Deep purple
    )


    baking_tag = Tag(
        name = "Baking",
        color = "#D84315"  # Pumpkin
    )

    sewing_tag = Tag(
        name = "Sewing",
        color = "#757575"  # Grey
    )

    studying_tag = Tag(
        name = "Studying",
        color = "#2E7D32"  # Forest green
    )

    gardening_tag = Tag(
        name = "Gardening",
        color = "#F9A825"  # Mustard yellow
    )

    meditation_tag = Tag(
        name = "Meditation",
        color = "#80DEEA"  # Light blue
    )

    yoga_tag = Tag(
        name = "Yoga",
        color = "#AD1457"  # Wine
    )

    gaming_tag = Tag(
        name = "Gaming",
        color = "#FFD600"  # Yellow
    )

    session.add_all([
        running_tag,
        swimming_tag,
        cycling_tag,
        guitar_tag,
        piano_tag,
        cooking_tag,
        hiking_tag,
        reading_tag,
        soccer_tag,
        basketball_tag,
        golf_tag,
        surfing_tag,
        skateboarding_tag,
        singing_tag,
        dancing_tag,
        painting_tag,
        drawing_tag,
        violin_tag,
        sculpting_tag,
        photography_tag,
        baking_tag,
        sewing_tag,
        studying_tag,
        gardening_tag,
        meditation_tag,
        yoga_tag,
        gaming_tag
    ])


    user1 = User(
        id = uuid7(),
        username = "magdy",
        first_name = "Magdy",
        last_name = "Hafez",
        email = "magdy.hafez@email.com",
        password = ph.hash("1234"),
        communities = [],
        posts = []
    )

    user2 = User(
        id = uuid7(),
        username = "jane.doe",
        first_name = "Jane",
        last_name = "Doe",
        email = "jane.doe@email.com",
        password = ph.hash("password"),
        communities = [],
        posts = []
    )

    user3 = User(
        id = uuid7(),
        username = "pupper0n1",
        first_name = "W",
        last_name = "Elbouni",
        email = "w.elbouni@email.com",
        password = ph.hash("password"),
        communities = [],
        posts = []
    )

    user4 = User(
        id = uuid7(),
        username = "string",
        first_name = "Test",
        last_name = "User",
        email = "test.user@email.com",
        password = ph.hash("string"),
        communities = [],
        posts = []
    )

    session.add_all([
        user1,
        user2,
        user3,
        user4
    ])


    
    paint_pals = Community(
        id = "065c587d-262b-7e89-8000-3eaa64cc768c",
        name = "Paint Pals",
        description = "A community for artists and art enthusiasts to share their work and collaborate on projects.",
        public = True,
        users = [],
        tags = [drawing_tag, painting_tag]
    )

    fitness_fanatics = Community(
        id = uuid7(),
        name = "Fitness Fanatics",
        description = "A community for fitness enthusiasts to share workout routines and progress.",
        public = True,
        users = [],
        tags = [running_tag, swimming_tag, cycling_tag]
    )

    guitar_club = Community(
        id = uuid7(),
        name = "Guitar Club",
        description = "A community for guitarists to share music and tips.",
        public = True,
        users = [],
        tags = [guitar_tag]
    )

    cooking_corner = Community(
        id = uuid7(),
        name = "Cooking Corner",
        description = "A community for foodies to share recipes and cooking techniques.",
        public = True,
        users = [],
        tags = [cooking_tag]
    )

    hiking_club = Community(
        id = uuid7(),
        name = "Hiking Club",
        description = "A community for hikers to share trails and experiences.",
        public = True,
        users = [],
        tags = [hiking_tag]
    )


    session.add_all([paint_pals, fitness_fanatics, guitar_club, cooking_corner, hiking_club])


    user_1_paintpals = UserCommunityAssociation(
        user_id = user1.id,
        community_id = paint_pals.id,
        role = "admin",
        community_name = paint_pals.name,
        current_days = 4,
        goal_days = 4,
        streak = 400
    )

    user_2_paintpals = UserCommunityAssociation(
        user_id = user2.id,
        community_id = paint_pals.id,
        role = "member",
        community_name = paint_pals.name,
        current_days = 0,
        goal_days = 5
    )



    session.add_all([user_1_paintpals, user_2_paintpals])
    


    
# class Community(UUIDAuditBase):
#     __tablename__ = 'community_table'
    
#     name: Mapped[str] = mapped_column(String(100), unique=True)
#     description: Mapped[str] = mapped_column(String(100))
#     # owner_id: Mapped[UUID] = mapped_column(UUID, nullable=False)2

#     image: Mapped[str] = mapped_column(String(100))

#     users = relationship('UserCommunityAssociation', back_populates='community')

#     public: Mapped[bool] = mapped_column(Boolean, default=False)


#     tags: Mapped[list['Tag']] = relationship(
#         secondary=community_tag_association,
#         # lazy='selectin'
#     )

#     image: Mapped[str] = mapped_column(String(100), nullable=True)



# class UserCommunityAssociation(UUIDBase):
#     __tablename__ = 'user_community_association_table'
#     user_id = Column(UUID, ForeignKey('user_table.id'))
#     community_id = Column(UUID, ForeignKey('community_table.id'))

#     role = Column(String)
#     community_name = Column(String)
    
#     current_nb_of_days = Column(Integer)
#     goal_nb_of_days = Column(Integer)
#     streak = Column(Integer, default=0)

#     community = relationship('Community', back_populates='users')
#     user = relationship('User', back_populates='communities')


#     __table_args__ = (
#         UniqueConstraint('user_id', 'community_id'),
#     )