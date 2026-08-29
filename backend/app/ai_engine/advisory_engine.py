import json
import os

_RULES_PATH = os.path.join(os.path.dirname(__file__), "advisory_rules.json")

with open(_RULES_PATH, "r") as f:
    _RULES = json.load(f)


def _risk_band(risk_percent: float) -> str:
    if risk_percent >= 60:
        return "high"
    if risk_percent >= 30:
        return "medium"
    return "low"


def get_advisory(top_disease: str, risk_percent: float) -> dict:
    band = _risk_band(risk_percent)
    disease_rules = _RULES.get(top_disease, _RULES["default"])
    entry = disease_rules.get(band, _RULES["default"][band])

    return {
        "immediate_care": entry["immediate_care"],
        "prevention": entry["prevention"],
        "vet_urgency": entry["vet_urgency"],
        "avoid": entry["avoid"],
    }