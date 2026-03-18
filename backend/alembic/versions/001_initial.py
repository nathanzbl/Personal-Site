"""Initial schema

Revision ID: 001_initial
Revises:
Create Date: 2026-03-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("project_id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("year", sa.String(), nullable=False),
        sa.Column("color", sa.String(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("live", "wip", "archived", name="projectstatus"),
            nullable=False,
        ),
        sa.Column("link", sa.String(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_projects_id", "projects", ["id"], unique=False)
    op.create_index("ix_projects_project_id", "projects", ["project_id"], unique=True)

    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_skills_id", "skills", ["id"], unique=False)

    op.create_table(
        "experience",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("year", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subtitle", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_experience_id", "experience", ["id"], unique=False)

    op.create_table(
        "about",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("bio_paragraphs", sa.JSON(), nullable=False),
        sa.Column("facts", sa.JSON(), nullable=False),
        sa.Column("headshot_url", sa.String(), nullable=True),
        sa.Column("status_text", sa.String(), nullable=True),
        sa.Column("info_fields", sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "interests",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("icon", sa.String(), nullable=False),
        sa.Column("label", sa.String(), nullable=False),
        sa.Column("desc", sa.Text(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_interests_id", "interests", ["id"], unique=False)

    op.create_table(
        "coursework",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_coursework_id", "coursework", ["id"], unique=False)

    op.create_table(
        "socials",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("icon", sa.String(), nullable=False),
        sa.Column("label", sa.String(), nullable=False),
        sa.Column("handle", sa.String(), nullable=False),
        sa.Column("href", sa.String(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_socials_id", "socials", ["id"], unique=False)

    op.create_table(
        "contact_meta",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("heading", sa.String(), nullable=False),
        sa.Column("subheading", sa.String(), nullable=False),
        sa.Column("body_text", sa.Text(), nullable=False),
        sa.Column("location_text", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("contact_meta")
    op.drop_index("ix_socials_id", table_name="socials")
    op.drop_table("socials")
    op.drop_index("ix_coursework_id", table_name="coursework")
    op.drop_table("coursework")
    op.drop_index("ix_interests_id", table_name="interests")
    op.drop_table("interests")
    op.drop_table("about")
    op.drop_index("ix_experience_id", table_name="experience")
    op.drop_table("experience")
    op.drop_index("ix_skills_id", table_name="skills")
    op.drop_table("skills")
    op.drop_index("ix_projects_project_id", table_name="projects")
    op.drop_index("ix_projects_id", table_name="projects")
    op.drop_table("projects")
    op.execute("DROP TYPE projectstatus")
