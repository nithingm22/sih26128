import json
import os


def load_advisory_rules():
    path = os.path.join(os.path.dirname(__file__), "advisory_rules.json")
    with open(path) as f:
        return json.load(f)


def risk_band(risk_percent):
    if risk_percent >= 70:
        return "high"
    elif risk_percent >= 40:
        return "medium"
    return "low"


def get_advisory(disease_name, risk_percent):
    rules = load_advisory_rules()
    band = risk_band(risk_percent)

    disease_rules = rules.get(disease_name, {})

    return disease_rules.get(band, {
        "immediate_care": ["Monitor the animal closely"],
        "prevention": ["Maintain normal hygiene practices"],
        "vet_urgency": "low",
        "avoid": []
    })