from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.ielts import Test
from app.schemas.ielts import TestSummary

router = APIRouter(prefix="/ielts/tests", tags=["ielts-tests"])


@router.get("/", response_model=list[TestSummary])
async def list_tests(
    db: AsyncSession = Depends(get_db),
    _user: CurrentUser = Depends(get_current_user),
):
    """List published IELTS tests available to the user."""
    result = await db.execute(select(Test).where(Test.is_published.is_(True)))
    return result.scalars().all()


@router.get("/{test_id}", response_model=TestSummary)
async def get_test_summary(
    test_id: int,
    db: AsyncSession = Depends(get_db),
    _user: CurrentUser = Depends(get_current_user),
):
    """Basic info about a test (title, duration) before starting it.
    Full questions are only returned via POST /attempts/start, once the
    user has heard/read the rules, per TZ."""
    test = await db.get(Test, test_id)
    if not test or not test.is_published:
        raise HTTPException(status_code=404, detail="Test not found")
    return test
