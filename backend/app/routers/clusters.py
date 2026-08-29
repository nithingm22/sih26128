from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.db.models import Cluster, Case
from app.schemas.cluster import ClusterOut, DashboardSummary
from app.core.deps import get_current_user

router = APIRouter(tags=["clusters"])


@router.get("/clusters", response_model=List[ClusterOut])
def list_clusters(
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return db.query(Cluster).order_by(Cluster.created_at.desc()).all()


@router.get("/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    total_cases = db.query(Case).count()
    status_rows = db.query(Case.status, func.count(Case.id)).group_by(Case.status).all()
    by_status = {status_name: count for status_name, count in status_rows}
    active_clusters = db.query(Cluster).count()

    return DashboardSummary(
        total_cases=total_cases,
        by_status=by_status,
        active_clusters=active_clusters,
    )