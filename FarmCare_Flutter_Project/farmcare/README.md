# FarmCare

FarmCare is a Flutter mobile application for livestock health reporting.

## Features
- Demo login
- Animal list and registration
- Symptom-based health report
- Mock AI health assessment
- Risk level and possible condition results
- Advisory screen
- Case status tracking
- SQLite storage for reports submitted while offline
- Sync service prepared for future backend integration

## Run in Android Studio
1. Extract this project.
2. Open the `farmcare` folder in Android Studio.
3. Run `flutter pub get`.
4. Start an Android emulator or connect a phone.
5. Run the app.

## Backend integration
Open `lib/services/api_service.dart`.
Change:

```dart
static const bool useMockApi = true;
```

to `false` when the backend is available and set `baseUrl`.

The API service is structured around:
- GET /animals?owner_id={id}
- POST /reports
- GET /reports/{id}
