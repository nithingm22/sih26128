import 'dart:convert';

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import '../models/report.dart';

class DbHelper {
  DbHelper._();
  static final DbHelper instance = DbHelper._();

  Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;

    final path = join(await getDatabasesPath(), 'farmcare.db');
    _database = await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE pending_reports(
            local_id INTEGER PRIMARY KEY AUTOINCREMENT,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL
          )
        ''');
      },
    );

    return _database!;
  }

  Future<int> insertReport(HealthReport report) async {
    final db = await database;
    return db.insert('pending_reports', {
      'payload': jsonEncode(report.toJson()),
      'created_at': report.createdAt.toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> readPendingReports() async {
    final db = await database;
    return db.query('pending_reports', orderBy: 'local_id ASC');
  }

  Future<void> deleteReport(int localId) async {
    final db = await database;
    await db.delete(
      'pending_reports',
      where: 'local_id = ?',
      whereArgs: [localId],
    );
  }
}
