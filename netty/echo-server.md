# Important steps to create echo server

## steps

### You create a ServerBootstrap instance to bootstrap the server and bind it later.

### You create and assign the NioEventLoopGroup instances to handle event processing, such as accepting new connections, receiving data, writing data, and so on.

### You specify the local InetSocketAddress to which the server binds.

### You set up a childHandler that executes for every accepted connection.

### After everything is set up, you call the ServerBootstrap.bind() method to bind the server .

## life cycle

### channelRead

### channelReadCompleted

### exceptionCaught

## Components

BOOTSTRAPPER - Bootstrap ->
NioEventLoopGroup - Manage ->
NioServerSocketChannel and NioSocketChannel - populate ->
ChannelHandle/ChannelHandleAdaptor(Inbound or OutBound) [Chain of Responsibilities]
