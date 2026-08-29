import json
import os


def load_knowledge_base():
    path = os.path.join(os.path.dirname(__file__), "knowledge_base.json")
    with open(path) as f:
        return json.load(f)["diseases"]


def score_report(species, symptoms, breed=None, age=None):
    diseases = load_knowledge_base()
    results = []

    for disease in diseases:
        if species not in disease["species"]:
            continue

        weights = disease["symptom_weights"]
        total_possible = sum(weights.values())

        matched = {
            s: w
            for s, w in weights.items()
            if s in symptoms
        }

        matched_score = sum(matched.values())

        if matched_score == 0:
            continue

        risk_percent = round(
            (matched_score / total_possible) * 100,
            1
        )

        contributing = sorted(
            matched.items(),
            key=lambda x: -x[1]
        )

        results.append({
            "name": disease["name"],
            "risk_percent": risk_percent,
            "contributing_symptoms": [
                {
                    "symptom": s,
                    "weight": w
                }
                for s, w in contributing
            ],
            "breed_note": (
                disease["breed_note"]
                if disease["breed_relevant"]
                else "No reliable breed-specific difference is being used in this assessment."
            ),
            "age_note": (
                disease["age_note"]
                if disease["age_relevant"]
                else "Age is not significantly changing this assessment."
            )
        })

    results.sort(
        key=lambda x: -x["risk_percent"]
    )

    return results[:3]