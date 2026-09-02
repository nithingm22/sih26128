import 'package:flutter/material.dart';

import '../services/api_service.dart';

class CaseStatusScreen extends StatefulWidget {
  final String reportId;

  const CaseStatusScreen({super.key, required this.reportId});

  @override
  State<CaseStatusScreen> createState() => _CaseStatusScreenState();
}

class _CaseStatusScreenState extends State<CaseStatusScreen> {
  late Future<Map<String, dynamic>> _statusFuture;

  @override
  void initState() {
    super.initState();
    _statusFuture = ApiService().getReportStatus(widget.reportId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Case Status')),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _statusFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError || !snapshot.hasData) {
            return const Center(child: Text('Unable to load case status.'));
          }

          final data = snapshot.data!;
          final steps = (data['steps'] as List? ?? [])
              .cast<Map<String, dynamic>>();

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                'Report: ${data['report_id']}',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Chip(label: Text(data['status']?.toString() ?? 'Unknown')),
              const SizedBox(height: 20),
              ...steps.map(
                (step) {
                  final complete = step['complete'] == true;
                  return ListTile(
                    leading: Icon(
                      complete
                          ? Icons.check_circle
                          : Icons.radio_button_unchecked,
                      color: complete ? Colors.green : null,
                    ),
                    title: Text(step['title']?.toString() ?? ''),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}
