# IELTS Service

FastAPI microservice for the IELTS module of Ustuvon Test Platform.
Owner: Abdulaziz.

Implements, per the group's TZ (`docs/TZ.md` in the root repo):
- listing published IELTS tests
- starting an attempt (with anti-cheat session token — one active
  attempt per user per test; a session-token mismatch on submit
  disqualifies the attempt, matching the "bitta qurilmadan foydalanish"
  rule)
- submitting answers and auto-grading Listening/Reading (Writing/Speaking
  are stored as free text for later review — not auto-scored in v1)
- results history for the Profil / "Natijalar tarixi" screen

## Endpoints

| Method | Path                              | Description                          |
|--------|------------------------------------|---------------------------------------|
| GET    | /health                            | Liveness check                        |
| GET    | /ielts/tests/                      | List published tests                  |
| GET    | /ielts/tests/{test_id}             | Test summary (title, duration)        |
| POST   | /ielts/attempts/{test_id}/start    | Start or resume an attempt            |
| POST   | /ielts/attempts/{attempt_id}/submit| Submit answers, get graded result     |
| GET    | /ielts/results/history             | This user's past attempts             |

All routes except `/health` require `Authorization: Bearer <JWT>` issued
by auth-service. `JWT_SECRET_KEY` here **must match** auth-service's `SECRET_KEY` so
tokens verify without a network round-trip.

## Run locally

```bash
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# make sure Postgres is running and matches DATABASE_URL, then:
alembic revision --autogenerate -m "init ielts tables"
alembic upgrade head

uvicorn app.main:app --reload --port 8001
```

## Run via Docker (once wired into the root docker-compose.yml)

```bash
docker compose up ielts-service ielts-db
```

## Tests

```bash
pytest
```

## Not yet implemented (next PRs)

- Admin endpoints for creating tests/questions (bulk upload + AI-assisted
  formatting per TZ — will likely live in a separate admin-facing router
  once the admin panel's contract is agreed).
- Real IELTS band-score conversion table (current mapping is a naive
  linear placeholder — `percent / 100 * 9`).
- Certificate issuance hook after a passing result.
