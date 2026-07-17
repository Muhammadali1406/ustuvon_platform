from fastapi import FastAPI

from app.core.config import settings
from app.routers import attempts, results, tests

app = FastAPI(title="Ustuvon - IELTS Service")

app.include_router(tests.router)
app.include_router(attempts.router)
app.include_router(results.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.service_name}
