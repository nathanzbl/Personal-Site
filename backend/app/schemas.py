from enum import Enum
from typing import List, Optional
from pydantic import BaseModel


class ProjectStatus(str, Enum):
    live = "live"
    wip = "wip"
    archived = "archived"


# ── Projects ──────────────────────────────────────────────────────────────────

class ProjectBase(BaseModel):
    project_id: str
    title: str
    description: str
    tags: List[str]
    year: str
    color: str
    status: ProjectStatus
    link: Optional[str] = None
    sort_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    year: Optional[str] = None
    color: Optional[str] = None
    status: Optional[ProjectStatus] = None
    link: Optional[str] = None
    sort_order: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: int

    model_config = {"from_attributes": True}


# ── Skills ────────────────────────────────────────────────────────────────────

class SkillBase(BaseModel):
    name: str
    level: int
    category: str
    sort_order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None


class SkillResponse(SkillBase):
    id: int

    model_config = {"from_attributes": True}


# ── Experience ────────────────────────────────────────────────────────────────

class ExperienceBase(BaseModel):
    year: str
    title: str
    subtitle: str
    description: str
    active: bool = False
    sort_order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    year: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = None
    sort_order: Optional[int] = None


class ExperienceResponse(ExperienceBase):
    id: int

    model_config = {"from_attributes": True}


# ── About ─────────────────────────────────────────────────────────────────────

class FactItem(BaseModel):
    icon: str
    text: str


class InfoField(BaseModel):
    label: str
    value: str


class AboutBase(BaseModel):
    bio_paragraphs: List[str]
    facts: List[FactItem]
    headshot_url: Optional[str] = None
    status_text: Optional[str] = None
    info_fields: List[InfoField]


class AboutUpdate(BaseModel):
    bio_paragraphs: Optional[List[str]] = None
    facts: Optional[List[FactItem]] = None
    headshot_url: Optional[str] = None
    status_text: Optional[str] = None
    info_fields: Optional[List[InfoField]] = None


class AboutResponse(AboutBase):
    id: int

    model_config = {"from_attributes": True}


# ── Interests ─────────────────────────────────────────────────────────────────

class InterestBase(BaseModel):
    icon: str
    label: str
    desc: str
    sort_order: int = 0


class InterestCreate(InterestBase):
    pass


class InterestUpdate(BaseModel):
    icon: Optional[str] = None
    label: Optional[str] = None
    desc: Optional[str] = None
    sort_order: Optional[int] = None


class InterestResponse(InterestBase):
    id: int

    model_config = {"from_attributes": True}


# ── Coursework ────────────────────────────────────────────────────────────────

class CourseworkBase(BaseModel):
    name: str
    sort_order: int = 0


class CourseworkCreate(CourseworkBase):
    pass


class CourseworkUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None


class CourseworkResponse(CourseworkBase):
    id: int

    model_config = {"from_attributes": True}


# ── Socials ───────────────────────────────────────────────────────────────────

class SocialBase(BaseModel):
    icon: str
    label: str
    handle: str
    href: str
    sort_order: int = 0


class SocialCreate(SocialBase):
    pass


class SocialUpdate(BaseModel):
    icon: Optional[str] = None
    label: Optional[str] = None
    handle: Optional[str] = None
    href: Optional[str] = None
    sort_order: Optional[int] = None


class SocialResponse(SocialBase):
    id: int

    model_config = {"from_attributes": True}


# ── Contact Meta ──────────────────────────────────────────────────────────────

class ContactMetaBase(BaseModel):
    heading: str
    subheading: str
    body_text: str
    location_text: str


class ContactMetaUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    body_text: Optional[str] = None
    location_text: Optional[str] = None


class ContactMetaResponse(ContactMetaBase):
    id: int

    model_config = {"from_attributes": True}
