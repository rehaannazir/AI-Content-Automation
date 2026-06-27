from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr
from datetime import datetime, timezone

class Generation(SQLModel, table=True):

    id : Optional[int] = Field (primary_key=True, default=None)
    prompt : str
    result : str
    generation_type : str
    created_at : datetime = Field(default_factory= lambda : datetime.now(timezone.utc))
    user_id : int = Field(foreign_key="user.id")