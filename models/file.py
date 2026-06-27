from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone


class File(SQLModel, table=True):

    id: Optional[int] = Field(primary_key=True, default=None)
    filename: str
    filepath: str
    file_type: str
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: int = Field(foreign_key="user.id")
