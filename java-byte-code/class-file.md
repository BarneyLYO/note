# Class File

```java
public class Hello {
  public static void main (String[] args) {
    System.out.println("123455");
  }
}
```

## procedure

javac -g xxx.java (add debug info)

.java file => javac => .class file

.class file => Class Loader => Bytecode Verifier => Java Runtime System => Native OS

above compiled java code class file can be viewed by xxd

```
xxd Hello.class
00000000: cafe babe 0000 0034 001d 0a00 0600 0f09  .......4........
00000010: 0010 0011 0800 120a 0013 0014 0700 1507  ................
00000020: 0016 0100 063c 696e 6974 3e01 0003 2829  .....<init>...()
00000030: 5601 0004 436f 6465 0100 0f4c 696e 654e  V...Code...LineN
00000040: 756d 6265 7254 6162 6c65 0100 046d 6169  umberTable...mai
00000050: 6e01 0016 285b 4c6a 6176 612f 6c61 6e67  n...([Ljava/lang
00000060: 2f53 7472 696e 673b 2956 0100 0a53 6f75  /String;)V...Sou
00000070: 7263 6546 696c 6501 000a 4865 6c6c 6f2e  rceFile...Hello.
00000080: 6a61 7661 0c00 0700 0807 0017 0c00 1800  java............
00000090: 1901 000b 4865 6c6c 6f20 576f 726c 6407  ....Hello World.
000000a0: 001a 0c00 1b00 1c01 0005 4865 6c6c 6f01  ..........Hello.
000000b0: 0010 6a61 7661 2f6c 616e 672f 4f62 6a65  ..java/lang/Obje
000000c0: 6374 0100 106a 6176 612f 6c61 6e67 2f53  ct...java/lang/S
000000d0: 7973 7465 6d01 0003 6f75 7401 0015 4c6a  ystem...out...Lj
000000e0: 6176 612f 696f 2f50 7269 6e74 5374 7265  ava/io/PrintStre
000000f0: 616d 3b01 0013 6a61 7661 2f69 6f2f 5072  am;...java/io/Pr
00000100: 696e 7453 7472 6561 6d01 0007 7072 696e  intStream...prin
00000110: 746c 6e01 0015 284c 6a61 7661 2f6c 616e  tln...(Ljava/lan
00000120: 672f 5374 7269 6e67 3b29 5600 2100 0500  g/String;)V.!...
00000130: 0600 0000 0000 0200 0100 0700 0800 0100  ................
00000140: 0900 0000 1d00 0100 0100 0000 052a b700  .............*..
00000150: 01b1 0000 0001 000a 0000 0006 0001 0000  ................
00000160: 0001 0009 000b 000c 0001 0009 0000 0025  ...............%
00000170: 0002 0001 0000 0009 b200 0212 03b6 0004  ................
00000180: b100 0000 0100 0a00 0000 0a00 0200 0000  ................
00000190: 0300 0800 0400 0100 0d00 0000 0200 0e    ...............
```

## magic number

0xCAFEBABE

## javap

- Disassembles one or more class file
- c Disasseble the code
- v verbose
- l print line number and local variable tables
- p show all classes and members
- s print internal type signatures

```
Classfile /Users/barney/Barney/workspace/note/java-byte-code/sample/bytecode/Hello.class
  Last modified 2022-8-9; size 581 bytes
  MD5 checksum 7f654c77b950a9f3c6b6023f53740b2e
  Compiled from "Hello.java"
public class Hello
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #9.#21         // java/lang/Object."<init>":()V
   #2 = Fieldref           #22.#23        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #24            // 1
   #4 = Methodref          #25.#26        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Methodref          #9.#27         // java/lang/Object.toString:()Ljava/lang/String;
   #6 = Class              #28            // Hello
   #7 = Methodref          #6.#21         // Hello."<init>":()V
   #8 = String             #29            // Hello World
   #9 = Class              #30            // java/lang/Object
  #10 = Utf8               <init>
  #11 = Utf8               ()V
  #12 = Utf8               Code
  #13 = Utf8               LineNumberTable
  #14 = Utf8               a
  #15 = Utf8               toString
  #16 = Utf8               ()Ljava/lang/String;
  #17 = Utf8               main
  #18 = Utf8               ([Ljava/lang/String;)V
  #19 = Utf8               SourceFile
  #20 = Utf8               Hello.java
  #21 = NameAndType        #10:#11        // "<init>":()V
  #22 = Class              #31            // java/lang/System
  #23 = NameAndType        #32:#33        // out:Ljava/io/PrintStream;
  #24 = Utf8               1
  #25 = Class              #34            // java/io/PrintStream
  #26 = NameAndType        #35:#36        // println:(Ljava/lang/String;)V
  #27 = NameAndType        #15:#16        // toString:()Ljava/lang/String;
  #28 = Utf8               Hello
  #29 = Utf8               Hello World
  #30 = Utf8               java/lang/Object
  #31 = Utf8               java/lang/System
  #32 = Utf8               out
  #33 = Utf8               Ljava/io/PrintStream;
  #34 = Utf8               java/io/PrintStream
  #35 = Utf8               println
  #36 = Utf8               (Ljava/lang/String;)V
{
  public Hello();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 1: 0

  public java.lang.String toString();
    descriptor: ()Ljava/lang/String;
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #5                  // Method java/lang/Object.toString:()Ljava/lang/String;
         4: areturn
      LineNumberTable:
        line 7: 0

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: new           #6                  // class Hello
         3: dup
         4: invokespecial #7                  // Method "<init>":()V
         7: pop
         8: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        11: ldc           #8                  // String Hello World
        13: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        16: return
      LineNumberTable:
        line 11: 0
        line 12: 8
        line 13: 16
}
SourceFile: "Hello.java"
```

### aload_x

x = local variable idx

### invokespecial #x

call instance constructor or private method, super method

### return

ireturn: return int
lreturn: return long
freturn: return float
dreturn: return double
areturn: return anyObject
return: return void

### getStatic #n

get static field from a class and push to the stack

### ldc #n

load a constant from constant pool and push to the stack

### invokevirtual #n

call an instance method

### Field Descriptor

B byte
C char
D double
F float
I int
J long
LClassName; reference
S short
Z boolean
[ array-of

### Method Descriptor

the arguments and return type of a method

- format (ParameterDescriptor\*) ReturnDescriptor
  example:
  Object foo(int i, double d, Thread t) => (IDLjava/lang/Thread;)Ljava/lang/Object;
  void a(int i) => (I)V

## class file structure

JVM defined u1,u2,u4 3 different data structure to present 1,2,4 byte unsinged int,
using table to represent a same type of data, n to represent the length
My Very Cute Animal Turns Savage In Full Moon Areas

```c
struct ClassFile {
  u4 magic;
  u2 minor_version;
  u2 major_version;
  // constant pool
  u2 constant_pool_count;
  cp_info constant_pool[constant_pool_count-1]; // o reserved for not refer to any field
  //
  u2 access_flags;
  //
  u2 this_class; // index in constant pool
  u2 super_class;
  //
  u2 interface_count;
  u2 interface[interfaces_count]; // index in constants pool
  //
  u2 fields_count;
  field_info fields[fields_count];
  //
  u2 methods_count;
  method_info methods[methods_count];
  //
  u2 attributes_count;
  attribute_info attributes[attributes_count];
}
```

### constants pool

like c language symbol table
max n - 1, long and double take 2 slot

```
   #3 = Long               123456l
   #5 = Methodref          #26.#27        // java/io/PrintStream.println:(J)V
```

min 1

- structure

```c
struct cp_info {
  u1 tag;
  u1 info[];
}
```

#### constant pool fields structure

CONSTANT_Utf8_info => 1
{
u1 tag;
u2 length;
u1 bytes[length]
}
CONSTANT_Integer_info => 3
{
u1 tag; 3
u4 bytes;
}
CONSTANT_Float_info => 4
{
u1 tag;
u4 bytes;
}
CONSTANT_Long_info => 5
{
u1 tag;
u4 high_bytes;
u4 low_bytes;
}
CONSTANT_Double_info => 6
{
u1 tag;
u4 high_bytes;
u4 low_bytes;
}
CONSTANT_Class_info => 7
{
u1 tag;
u2 name_index; // ref to constant pool's actual CONSTANT_Utf8_info
}
CONSTANT_String_info => 8
{
u1 tag;
u2 string_index; // ref to constant pool's actual CONSTANT_Utf8_info
}
CONSTANT_Fieldref_info => 9
{
u1 tag;
u2 class_index;
u2 name_and_type_index; // CONSTANT_NameAndType_info
}
CONSTANT_Methofref_info => 10
{
u1 tag;
u2 class_index; // class it belongs CONSTANT_Class_info
u2 name_and_type_index; // CONSTANT_NameAndType_info
}
CONSTANT_InterfaceMethodref_info => 11
{
u1 tag;
u2 class_index;
u2 name_and_type_index; // CONSTANT_NameAndType_info
}
CONSTANT_NameAndType_info => 12 // descriptor
{
u1 tag;
u2 name_index;
u2 descriptor_index;
}
// for the invokeDynamic
CONSTANT_MethodHandle_info => 15
CONSTANT_MethodType_info => 16
CONSTANT_InvokeDynamic_info => 18
{
u1 tag;
u2 bootstrap_method_attr_index; bootstrap_method[] index
u2 name_and_type_index;
}

boolean, byte,short and char in constant pool will be treat as int

### Access Flag 2 bytes

ACC_PUBLIC 1
ACC_FINAL 10
ACC_SUPER 20 // @deprecated
ACC_INTERFACE 200 class or interface
ACC_ABSTRACT 400
ACC_SYNTHETIC 1000 compile generated
ACC_ANNOTATIOn 2000 annotation class
ACC_ENUM 4000 enumation class

### field info

```c
struct field_info {
  u2 access_flags;
  u2 name_index; // constant pool string
  u2 descriptor_index;
  u2 attributes_count;
  attribute_info attributes[attributes_count]; // ConstantValue,Synthetic,Signature,Deprecated, RuntimeVisibleAnnotations, RuntimeInvisibleAnnotations
}
```

#### access flag

ACC_PUBLIC
ACC_PRIVATE
ACC_PROTECTED
ACC_STATIC
ACC_FINAL
ACC_VOLATILE
ACC_TRANSIENT
ACC_SYNTHETIC
ACC_ENUM

### method table

{
u2 methods_count;
method_info methods[methods_count]
}

```c
struct method_info {
  u2 access_flags;
  u2 name_index;
  u2 descriptor_index;
  u2 attribute_count;
  attribute_info attributes[attribute_count];
}
```

### attribute info

can be appear in the top class file, method, field
{
u2 attributes_count;
attribute_info attributes[attributes_count];
}

#### ConstantValue

```c
struct ConstantValue_attribute {
  u2 attribute_name_index; // constants pool
  u4 attribute_length; // 2
  u2 constantvalue_index; // constants pool
}
```

#### Code

code

```c
struct Code_attribute {
  u2 attribute_name_index;
  u4 attribute_length;
  u2 max_stack;
  u2 max_locals;
  u4 code_length;
  u1 code[code_length];
  u2 exception_table_length;

  {
    u2 start_pc;
    u2 end_pc;
    u2 handler_pc;
    u2 catch_type;
  } exception_table[exception_table_length];

  u2 attributes_count;
  attribute_info attributes[attributes_count];
}
```

## Bytecode

an instruction is assembled by
`<opcode> [<operand1>,<oprand2>]`
len(opcode) = 1byte
max(opcodes) = 256 = 2^8

byte code using Big-Endian, high bit first, low second
