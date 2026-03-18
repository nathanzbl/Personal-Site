from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models, schemas
from app.auth import require_auth

router = APIRouter(prefix="/contact", tags=["contact"])

SINGLETON_ID = 1


# ── Contact meta singleton ────────────────────────────────────────────────────

@router.get("", response_model=schemas.ContactMetaResponse)
async def get_contact_meta(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.ContactMeta).where(models.ContactMeta.id == SINGLETON_ID)
    )
    meta = result.scalar_one_or_none()
    if not meta:
        raise HTTPException(status_code=404, detail="Contact meta not found")
    return meta


@router.put("", response_model=schemas.ContactMetaResponse)
async def upsert_contact_meta(
    payload: schemas.ContactMetaUpdate, db: AsyncSession = Depends(get_db), _: None = Depends(require_auth)
):
    result = await db.execute(
        select(models.ContactMeta).where(models.ContactMeta.id == SINGLETON_ID)
    )
    meta = result.scalar_one_or_none()

    if meta is None:
        meta = models.ContactMeta(id=SINGLETON_ID)
        db.add(meta)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(meta, key, value)

    await db.commit()
    await db.refresh(meta)
    return meta


# ── Socials ───────────────────────────────────────────────────────────────────

@router.get("/socials", response_model=List[schemas.SocialResponse])
async def list_socials(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Social).order_by(models.Social.sort_order))
    return result.scalars().all()


@router.get("/socials/{social_id}", response_model=schemas.SocialResponse)
async def get_social(social_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Social).where(models.Social.id == social_id))
    social = result.scalar_one_or_none()
    if not social:
        raise HTTPException(status_code=404, detail="Social not found")
    return social


@router.post(
    "/socials", response_model=schemas.SocialResponse, status_code=status.HTTP_201_CREATED
)
async def create_social(payload: schemas.SocialCreate, db: AsyncSession = Depends(get_db), _: None = Depends(require_auth)):
    social = models.Social(**payload.model_dump())
    db.add(social)
    await db.commit()
    await db.refresh(social)
    return social


@router.put("/socials/{social_id}", response_model=schemas.SocialResponse)
async def update_social(
    social_id: int, payload: schemas.SocialUpdate, db: AsyncSession = Depends(get_db), _: None = Depends(require_auth)
):
    result = await db.execute(select(models.Social).where(models.Social.id == social_id))
    social = result.scalar_one_or_none()
    if not social:
        raise HTTPException(status_code=404, detail="Social not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(social, key, value)
    await db.commit()
    await db.refresh(social)
    return social


@router.delete("/socials/{social_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social(social_id: int, db: AsyncSession = Depends(get_db), _: None = Depends(require_auth)):
    result = await db.execute(select(models.Social).where(models.Social.id == social_id))
    social = result.scalar_one_or_none()
    if not social:
        raise HTTPException(status_code=404, detail="Social not found")
    await db.delete(social)
    await db.commit()
