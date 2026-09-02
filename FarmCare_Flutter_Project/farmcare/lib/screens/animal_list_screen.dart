import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/animal.dart';
import '../providers/app_provider.dart';
import '../services/api_service.dart';
import 'animal_registration_screen.dart';
import 'report_form_screen.dart';

class AnimalListScreen extends StatefulWidget {
  final String farmerName;

  const AnimalListScreen({super.key, required this.farmerName});

  @override
  State<AnimalListScreen> createState() => _AnimalListScreenState();
}

class _AnimalListScreenState extends State<AnimalListScreen> {
  final ApiService _apiService = ApiService();
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadAnimals();
  }

  Future<void> _loadAnimals() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final animals = await _apiService.getAnimals(1);
      if (!mounted) return;
      context.read<AppProvider>().setAnimals(animals);
    } catch (e) {
      _error = e.toString();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final animals = context.watch<AppProvider>().animals;

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${widget.farmerName}'),
        actions: [
          IconButton(
            onPressed: _loadAnimals,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const AnimalRegistrationScreen(),
            ),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('Add Animal'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : animals.isEmpty
                  ? const Center(child: Text('No animals available.'))
                  : RefreshIndicator(
                      onRefresh: _loadAnimals,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: animals.length,
                        itemBuilder: (_, index) {
                          final Animal animal = animals[index];
                          return Card(
                            child: ListTile(
                              leading: const CircleAvatar(
                                child: Icon(Icons.pets),
                              ),
                              title: Text('${animal.species} • ${animal.id}'),
                              subtitle: Text('Age: ${animal.age} years'),
                              trailing: const Icon(Icons.chevron_right),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        ReportFormScreen(animal: animal),
                                  ),
                                );
                              },
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
