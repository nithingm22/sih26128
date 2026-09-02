import 'package:flutter/foundation.dart';

import '../models/animal.dart';

class AppProvider extends ChangeNotifier {
  final List<Animal> _animals = [];

  List<Animal> get animals => List.unmodifiable(_animals);

  void setAnimals(List<Animal> animals) {
    _animals
      ..clear()
      ..addAll(animals);
    notifyListeners();
  }

  void addAnimal(Animal animal) {
    _animals.add(animal);
    notifyListeners();
  }
}
