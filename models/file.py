from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr
from datetime import datetime, UTC


class File(SQLModel, table=True):

    id: Optional[int] = Field(primary_key=True, default=None)
    filename: str
    filepath: str
    file_type: str
    uploaded_at: datetime = Field(default=datetime.now(UTC))
    user_id: str = Field(foreign_key="user.id")
