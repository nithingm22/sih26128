import 'package:flutter/material.dart';

import '../models/animal.dart';
import '../models/report.dart';
import 'advisory_screen.dart';
import 'case_status_screen.dart';

class ResultScreen extends StatelessWidget {
  final Animal animal;
  final HealthReport report;
  final RiskResult result;

  const ResultScreen({
    super.key,
    required this.animal,
    required this.report,
    required this.result,
  });

  Color _riskColor(BuildContext context) {
    switch (result.riskLevel.toUpperCase()) {
      case 'HIGH':
        return Colors.red;
      case 'MEDIUM':
        return Colors.orange;
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final riskColor = _riskColor(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Health Assessment')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Text('Risk Level'),
                  const SizedBox(height: 8),
                  Text(
                    result.riskLevel,
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          color: riskColor,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Confidence: ${(result.confidence * 100).toStringAsFixed(0)}%',
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Possible Conditions',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          ...result.possibleConditions.map(
            (condition) => Card(
              child: ListTile(
                leading: const Icon(Icons.medical_services_outlined),
                title: Text(condition),
              ),
            ),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => AdvisoryScreen(result: result),
                ),
              );
            },
            child: const Text('View Advisory'),
          ),
          const SizedBox(height: 10),
          OutlinedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CaseStatusScreen(
                    reportId: result.reportId,
                  ),
                ),
              );
            },
            child: const Text('View Case Status'),
          ),
        ],
      ),
    );
  }
}
