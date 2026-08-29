from typing import Optional
from pydantic import BaseModel

VALID_STATUSES = [
    "reported", "ai_assessed", "vet_review", "field_visit",
    "lab_pending", "confirmed", "negative", "inconclusive", "closed",
]


class CaseOut(BaseModel):
    id: int
    report_id: int
    status: str
    assigned_vet_id: Optional[int] = None
    lab_result: Optional[str] = None

    class Config:
        from_attributes = True


class CaseUpdate(BaseModel):
    status: Optional[str] = None
    assigned_vet_id: Optional[int] = None
    lab_result: Optional[str] = None