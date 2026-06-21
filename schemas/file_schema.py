from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, UTC


class FileResponse(BaseModel):

    id: int
    filename: str
    filepath: str
    file_type: str
    uploaded_at: datetime
    user_id: str


class FileListResponse(BaseModel):

    files: List[FileResponse]
