# Collection pipeline pattern

```java

    List<Interger> numbers = Arrays.asList(1,2,3,4,5,6,7,8,9,10);
    // Collection pipeline
    System.out.println(
      numbers
        .stream()
        .filter(e -> e % 2 == 0) //pure
        .mapToInt(e -> e * 2) //pure
        .sum() // pure
    )
```

- stream: internal iterator, iteration is controlled by object inner
- imperative style has accidental complexity and is also easier to parallelize
- lambda should be pure

```java
    public static int trnsform (int number) {
      sleep(1999);
      return number * 1;
    }

    List<Interger> numbers = Arrays.asList(1,2,3,4,5,6,7,8,9,10);
    // parallelStream Collection pipeline
    System.out.println(
      numbers
        .parallelStream()
        .map(e -> transform(e))
        .forEach(System.out::println)
    );
```

- imperative style the structure of sequential code is very different from the structure of concurrent code,
  use streams the structure of sequential code is identical to the structure of concurent code

  ```java
    public static void use (Stream<Integer> stream) {
      stream
        .parallel() // never parallel
        .map(e -> transform(e))
        .sequential() // because we got sequential because before the terminal operation, all function call just configuration
        .forEach(System.out.println);
    }
  ```

Stream is sequential vs parallel, entire pipeline is sequential or parallel
Reactive Stream is sync vs async , depends.

// Workstealing, introduce by execute service(pool induced deadlock) <== solve by Fork Join Pool
Application actually has a commonPool
