from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    APP_NAME = "LinkFlow API"
    APP_VERSION = "1.0.0"

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./linkflow.db"
    )

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "change-this-in-production"
    )

    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

settings = Settings()