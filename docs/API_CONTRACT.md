# SIH26128 API Contract — LOCKED at Hour 0, do not change without posting in group chat

## Core entities

User        { id, name, phone, role: "farmer"|"vet"|"admin", password_hash }
Animal      { id, owner_id, name, species, breed, age, vaccination_status: "up_to_date"|"overdue"|"unknown" }
Report      { id, animal_id, symptoms: [string], duration_days, other_animals_affected: bool,
              lat, lng, created_at, synced: bool }
RiskResult  { report_id, ranked_diseases: [{ name, risk_percent, contributing_symptoms: [{symptom, weight}] }],
              breed_note, age_note }
Advisory    { report_id, immediate_care: [string], prevention: [string], vet_urgency: "low"|"medium"|"high",
              avoid: [string] }
Case        { id, report_id, status: "reported"|"ai_assessed"|"vet_review"|"field_visit"|"lab_pending"|
              "confirmed"|"negative"|"inconclusive"|"closed", assigned_vet_id, lab_result }
Cluster     { id, disease_name, case_ids: [int], center_lat, center_lng, radius_km, window_days, created_at }

## Core endpoints (v1)

POST   /auth/login              -> { token, role, user_id }
GET    /animals?owner_id=X      -> [Animal]
POST   /animals                 -> Animal
POST   /reports                 -> creates Report, calls risk engine + advisory engine,
                                    returns { report, risk_result, advisory }
GET    /reports/{id}            -> { report, risk_result, advisory, case }
GET    /cases?status=X          -> [Case]
PATCH  /cases/{id}              -> update status / assign vet / add lab_result
GET    /clusters                -> [Cluster]
GET    /dashboard/summary       -> { total_cases, by_status, active_clusters }

## Rules
- No field name changes without posting in the group chat first
- Symptom names must match exactly between Mobile, AI engine, and Backend (e.g. `appetite_loss`, not "Appetite Loss")
- This file is finalized together at Hour 0 — this is a DRAFT until then