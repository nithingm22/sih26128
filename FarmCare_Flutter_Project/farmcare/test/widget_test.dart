import 'package:flutter_test/flutter_test.dart';

import 'package:farmcare/main.dart';

void main() {
  testWidgets('FarmCare starts', (WidgetTester tester) async {
    await tester.pumpWidget(const FarmCareApp());
    expect(find.text('FarmCare'), findsOneWidget);
  });
}
