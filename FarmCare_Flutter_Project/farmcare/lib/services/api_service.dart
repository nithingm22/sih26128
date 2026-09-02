import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/animal.dart';
import '../models/report.dart';

class ApiService {
  // Set this to false and configure baseUrl when the real backend is ready.
  static const bool useMockApi = true;
  static const String baseUrl = 'http://192.168.1.X:8000';

  static final List<Animal> _mockAnimals = [
    const Animal(id: 'A001', species: 'Cow', age: 4),
    const Animal(id: 'A002', species: 'Goat', age: 2),
    const Animal(id: 'A003', species: 'Buffalo', age: 5),
  ];

  Future<List<Animal>> getAnimals(int ownerId) async {
    if (useMockApi) {
      await Future.delayed(const Duration(milliseconds: 500));
      return List.of(_mockAnimals);
    }

    final response = await http.get(
      Uri.parse('$baseUrl/animals?owner_id=$ownerId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data
          .map((item) => Animal.fromJson(item as Map<String, dynamic>))
          .toList();
    }

    throw Exception('Failed to load animals');
  }

  Future<void> addAnimal(Animal animal) async {
    if (useMockApi) {
      _mockAnimals.add(animal);
      return;
    }

    final response = await http.post(
      Uri.parse('$baseUrl/animals'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(animal.toJson()),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to add animal');
    }
  }

  Future<RiskResult> submitReport(HealthReport report) async {
    if (useMockApi) {
      await Future.delayed(const Duration(seconds: 1));
      return _generateMockResult(report);
    }

    final response = await http.post(
      Uri.parse('$baseUrl/reports'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(report.toJson()),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return RiskResult.fromJson(
        jsonDecode(response.body) as Map<String, dynamic>,
      );
    }

    throw Exception('Failed to submit report');
  }

  Future<Map<String, dynamic>> getReportStatus(String reportId) async {
    if (useMockApi) {
      await Future.delayed(const Duration(milliseconds: 500));
      return {
        'report_id': reportId,
        'status': 'Under Review',
        'steps': [
          {'title': 'Report Submitted', 'complete': true},
          {'title': 'Health Analysis', 'complete': true},
          {'title': 'Veterinary Review', 'complete': false},
          {'title': 'Follow-up', 'complete': false},
          {'title': 'Case Closed', 'complete': false},
        ],
      };
    }

    final response = await http.get(
      Uri.parse('$baseUrl/reports/$reportId'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }

    throw Exception('Failed to load case status');
  }

  RiskResult _generateMockResult(HealthReport report) {
    final symptoms = report.symptoms.map((e) => e.toLowerCase()).toList();

    String risk = 'LOW';
    final conditions = <String>['General health observation'];
    final advice = <String>[
      'Continue monitoring the animal.',
      'Provide clean water and appropriate feed.',
    ];

    if (symptoms.contains('fever') || symptoms.contains('difficulty breathing')) {
      risk = 'HIGH';
      conditions
        ..clear()
        ..addAll(['Respiratory infection', 'Possible systemic infection']);
      advice
        ..clear()
        ..addAll([
          'Isolate the animal from the rest of the herd.',
          'Contact a qualified veterinarian as soon as possible.',
          'Monitor temperature and breathing closely.',
        ]);
    } else if (symptoms.contains('diarrhea') ||
        symptoms.contains('loss of appetite') ||
        symptoms.contains('weakness')) {
      risk = 'MEDIUM';
      conditions
        ..clear()
        ..addAll(['Digestive disorder', 'Possible infection or dehydration']);
      advice
        ..clear()
        ..addAll([
          'Ensure the animal has access to clean water.',
          'Monitor food intake and hydration.',
          'Seek veterinary advice if symptoms continue or worsen.',
        ]);
    }

    return RiskResult(
      riskLevel: risk,
      possibleConditions: conditions,
      confidence: risk == 'HIGH' ? 0.86 : risk == 'MEDIUM' ? 0.74 : 0.61,
      advisories: advice,
      reportId: 'R${DateTime.now().millisecondsSinceEpoch}',
    );
  }
}
