# Selectors

## Channel

represents a connection to an entity capable of performing IO operations such as a file or socket

## Selector

is a NIO component that determines if one or more channels are ready for reading and/or writing, thus a single select selector can be used to handle multiple connections, alleviating the need for the thread-per-connection model.

### Steps

1. create one or more selectors to which opened channels can be registered.
2. when a channel is registered, define which events to listening:

- OP_ACCEPT
- OP_CONNECT
- OP_READ
- OP_WRITE

3. when the channels are registered, call the Selector.select to block until one of these events occurs.
4. when the method unblocks, obtain all of the SelectionKey instance which hold the reference to the registered channel and to selected Ops.
