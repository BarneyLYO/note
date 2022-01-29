# Channle Handler

> Handles an I/O Event or intercepts an I/O operation and forward it yo its next handler in its ChannelPipeline

## Methods

- ChannelHandler itself does not provide many methods, functionality are enriched by its subtype.

```java
  void handlerAdded (ChannelHandlerContext ctx)
```

Get called after the ChannelHandler was added to the actual context and its ready to handle events

```java
  void handlerRemoved(ChannelHandlerContext ctx)
```

Get called after the ChannelHandler was removed from the actual context and it doesnt handle events anymore

```java
  @Deprecated
  void exceptionCaught (ChannelHandlerContext ctx, Throwable)
```

Get called if a Throwable was thrown, Deprecated if you want to handle this event you should implement ChannelInboundHandler and implement the method there.

```java
@Inherited
@Documented
@Target(ElementType.Type)
@Retention(RetentionPolicy.RUNTIME)
@interface Sharable {}
```

Indicates that the same instance of the annotated ChannelHandler can be add to one or more ChannelPipeline multiple times without race condition.

## Subtyping

### ChannelInboundHandler

```java
void channelRegistered(ChannelHandlerContext ctx)
```

The Channel of the ChannelHandlerContext was registered with its EventLoop

```java
void channelUnregistered (ChannelHandlerContext ctx)
```

The Channel of the ChannelHandlerContext was unregistered from its EventLoop

```java
void channelActive(ChannelHandlerContext ctx)
```

The Channel of the ChannelHandlerContext is now active

```java
void channelInactive(ChannelHandlerContext ctx)
```

The Channel of the ChannelHandlerContext was registered is not inactive and reached its end of lifetime

```java
void channelRead(ChannelHandlerContext, Object msg)
```

Invoked when the current Channel has read a message from the peer

```java
void channelReadComplete (ChannelHandlerContext ctx)
```

Invoked when the last message read by the current read operation has been consumed by channelRead(ChannelHandlerContext, Object)

```java
void userEventTriggered (ChannelHandlerContext ctx, Object evt)
```

Gets called if an user event was triggered

```java
void channelWritabilityChanged (ChannelHandlerContext ctx)
```

GetsCalled once the writable state of a Channel changed

### ChannelOutboundHandler

```java
void bind (
  ChannelHandlerContext ctx,
  SocketAddress localAddress,
  ChannelPromise promise
)
```

Called once a bind operation is made,
Parames:

- ctx - the ChannelHandlerContext
- localAddress - the SocketAddress to which it should bound
- promise - the ChannelPromise to notify once the operation completes

```java
void connect (
  ChannelHandlerContext ctx,
  SocketAddress remoteAddress,
  SocketAddress localAddress,
  ChannelPromise promise
)
```

Called once a connect operation is made
Params:

- ctx - the ChannelHandlerContext for which the connect operation is made.
- remoteAddress - the SocketAddress to which it should connect
- localAddress - the SocketAddress which is used as source on connect
- promise - the ChannelPromise to notify once the operation completes

```java
void disconnect (
  ChannelHandlerContext ctx,
  ChannelPromise promise
)
```

Called once a disconnect operation is made

```java
void close (
  ChannelHandlerContext ctx,
  ChannelPromise promise
)
```

Called once a close opration is made

```java
void deregister (
  ChannelHandlerContext ctx,
  ChannelPromise promise
)
```

Called once a deregister operation is made from the current registered

```java
void read (
  ChannelHandlerContext ctx
)
```

Intercepts ChannelHandlerContext.read()

```java
void write (
  ChannelHandlerContext ctx,
  Object msg,
  ChannelPromise promise
)
```

Called once a write operations is made, the write operation will write the messages through the ChannelPipleine, Those are then ready to be flushed to the actual Channel once Channel.flush is called.

```java
void flush (ChannelHandlerContext ctx)
```

Called once a flush operation is made. The flush operation will try to flush out all previous writted messages that are pending.

## Adapter

Adapter class sometimes acting as the default implementation for a interface, in netty the adapter class just forward the operation to next ChannelHandler in the ChannelPipeline.

## ChannelHandlerAdapter

Skeleton implementation of ChannelHandler

### ChannelInboundHandlerAdapter extends ChannelHandlerAdapter implements ChannelInboundHandler

The implementation just forward the operation to the next ChannelHandler in the ChannelPipeline.

```java
ctx.fireXXXXXXXXX()
```

Sub class may override a method implementation to change this.
Be aware that message are not released after the channelRead method returns automatically, user have to release the message in channelReadComplete

### ChannelOutboundHandlerAdapter extends ChannelHandlerAdapter implements ChannelOutboundHandler

Skeleton implementation of a ChannelOutboundHandler. This implementation just forward each method call via the ChannelHandlerContext.

```java
ctx.xxxxxx
```

### ChannelDuplexHandler extends ChannelInboundHandlerAdapter implements ChannelOutboundHandler
