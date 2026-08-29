from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ReportCreate(BaseModel):
    animal_id: int
    symptoms: List[str]= Field(..., min_length=1)
    duration_days: Optional[int] = None
    other_animals_affected: bool = False
    lat: float
    lng: float
    synced: bool = True


class ContributingSymptom(BaseModel):
    symptom: str
    weight: float


class RankedDisease(BaseModel):
    name: str
    risk_percent: float
    contributing_symptoms: List[ContributingSymptom]


class RiskResult(BaseModel):
    report_id: int
    ranked_diseases: List[RankedDisease]
    breed_note: str
    age_note: str


class Advisory(BaseModel):
    report_id: int
    immediate_care: List[str]
    vet_urgency: str
    prevention: List[str]
    avoid: List[str]


class ReportOut(BaseModel):
    id: int
    animal_id: int
    symptoms: List[str]
    duration_days: Optional[int] = None
    other_animals_affected: bool
    lat: float
    lng: float
    created_at: datetime
    synced: bool

    class Config:
        from_attributes = True


class ReportSubmitResponse(BaseModel):
    report: ReportOut
    risk_result: RiskResult
    advisory: Advisory


class ReportDetailResponse(BaseModel):
    report: ReportOut
    risk_result: RiskResult
    advisory: Advisory
    case: Optional[dict] = None