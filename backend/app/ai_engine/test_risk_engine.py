from risk_engine import score_report
from advisory_engine import get_advisory


test_report = {
    "species": "cattle",
    "symptoms": ["fever", "mouth_lesions", "appetite_loss"]
}


results = score_report(
    test_report["species"],
    test_report["symptoms"]
)


for r in results:
    print(r["name"], r["risk_percent"], "%")
    print(" because:", r["contributing_symptoms"])

    advisory = get_advisory(
        r["name"],
        r["risk_percent"]
    )

    print(" advisory:", advisory)