"""
Rule-based risk scoring engine. No training data required.
"""
import json
import os
from typing import List, Optional

_KB_PATH = os.path.join(os.path.dirname(__file__), "knowledge_base.json")

with open(_KB_PATH, "r") as f:
    _KNOWLEDGE_BASE = json.load(f)["diseases"]

_NEUTRAL_BREED_NOTE = "No reliable breed-specific difference is being used in this assessment."
_NEUTRAL_AGE_NOTE = "No reliable age-specific difference is being used in this assessment."


def score_report(
    species: str,
    symptoms: List[str],
    breed: Optional[str] = None,
    age: Optional[int] = None,
    top_n: int = 3,
) -> dict:
    species = (species or "").lower().strip()
    reported = {s.lower().strip() for s in symptoms}

    scored = []
    for disease in _KNOWLEDGE_BASE:
        if species and species not in [s.lower() for s in disease["species"]]:
            continue

        weights = disease["symptom_weights"]
        total_weight = sum(weights.values())
        if total_weight == 0:
            continue

        matched = {sym: w for sym, w in weights.items() if sym in reported}
        matched_weight = sum(matched.values())
        raw_score = matched_weight / total_weight

        contributing = [
            {"symptom": sym, "weight": w}
            for sym, w in sorted(matched.items(), key=lambda kv: kv[1], reverse=True)
        ]

        scored.append({
            "name": disease["name"],
            "raw_score": raw_score,
            "contributing_symptoms": contributing,
            "breed_relevant": disease.get("breed_relevant", False),
            "breed_note": disease.get("breed_note", _NEUTRAL_BREED_NOTE),
            "age_relevant": disease.get("age_relevant", False),
            "age_note": disease.get("age_note", _NEUTRAL_AGE_NOTE),
        })

    scored.sort(key=lambda d: d["raw_score"], reverse=True)
    top = scored[:top_n]

    ranked_diseases = [
        {
            "name": d["name"],
            "risk_percent": round(d["raw_score"] * 100, 1),
            "contributing_symptoms": d["contributing_symptoms"],
        }
        for d in top
        if d["raw_score"] > 0
    ]

    if not ranked_diseases:
        return {
            "ranked_diseases": [],
            "breed_note": _NEUTRAL_BREED_NOTE,
            "age_note": _NEUTRAL_AGE_NOTE,
        }

    top_disease = top[0]
    breed_note = top_disease["breed_note"] if (top_disease["breed_relevant"] and breed) else _NEUTRAL_BREED_NOTE
    age_note = top_disease["age_note"] if (top_disease["age_relevant"] and age is not None) else _NEUTRAL_AGE_NOTE

    return {
        "ranked_diseases": ranked_diseases,
        "breed_note": breed_note,
        "age_note": age_note,
    }