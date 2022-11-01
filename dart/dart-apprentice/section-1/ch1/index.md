# Dart Section 1

## dark sdk

### analyze, code analyze

### compile: code compiler, AOT compiler

### create

create new dart project
commands:
-template

### fix: upgrade the project with older dart version to a new one

### format: format

### migrate: pre-2.12 => post-2.12

### pub: package manager of dart. from pub.dev

### run: run in dart virtual machine(JIT dev).

## Run dart

```sh
dart run hello.dart
```

```dart
void main() {
  print('Hello, Dart!);
}
```

## create dart project

```sh
dart create hello_dart_project
```

## project structure

### bin

Contains the executable Dart code.

### analysis_options.yaml

Holds special rules that will hlp you detect issue with your code, linting

### CHANGELOG.md

Holds a manually-curated md list of the latest update your project

### pubspec.yaml

list of 3rd party pub dependencies you want to use in your project.

### lib

folder holds the actual dart code

### test

folder holds the test code

## learned

```dart
void main(List<String> arguments) {
  print(arguments); // if xxx 1 2 3, => arguments = [1,2,3]
}
```
