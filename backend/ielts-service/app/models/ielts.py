import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class IeltsSection(str, enum.Enum):
    LISTENING = "listening"
    READING = "reading"
    WRITING = "writing"
    SPEAKING = "speaking"


class AttemptStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    DISQUALIFIED = "disqualified"


class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=150)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    questions: Mapped[list["Question"]] = relationship(back_populates="test", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id", ondelete="CASCADE"))
    section: Mapped[IeltsSection] = mapped_column(Enum(IeltsSection), nullable=False)

    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)

    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    points: Mapped[float] = mapped_column(Float, default=1.0)

    test: Mapped["Test"] = relationship(back_populates="questions")
    answers: Mapped[list["AnswerOption"]] = relationship(
        back_populates="question", cascade="all, delete-orphan"
    )


class AnswerOption(Base):
    """A, B, C, D style option for a question. For Writing, this is unused
    (free-text answers are stored directly on UserAnswer.free_text)."""

    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"))

    label: Mapped[str] = mapped_column(String(8), nullable=False)  # "A", "B", "C", "D"
    text: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)

    question: Mapped["Question"] = relationship(back_populates="answers")


class UserTestAttempt(Base):
    """One user's attempt at one test. Enforces single-device / anti-cheat
    rules from the TZ: only one IN_PROGRESS attempt per user per test."""

    __tablename__ = "user_tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"))

    status: Mapped[AttemptStatus] = mapped_column(
        Enum(AttemptStatus), default=AttemptStatus.IN_PROGRESS
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Set once and checked on every request, per TZ single-device rule.
    session_token: Mapped[str] = mapped_column(String(64), nullable=False)

    user_answers: Mapped[list["UserAnswer"]] = relationship(
        back_populates="attempt", cascade="all, delete-orphan"
    )
    result: Mapped["Result"] = relationship(back_populates="attempt", uselist=False)


class UserAnswer(Base):
    """A single answer submitted within an attempt."""

    __tablename__ = "user_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey("user_tests.id", ondelete="CASCADE"))
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"))

    selected_answer_id: Mapped[int | None] = mapped_column(
        ForeignKey("answers.id"), nullable=True
    )
    free_text: Mapped[str | None] = mapped_column(Text, nullable=True)  # for Writing

    attempt: Mapped["UserTestAttempt"] = relationship(back_populates="user_answers")


class Result(Base):
    """Final computed result for a submitted attempt."""

    __tablename__ = "results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey("user_tests.id"), unique=True)

    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    incorrect_count: Mapped[int] = mapped_column(Integer, default=0)
    percent: Mapped[float] = mapped_column(Float, default=0.0)
    band_score: Mapped[float] = mapped_column(Float, default=0.0)  # IELTS-style 0-9 band
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    attempt: Mapped["UserTestAttempt"] = relationship(back_populates="result")
