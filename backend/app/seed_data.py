from datetime import datetime, timezone

from app.db.database import Base, engine, SessionLocal
from app.db.models import User, Animal, Report, Case
from app.core.security import hash_password
from app.ai_engine import risk_engine, advisory_engine
from app.services.cluster_service import detect_and_store_clusters

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Data already seeded. Skipping.")
            return

        farmer1 = User(name="Kumar", phone="9000000001", role="farmer", password_hash=hash_password("password123"))
        farmer2 = User(name="Meena", phone="9000000002", role="farmer", password_hash=hash_password("password123"))
        farmer3 = User(name="Raja", phone="9000000003", role="farmer", password_hash=hash_password("password123"))
        vet = User(name="Dr. Priya", phone="9000000099", role="vet", password_hash=hash_password("password123"))
        admin = User(name="Admin", phone="9000000000", role="admin", password_hash=hash_password("password123"))
        db.add_all([farmer1, farmer2, farmer3, vet, admin])
        db.commit()

        cow1 = Animal(owner_id=farmer1.id, name="Lakshmi", species="cattle", breed="Jersey", age=4, vaccination_status="up_to_date")
        cow2 = Animal(owner_id=farmer2.id, name="Ganga", species="cattle", breed="Jersey", age=3, vaccination_status="overdue")
        cow3 = Animal(owner_id=farmer3.id, name="Yamuna", species="cattle", breed="Local", age=5, vaccination_status="unknown")
        goat1 = Animal(owner_id=farmer1.id, name="Raja Goat", species="goat", breed="Local", age=2, vaccination_status="up_to_date")
        db.add_all([cow1, cow2, cow3, goat1])
        db.commit()

        def make_report(animal, symptoms, lat, lng, duration_days=3, other_affected=False):
            report = Report(
                animal_id=animal.id, symptoms=symptoms, duration_days=duration_days,
                other_animals_affected=other_affected, lat=lat, lng=lng,
                created_at=datetime.now(timezone.utc), synced=True,
            )
            db.add(report)
            db.commit()
            db.refresh(report)

            risk = risk_engine.score_report(species=animal.species, symptoms=symptoms, breed=animal.breed, age=animal.age)
            top_disease = risk["ranked_diseases"][0]["name"] if risk["ranked_diseases"] else None
            top_pct = risk["ranked_diseases"][0]["risk_percent"] if risk["ranked_diseases"] else 0.0
            advisory = advisory_engine.get_advisory(top_disease, top_pct) if top_disease else advisory_engine.get_advisory("default", 0.0)

            report.ranked_diseases = risk["ranked_diseases"]
            report.breed_note = risk["breed_note"]
            report.age_note = risk["age_note"]
            report.immediate_care = advisory["immediate_care"]
            report.prevention = advisory["prevention"]
            report.vet_urgency = advisory["vet_urgency"]
            report.avoid = advisory["avoid"]
            db.commit()

            case = Case(report_id=report.id, status="ai_assessed")
            db.add(case)
            db.commit()
            return report

        base_lat, base_lng = 11.4102, 76.6950
        fmd_symptoms = ["fever", "mouth_lesions", "lameness", "excess_salivation"]

        make_report(cow1, fmd_symptoms, base_lat + 0.005, base_lng + 0.004)
        make_report(cow2, fmd_symptoms, base_lat + 0.010, base_lng - 0.006)
        make_report(cow3, fmd_symptoms, base_lat - 0.008, base_lng + 0.009)
        make_report(cow1, fmd_symptoms, base_lat + 0.002, base_lng - 0.002, other_affected=True)
        make_report(goat1, ["appetite_loss"], base_lat + 0.5, base_lng + 0.5)

        clusters = detect_and_store_clusters(db)
        print(f"Seeded users, animals, and reports. Detected {len(clusters)} cluster(s).")

    finally:
        db.close()


if __name__ == "__main__":
    seed()