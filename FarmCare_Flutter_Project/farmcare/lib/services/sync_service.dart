import 'dart:convert';

import 'package:connectivity_plus/connectivity_plus.dart';

import '../models/report.dart';
import 'api_service.dart';
import 'db_helper.dart';

class SyncService {
  final DbHelper _dbHelper = DbHelper.instance;
  final ApiService _apiService = ApiService();

  Future<void> syncPendingReports() async {
    if (ApiService.useMockApi) return;

    final connectivity = await Connectivity().checkConnectivity();
    if (connectivity.contains(ConnectivityResult.none)) return;

    final rows = await _dbHelper.readPendingReports();

    for (final row in rows) {
      try {
        final payload = jsonDecode(row['payload'] as String)
            as Map<String, dynamic>;
        await _apiService.submitReport(HealthReport.fromJson(payload));
        await _dbHelper.deleteReport(row['local_id'] as int);
      } catch (_) {
        // Keep the report locally and try again later.
      }
    }
  }
}
