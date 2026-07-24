from pydantic import BaseModel


class LinkedInProfile(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    company: str | None = None


class LinkedInWebhook(BaseModel):
    """
    Payload received from the
    LinkFlow Chrome Extension.

    MVP supports:

    - Connection Accepted
    - Comment Created
    """

    event: str

    author: str | None = None

    comment: str | None = None

    keyword: str | None = None

    profile_url: str | None = None

    post_url: str | None = None

    linkedin_profile: LinkedInProfile | None = None