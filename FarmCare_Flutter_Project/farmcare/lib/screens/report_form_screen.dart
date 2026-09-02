import 'package:flutter/material.dart';

import '../models/animal.dart';
import '../models/report.dart';
import '../services/api_service.dart';
import '../services/db_helper.dart';
import 'result_screen.dart';

class ReportFormScreen extends StatefulWidget {
  final Animal animal;

  const ReportFormScreen({super.key, required this.animal});

  @override
  State<ReportFormScreen> createState() => _ReportFormScreenState();
}

class _ReportFormScreenState extends State<ReportFormScreen> {
  final List<String> _symptomOptions = const [
    'Fever',
    'Cough',
    'Loss of Appetite',
    'Diarrhea',
    'Nasal Discharge',
    'Difficulty Breathing',
    'Weakness',
    'Swelling',
    'Limping',
    'Skin Lesions',
  ];

  final Set<String> _selectedSymptoms = {};
  final _durationController = TextEditingController();
  final _notesController = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _durationController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final duration = int.tryParse(_durationController.text.trim());
    if (_selectedSymptoms.isEmpty || duration == null || duration < 1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Select symptoms and enter a valid duration.'),
        ),
      );
      return;
    }

    setState(() => _submitting = true);

    final report = HealthReport(
      animalId: widget.animal.id,
      symptoms: _selectedSymptoms.toList(),
      durationDays: duration,
      notes: _notesController.text.trim(),
      createdAt: DateTime.now(),
    );

    try {
      final result = await ApiService().submitReport(report);
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => ResultScreen(
            animal: widget.animal,
            report: report,
            result: result,
          ),
        ),
      );
    } catch (_) {
      await DbHelper.instance.insertReport(report);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Saved offline. It will sync when connection returns.'),
        ),
      );
      Navigator.pop(context);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Health Report • ${widget.animal.id}')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            '${widget.animal.species}, ${widget.animal.age} years',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 16),
          Text(
            'Select Symptoms',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          ..._symptomOptions.map(
            (symptom) => CheckboxListTile(
              value: _selectedSymptoms.contains(symptom),
              title: Text(symptom),
              onChanged: (selected) {
                setState(() {
                  if (selected == true) {
                    _selectedSymptoms.add(symptom);
                  } else {
                    _selectedSymptoms.remove(symptom);
                  }
                });
              },
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _durationController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Duration of symptoms (days)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _notesController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Additional notes (optional)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: _submitting ? null : _submit,
            icon: const Icon(Icons.send),
            label: Text(
              _submitting ? 'Submitting...' : 'Submit Health Report',
            ),
          ),
        ],
      ),
    );
  }
}
