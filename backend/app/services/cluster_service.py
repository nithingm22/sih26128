from datetime import datetime, timedelta, timezone
from math import radians, sin, cos, sqrt, atan2
from typing import List

from sqlalchemy.orm import Session

from app.db.models import Report, Cluster, Case

EARTH_RADIUS_KM = 6371.0
RADIUS_KM = 5.0
WINDOW_DAYS = 7
MIN_CASES = 4


def haversine_km(lat1, lng1, lat2, lng2) -> float:
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlng / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return EARTH_RADIUS_KM * c


def _top_disease(report: Report):
    if report.ranked_diseases:
        return report.ranked_diseases[0]["name"]
    return None


def detect_and_store_clusters(db: Session) -> List[Cluster]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=WINDOW_DAYS)
    recent_reports = (
        db.query(Report)
        .filter(Report.created_at >= cutoff)
        .filter(Report.ranked_diseases.isnot(None))
        .all()
    )

    by_disease = {}
    for r in recent_reports:
        disease = _top_disease(r)
        if not disease:
            continue
        by_disease.setdefault(disease, []).append(r)

    new_clusters = []

    for disease, reports in by_disease.items():
        unvisited = list(reports)
        while unvisited:
            seed = unvisited.pop(0)
            group = [seed]
            remaining = []
            for other in unvisited:
                if haversine_km(seed.lat, seed.lng, other.lat, other.lng) <= RADIUS_KM:
                    group.append(other)
                else:
                    remaining.append(other)
            unvisited = remaining

            if len(group) >= MIN_CASES:
                case_ids = sorted(
                    c.id for c in
                    db.query(Case).filter(Case.report_id.in_([r.id for r in group])).all()
                )

                already_exists = any(
                    existing.disease_name == disease and sorted(existing.case_ids) == case_ids
                    for existing in db.query(Cluster).filter(Cluster.disease_name == disease).all()
                )
                if already_exists:
                    continue

                center_lat = sum(r.lat for r in group) / len(group)
                center_lng = sum(r.lng for r in group) / len(group)

                cluster = Cluster(
                    disease_name=disease,
                    case_ids=case_ids,
                    center_lat=center_lat,
                    center_lng=center_lng,
                    radius_km=RADIUS_KM,
                    window_days=WINDOW_DAYS,
                )
                db.add(cluster)
                new_clusters.append(cluster)

    if new_clusters:
        db.commit()
        for c in new_clusters:
            db.refresh(c)

    return new_clusters