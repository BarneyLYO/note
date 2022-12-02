import 'dart:web_gl';

const myAge = 32;
var averageAge = 32;
const testNumber = 111;
const evenOdd = testNumber % 2;

void main(List<String> args) {
  if (args.length < 1) {
    throw new Exception("at least 1 arg should provided");
  }
  final age = int.parse(args[0]);
  print('avg age: for $myAge, $age, ${(averageAge + age) / 2}');
}
