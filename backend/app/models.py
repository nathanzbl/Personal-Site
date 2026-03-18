import enum
from sqlalchemy import Column, Integer, String, Boolean, JSON, Text, Enum as SAEnum
from app.database import Base


class ProjectStatus(str, enum.Enum):
    live = "live"
    wip = "wip"
    archived = "archived"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tags = Column(JSON, nullable=False, default=list)
    year = Column(String, nullable=False)
    color = Column(String, nullable=False)
    status = Column(SAEnum(ProjectStatus, name="projectstatus"), nullable=False)
    link = Column(String, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    level = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, autoincrement=True)
    year = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    active = Column(Boolean, nullable=False, default=False)
    sort_order = Column(Integer, nullable=False, default=0)


class About(Base):
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, default=1)
    bio_paragraphs = Column(JSON, nullable=False, default=list)
    facts = Column(JSON, nullable=False, default=list)
    headshot_url = Column(String, nullable=True)
    status_text = Column(String, nullable=True)
    info_fields = Column(JSON, nullable=False, default=list)


class Interest(Base):
    __tablename__ = "interests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    icon = Column(String, nullable=False)
    label = Column(String, nullable=False)
    desc = Column(Text, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class Coursework(Base):
    __tablename__ = "coursework"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class Social(Base):
    __tablename__ = "socials"

    id = Column(Integer, primary_key=True, autoincrement=True)
    icon = Column(String, nullable=False)
    label = Column(String, nullable=False)
    handle = Column(String, nullable=False)
    href = Column(String, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class ContactMeta(Base):
    __tablename__ = "contact_meta"

    id = Column(Integer, primary_key=True, default=1)
    heading = Column(String, nullable=False)
    subheading = Column(String, nullable=False)
    body_text = Column(Text, nullable=False)
    location_text = Column(String, nullable=False)
