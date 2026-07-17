from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.ielts import UserTestAttempt
from app.schemas.ielts import ResultHistoryItem

router = APIRouter(prefix="/ielts/results", tags=["ielts-results"])


@router.get("/history", response_model=list[ResultHistoryItem])
async def result_history(
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Per TZ 'Natijalar tarixi' — every attempt this user has made,
    newest first, for the Profil / results-history screen."""
    rows = await db.execute(
        select(UserTestAttempt)
        .options(selectinload(UserTestAttempt.result), selectinload(UserTestAttempt.test))
        .where(UserTestAttempt.user_id == user.user_id)
        .order_by(UserTestAttempt.started_at.desc())
    )
    attempts = rows.scalars().all()

    history = []
    for a in attempts:
        history.append(
            ResultHistoryItem(
                attempt_id=a.id,
                test_title=a.test.title,
                status=a.status,
                percent=a.result.percent if a.result else 0.0,
                band_score=a.result.band_score if a.result else 0.0,
                submitted_at=a.submitted_at,
            )
        )
    return history
