from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.ielts import AttemptStatus, IeltsSection


# ---------- Tests (list / detail) ----------

class TestSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    duration_minutes: int


class AnswerOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    label: str
    text: str
    # is_correct is intentionally excluded — never leak the key while a
    # test is in progress.


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    section: IeltsSection
    order_index: int
    prompt: str
    image_url: str | None
    answers: list[AnswerOptionOut]


class TestDetail(TestSummary):
    questions: list[QuestionOut]


# ---------- Starting / taking an attempt ----------

class StartAttemptResponse(BaseModel):
    attempt_id: int
    session_token: str
    started_at: datetime
    test: TestDetail


class AnswerSubmission(BaseModel):
    question_id: int
    selected_answer_id: int | None = None
    free_text: str | None = None


class SubmitAttemptRequest(BaseModel):
    session_token: str
    answers: list[AnswerSubmission]


# ---------- Results ----------

class ResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    attempt_id: int
    correct_count: int
    incorrect_count: int
    percent: float
    band_score: float
    duration_seconds: int
    created_at: datetime


class ResultHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    attempt_id: int
    test_title: str
    status: AttemptStatus
    percent: float
    band_score: float
    submitted_at: datetime | None
