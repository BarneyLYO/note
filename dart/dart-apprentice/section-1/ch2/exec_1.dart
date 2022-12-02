import 'dart:math' as math;

void main(List<String> args) {
  if (args.length < 1) {
    throw Exception("You must passing a number as degress");
  }
  final double degree = double.parse(args[0]);
  print(_getDegree(degree));
}

double _getDegree(double degree) {
  return (degree * (180 / math.pi));
}
