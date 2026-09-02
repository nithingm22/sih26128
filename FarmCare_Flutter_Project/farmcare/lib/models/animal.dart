class Animal {
  final String id;
  final String species;
  final int age;

  const Animal({
    required this.id,
    required this.species,
    required this.age,
  });

  factory Animal.fromJson(Map<String, dynamic> json) {
    return Animal(
      id: json['id'].toString(),
      species: json['species']?.toString() ?? 'Unknown',
      age: int.tryParse(json['age'].toString()) ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'species': species,
        'age': age,
      };
}
