# Intro

- callback

```java

@FunctionalInterface
public interface Fetcher {
  void fetchData(FetchCallback callback);
}

public interface FetchCallback {
  void onData(Data data);
  void onError(Throwable cause);
}

public class Worker {
  public void doWork () {
    Fetcher fetcher = cb -> {
      try{
        cb.onData(doFetch());
      }
      catch(Exception e) {
        cb.onError(e);
      }
    };

    fetcher.fetchData(new FetchCallback(){
      @Override
      public void onData(Data d) {

      }
      @Override
      public void onError(Throwable cause) {

      }
    });
  }
}
```

- future
  > Future is an abstraction, which represents a value that may become available at some point. A Future Object either holds the result of a computation or, in the case of a failed computation, an eception.

> Futures and promises are pretty similar concepts, the difference is that a future is a read-only container for a result that does not yet exist, while a promise can be written (normally only once)

```java
@FunctionalInterface
public interface Fetcher {
  Future<Object> fetchData();
}

private static final ExecutorService SERVICE = Executors.newSingleThreadExecutor();

public class Worker {
  public void doWork() {
    Fetcher fetcher = () -> SERVICE.submit(() -> new Random().nextInt());
  }
}

```
