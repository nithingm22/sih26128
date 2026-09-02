import 'package:flutter/material.dart';

import '../models/report.dart';

class AdvisoryScreen extends StatelessWidget {
  final RiskResult result;

  const AdvisoryScreen({super.key, required this.result});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Advisory')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Recommended Actions',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 12),
          ...result.advisories.asMap().entries.map(
            (entry) => Card(
              child: ListTile(
                leading: CircleAvatar(child: Text('${entry.key + 1}')),
                title: Text(entry.value),
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Note: This assessment is for decision support and does not replace professional veterinary diagnosis.',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
