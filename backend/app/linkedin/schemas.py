from pydantic import BaseModel


class LinkedInProfile(BaseModel):
    first_name: str
    last_name: str
    email: str
    company: str


class LinkedInWebhook(BaseModel):
    event: str
    linkedin_profile: LinkedInProfile