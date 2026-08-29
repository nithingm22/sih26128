from typing import List
from datetime import datetime
from pydantic import BaseModel


class ClusterOut(BaseModel):
    id: int
    disease_name: str
    case_ids: List[int]
    center_lat: float
    center_lng: float
    radius_km: float
    window_days: int
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    total_cases: int
    by_status: dict
    active_clusters: int