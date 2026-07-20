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

    #
    # Salesforce OAuth
    #

    SALESFORCE_CLIENT_ID = os.getenv(
        "SALESFORCE_CLIENT_ID",
        ""
    )

    SALESFORCE_CLIENT_SECRET = os.getenv(
        "SALESFORCE_CLIENT_SECRET",
        ""
    )

    SALESFORCE_REDIRECT_URI = os.getenv(
        "SALESFORCE_REDIRECT_URI",
        "http://localhost:8000/oauth/salesforce/callback"
    )

    SALESFORCE_LOGIN_URL = os.getenv(
        "SALESFORCE_LOGIN_URL",
        "https://login.salesforce.com"
    )

    #
    # LinkedIn OAuth
    #

    LINKEDIN_CLIENT_ID = os.getenv(
        "LINKEDIN_CLIENT_ID",
        ""
    )

    LINKEDIN_CLIENT_SECRET = os.getenv(
        "LINKEDIN_CLIENT_SECRET",
        ""
    )

    LINKEDIN_REDIRECT_URI = os.getenv(
        "LINKEDIN_REDIRECT_URI",
        "http://localhost:8000/oauth/linkedin/callback"
    )

    LINKEDIN_AUTHORIZATION_URL = (
        "https://www.linkedin.com/oauth/v2/authorization"
    )

    LINKEDIN_ACCESS_TOKEN_URL = (
        "https://www.linkedin.com/oauth/v2/accessToken"
    )


settings = Settings()