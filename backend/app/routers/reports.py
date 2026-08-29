from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Report, Animal, Case
from app.schemas.report import (
    ReportCreate, ReportOut, ReportSubmitResponse, ReportDetailResponse,
    RiskResult, Advisory,
)
from app.core.deps import get_current_user
from app.ai_engine import risk_engine, advisory_engine
from app.services.cluster_service import detect_and_store_clusters

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("", response_model=ReportSubmitResponse, status_code=status.HTTP_201_CREATED)
def submit_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    animal = db.query(Animal).filter(Animal.id == payload.animal_id).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Animal not found")

    report = Report(
        animal_id=payload.animal_id,
        symptoms=payload.symptoms or [],
        duration_days=payload.duration_days,
        other_animals_affected=payload.other_animals_affected,
        lat=payload.lat,
        lng=payload.lng,
        synced=payload.synced,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    risk = risk_engine.score_report(
        species=animal.species,
        symptoms=payload.symptoms or [],
        breed=animal.breed,
        age=animal.age,
    )

    top_disease = risk["ranked_diseases"][0]["name"] if risk["ranked_diseases"] else None
    top_risk_percent = risk["ranked_diseases"][0]["risk_percent"] if risk["ranked_diseases"] else 0.0

    advisory = advisory_engine.get_advisory(top_disease, top_risk_percent) if top_disease else advisory_engine.get_advisory("default", 0.0)

    report.ranked_diseases = risk["ranked_diseases"]
    report.breed_note = risk["breed_note"]
    report.age_note = risk["age_note"]
    report.immediate_care = advisory["immediate_care"]
    report.prevention = advisory["prevention"]
    report.vet_urgency = advisory["vet_urgency"]
    report.avoid = advisory["avoid"]
    db.commit()
    db.refresh(report)

    case = Case(report_id=report.id, status="ai_assessed")
    db.add(case)
    db.commit()

    detect_and_store_clusters(db)

    return ReportSubmitResponse(
        report=ReportOut.model_validate(report),
        risk_result=RiskResult(
            report_id=report.id,
            ranked_diseases=report.ranked_diseases,
            breed_note=report.breed_note,
            age_note=report.age_note,
        ),
        advisory=Advisory(
            report_id=report.id,
            immediate_care=report.immediate_care,
            vet_urgency=report.vet_urgency,
            prevention=report.prevention,
            avoid=report.avoid,
        ),
    )


@router.get("/{report_id}", response_model=ReportDetailResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    case = db.query(Case).filter(Case.report_id == report_id).first()
    case_dict = {
        "id": case.id,
        "status": case.status,
        "assigned_vet_id": case.assigned_vet_id,
        "lab_result": case.lab_result,
    } if case else None

    return ReportDetailResponse(
        report=ReportOut.model_validate(report),
        risk_result=RiskResult(
            report_id=report.id,
            ranked_diseases=report.ranked_diseases or [],
            breed_note=report.breed_note or "",
            age_note=report.age_note or "",
        ),
        advisory=Advisory(
            report_id=report.id,
            immediate_care=report.immediate_care or [],
            vet_urgency=report.vet_urgency or "low",
            prevention=report.prevention or [],
            avoid=report.avoid or [],
        ),
        case=case_dict,
    )