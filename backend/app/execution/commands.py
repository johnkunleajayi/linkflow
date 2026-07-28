from enum import Enum

from pydantic import BaseModel


class CommandType(str, Enum):
    """
    All commands that an extension
    can execute.

    As LinkFlow grows, simply add
    more command types here.
    """

    REPLY = "reply"


class Command(BaseModel):
    """
    A command sent from the backend
    to a client (Chrome Extension,
    Desktop App, Mobile App, etc.).
    """

    type: CommandType
    text: str