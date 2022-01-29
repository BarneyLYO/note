# byte buffer

## location

- directly:fast access, expensive allocate
- heap: slow access, cheap allocate

## usage

- writing data to ByteBuffer
- calling ByteBuffer.flip() to switch from write-mode to read-mode
- reading data out of the ByteBuffer
- Calling either ByteBuffer.clear() or ByteBuffer.compact()

- ByteBuffer.clear(): clear the entire ByteBuffer
- ByteBuffer.compact(): Clears the data thats already been read via memory copying

## graph

<img src='https://www.javacodegeeks.com/wp-content/uploads/2012/12/bytebyffer_example.png'>

- limit: max position your can reach in current mode
- position: byte position that has been accessed in current mode
