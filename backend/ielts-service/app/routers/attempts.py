import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.ielts import (
    AttemptStatus,
    Result,
    Test,
    UserAnswer,
    UserTestAttempt,
)
from app.schemas.ielts import (
    StartAttemptResponse,
    SubmitAttemptRequest,
    ResultOut,
)

router = APIRouter(prefix="/ielts/attempts", tags=["ielts-attempts"])


@router.post("/{test_id}/start", response_model=StartAttemptResponse)
async def start_attempt(
    test_id: int,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):

    test = await db.execute(
        select(Test)
        .options(selectinload(Test.questions))
        .where(Test.id == test_id, Test.is_published.is_(True))
    )
    test = test.scalar_one_or_none()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    existing = await db.execute(
        select(UserTestAttempt).where(
            UserTestAttempt.user_id == user.user_id,
            UserTestAttempt.test_id == test_id,
            UserTestAttempt.status == AttemptStatus.IN_PROGRESS,
        )
    )
    attempt = existing.scalar_one_or_none()

    if attempt is None:
        attempt = UserTestAttempt(
            user_id=user.user_id,
            test_id=test_id,
            session_token=secrets.token_urlsafe(32),
        )
        db.add(attempt)
        await db.commit()
        await db.refresh(attempt)

    return StartAttemptResponse(
        attempt_id=attempt.id,
        session_token=attempt.session_token,
        started_at=attempt.started_at,
        test=test,
    )


@router.post("/{attempt_id}/submit", response_model=ResultOut)
async def submit_attempt(
    attempt_id: int,
    payload: SubmitAttemptRequest,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    attempt = await db.get(
        UserTestAttempt,
        attempt_id,
        options=[selectinload(UserTestAttempt.result)],
    )
    if not attempt or attempt.user_id != user.user_id:
        raise HTTPException(status_code=404, detail="Attempt not found")

    if attempt.status != AttemptStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Attempt already finalized")

    if payload.session_token != attempt.session_token:
        # Per TZ: mismatched session = someone tried to continue on another
        # device/tab. Disqualify rather than silently accept the submit.
        attempt.status = AttemptStatus.DISQUALIFIED
        await db.commit()
        raise HTTPException(
            status_code=409,
            detail="Session mismatch — test was opened elsewhere and has been disqualified",
        )

    test = await db.execute(
        select(Test).options(selectinload(Test.questions)).where(Test.id == attempt.test_id)
    )
    test = test.scalar_one()

    correct_answer_by_question = {
        q.id: next((a.id for a in q.answers if a.is_correct), None) for q in test.questions
    }

    correct_count = 0
    incorrect_count = 0

    for ans in payload.answers:
        db.add(
            UserAnswer(
                attempt_id=attempt.id,
                question_id=ans.question_id,
                selected_answer_id=ans.selected_answer_id,
                free_text=ans.free_text,
            )
        )
        expected = correct_answer_by_question.get(ans.question_id)
        if expected is None:
            continue  # writing/speaking or unscored question
        if ans.selected_answer_id == expected:
            correct_count += 1
        else:
            incorrect_count += 1

    total_scored = correct_count + incorrect_count
    percent = round((correct_count / total_scored) * 100, 2) if total_scored else 0.0
    band_score = round((percent / 100) * 9, 1)  # naive raw-score -> band mapping for v1

    duration_seconds = int(
        (datetime.now(timezone.utc) - attempt.started_at).total_seconds()
    )

    result = Result(
        attempt_id=attempt.id,
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        percent=percent,
        band_score=band_score,
        duration_seconds=duration_seconds,
    )
    db.add(result)

    attempt.status = AttemptStatus.SUBMITTED
    attempt.submitted_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(result)

    return result
