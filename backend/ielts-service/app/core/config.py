from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    service_name: str = "ielts-service"

    database_url: str = "postgresql+asyncpg://ustuvon:ustuvon@localhost:5432/ielts_db"

    # Auth service issues the JWT on login; this service only verifies it.
    auth_service_url: str = "http://auth-service:8000"
    jwt_secret_key: str = "changeme"
    jwt_algorithm: str = "HS256"
    single_device_enforced: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
