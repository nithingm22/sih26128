class HealthReport {
  final String? id;
  final String animalId;
  final List<String> symptoms;
  final int durationDays;
  final String notes;
  final DateTime createdAt;

  const HealthReport({
    this.id,
    required this.animalId,
    required this.symptoms,
    required this.durationDays,
    this.notes = '',
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'animal_id': animalId,
        'symptoms': symptoms,
        'duration_days': durationDays,
        'notes': notes,
        'created_at': createdAt.toIso8601String(),
      };

  factory HealthReport.fromJson(Map<String, dynamic> json) {
    final rawSymptoms = json['symptoms'];
    final symptoms = rawSymptoms is List
        ? rawSymptoms.map((item) => item.toString()).toList()
        : <String>[];

    return HealthReport(
      id: json['id']?.toString(),
      animalId: json['animal_id']?.toString() ?? '',
      symptoms: symptoms,
      durationDays:
          int.tryParse(json['duration_days']?.toString() ?? '0') ?? 0,
      notes: json['notes']?.toString() ?? '',
      createdAt: DateTime.tryParse(
            json['created_at']?.toString() ?? '',
          ) ??
          DateTime.now(),
    );
  }
}

class RiskResult {
  final String riskLevel;
  final List<String> possibleConditions;
  final double confidence;
  final List<String> advisories;
  final String reportId;

  const RiskResult({
    required this.riskLevel,
    required this.possibleConditions,
    required this.confidence,
    required this.advisories,
    required this.reportId,
  });

  factory RiskResult.fromJson(Map<String, dynamic> json) {
    return RiskResult(
      riskLevel: json['risk_level']?.toString() ?? 'UNKNOWN',
      possibleConditions:
          (json['possible_conditions'] as List? ?? [])
              .map((e) => e.toString())
              .toList(),
      confidence:
          double.tryParse(json['confidence']?.toString() ?? '0') ?? 0,
      advisories:
          (json['advisories'] as List? ?? [])
              .map((e) => e.toString())
              .toList(),
      reportId: json['report_id']?.toString() ?? '',
    );
  }
}
