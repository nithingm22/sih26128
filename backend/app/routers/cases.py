from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Case
from app.schemas.case import CaseOut, CaseUpdate, VALID_STATUSES
from app.core.deps import get_current_user, require_roles

router = APIRouter(prefix="/cases", tags=["cases"])


@router.get("", response_model=List[CaseOut])
def list_cases(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    query = db.query(Case)
    if status_filter:
        query = query.filter(Case.status == status_filter)
    return query.all()


@router.patch("/{case_id}", response_model=CaseOut)
def update_case(
    case_id: int,
    payload: CaseUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles("vet", "admin")),
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    if payload.status is not None:
        if payload.status not in VALID_STATUSES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status value")
        current_idx = VALID_STATUSES.index(case.status)
        new_idx = VALID_STATUSES.index(payload.status)
        if new_idx < current_idx:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot move status backward from '{case.status}' to '{payload.status}'",
            )
        case.status = payload.status

    if payload.assigned_vet_id is not None:
        case.assigned_vet_id = payload.assigned_vet_id

    if payload.lab_result is not None:
        case.lab_result = payload.lab_result

    db.commit()
    db.refresh(case)
    return case