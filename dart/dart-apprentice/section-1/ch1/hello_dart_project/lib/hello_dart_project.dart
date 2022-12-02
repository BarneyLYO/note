import 'dart:math' as math;

int calculate() {
  var a = math.Random().nextInt(1);
  var b = math.Random().nextInt(2);
  print('genetated $a, and $b');
  return a * b;
}
