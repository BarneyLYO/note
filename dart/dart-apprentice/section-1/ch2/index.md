# CH 2 Expression, variables, constants

## commenting

```dart
// simple comment
/*
  same as others
*/
/*
  /*
   nested allow, seem stupid
  */
*/
/// document comment

/**
 * another document comment
 */
```

## Statement and Expression

### Statement

command, tell computer to do.

```dart
print("xxxxxx"); // simple
if(something) { // complex
}
```

### Expression

dont do anything, just a value, or a way to get value

```dart
42
3 + 12
'asdasdasdasd'
x
```

### Operators

#### simple

```dart
1 + 1
2 - 2
3 * 3
3 / 3 // dart divide, double
3 ~/ 3 // dart divide, int
a = 2
```

~/ is called truncating division operator

#### complex

```dart
21 % 2 // reminder
(1 + 1) / 100
```

### Math functions

```dart
import 'dart:math' as math;
math.sin(
  45 * pi / 180
);
math.cos(
  134 * math.pi / 180
);
math.sqrt(2)
math.max(5,10)
math.min(-5,-10)
math.max(sqrt(2), math.pi / 2)
```

## EVENR value is an object in dart, dart dont have primitive vars

(int|double) extends num extends object

```dart
num myNumber;
myNumber = 10;
myNumber = 3.14;
myNumber = 121212;

dynamic aaa; // dynamic is like any
aaa = 10;
aaa = 'a';
```

### type inference

```dart
var a = 10; // a is a int
var b = 2.1; // b is a double
```

## Constants (immutable)

2 type:

### const

compile time immutable

```dart
const myConst = 10;
myConst = 111;// Constant variables can't be assigined a value
```

### final

runtime immutable, runtime constant

```dart
final startTime = DateTime.now();
```

### rule of thumb

try const first, if no, final
