# CompletionHandler

The common interface for handle the Async operation

```java
public interface CompletionHandler<V,A> {
    void completed(V result, A attachment);
    void failed(Throwable exc, A attachment);
}

```
