---
title: java基础

order: 1
author: zzys
date: 2023-03-10
category:
- 面经
tags:
- 面试
- java基础
- 八股
---

## 杂项

### 为什么说java是编译和解释共存的语言？

java代码通过javac编译为`.class`字节码，根据二八定律，消耗大部分系统资源的只有那一小部分的代码（热点代码），那么我们可以使用`JIT`编译热点代码的同时对于其他的代码使用解释器进行解释，这样java就通过拥有了编译语言和解释语言的特征。

### 位运算

`<<`：左移

`>>`：算术右移

`>>`：逻辑右移

`^`：按位异或

### 验证Java只有值传递

[代码示例](https://github.com/YangZhang-dev/knojava/blob/master/basic/src/main/java/com/zzys/PassByValue.java)

## 基本数据类型

char在java中占两个字节。

### 包装类型的缓存机制

`Byte`，`Short`，`Integer`，`Long`缓存了[-128，127]的数据。

`Character`缓存了[0，127]的数据，`Boolean`直接返回`True`，`False`。

## 方法

### 重写

方法的重写要遵循“两同两小一大”：

- “两同”即方法名相同、形参列表相同；
- “两小”指的是子类方法返回值类型应比父类方法返回值类型更小或相等，子类方法声明抛出的异常类应比父类方法声明抛出的异常类更小或相等；
- “一大”指的是子类方法的访问权限应比父类方法的访问权限更大或相等。

## 变量

### 成员变量和局部变量的区别

**语法形式**：从语法形式上看，成员变量是属于类的，而局部变量是在代码块或方法中定义的变量或是方法的参数；成员变量可以被 `public`,`private`,`static` 等修饰符所修饰，而局部变量不能被访问控制修饰符及 `static` 所修饰；但是，成员变量和局部变量都能被 `final` 所修饰。

**存储方式**：从变量在内存中的存储方式来看，如果成员变量是使用 `static` 修饰的，那么这个成员变量是属于类的，如果没有使用 `static` 修饰，这个成员变量是属于实例的。而对象存在于堆内存，局部变量则存在于栈内存。

**生存时间**：从变量在内存中的生存时间上看，成员变量是对象的一部分，它随着对象的创建而存在，而局部变量随着方法的调用而自动生成，随着方法的调用结束而消亡。

**默认值**：从变量是否有默认值来看，成员变量如果没有被赋初始值，则会自动以类型的默认值而赋值（一种情况例外:被 `final` 修饰的成员变量也必须显式地赋值），而局部变量则不会自动赋值。

## 面向对象基础

三大特征：封装继承多态。

### 接口和抽象类有什么共同点和区别？

共同点：

- 都不能被实现

- 都可以包含抽象方法
- 都可以有默认的实现方法（Java8 可以在interface中使用default定义默认方法）

不同点：

- 一个类只能继承一个类，但是可以实现多个接口
- 接口中的成员变量只能是 `public static final` 类型的，不能被修改且必须有初始值，而抽象类的成员变量默认 default，可在子类中被重新定义，也可被重新赋值

- 接口强调的是对行为的一种约束，实现了某个接口证明拥有了某个行为。接口是对某个类进行抽象，强调的是一种所属关系（飞机和鸟的例子，Fly接口，AirPlane和Bird抽象类）

### 引用拷贝、深拷贝和浅拷贝

引用拷贝就是将两个引用指向同一个对象，因此两个对象的地址是相同的。

对象拷贝包括深拷贝和浅拷贝：

- 浅拷贝会在堆中创建一个新的对象，但是如果对象中的属性是引用类型的话，会直接复制内部对象地址，基础类型会直接复制值。
- 深拷贝会完全复制整个对象。

### hashCode()

由于hash碰撞的存在：

- 如果两个对象的`hashCode` 值相等，那这两个对象不一定相等（哈希碰撞）。

- 如果两个对象的`hashCode` 值相等并且`equals()`方法也返回 `true`，我们才认为这两个对象相等。

- 如果两个对象的`hashCode` 值不相等，我们就可以直接认为这两个对象不相等。

###  为什么重写 equals() 时必须重写 hashCode() 方法？

因为两个相等的对象的 `hashCode` 值必须是相等。也就是说如果 `equals` 方法判断两个对象是相等的，那这两个对象的 `hashCode` 值也要相等。

如果重写 `equals()` 时没有重写 `hashCode()` 方法的话就可能会导致 `equals` 方法判断是相等的两个对象，`hashCode` 值却不相等。

## String

String：不可变，线程安全

StringBuilder：可变，线程不安全

StringBuffer：可变，线程安全

### String不可变的原因

1. 保存字符串的数组被`final`修饰并且为私有，而且String没有提供对外修改的方法。
2. String被`final`修饰，导致不能继承，避免被子类破坏。

## 异常

**Throwable**：

​	**Exception**：

​		**UncheckedException**（RuntimeException）：NullPointerException，ClassCastException，UnsupportedOperationException

​		**CheckedExecption**

​	**Error**

### finally 中的代码一定会执行吗？

不一定。在某些情况下，finally 中的代码不会被执行。

就比如说 finally 之前虚拟机被终止运行的话，finally 中的代码就不会被执行。还有程序所在的线程死亡，关闭cpu。

### try-with-resource

```java
try (BufferedInputStream bin = new BufferedInputStream(new FileInputStream(new File("test.txt")));
     BufferedOutputStream bout = new BufferedOutputStream(new FileOutputStream(new File("out.txt")))) {
    int b;
    while ((b = bin.read()) != -1) {
        bout.write(b);
    }
}
catch (IOException e) {
    e.printStackTrace();
}
```

## 反射

反射是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为 Java 语言的反射机制。如果我们动态获取到这些信息，我们需要依靠 Class 对象。Class 类对象将一个类的方法、变量等信息告诉运行的程序。

[反射的代码实例](https://github.com/YangZhang-dev/knojava/blob/master/basic/src/main/java/com/zzys/Reflection/Reflect.java)

## 注解

### 注解的解析方法有哪几种？

注解只有被解析之后才会生效，常见的解析方法有两种：

- **编译期直接扫描**：编译器在编译 Java 代码的时候扫描对应的注解并处理，比如某个方法使用`@Override` 注解，编译器在编译的时候就会检测当前的方法是否重写了父类对应的方法。
- **运行期通过反射处理**：像框架中自带的注解(比如 Spring 框架的 `@Value`、`@Component`)都是通过反射来进行处理的。

## 序列化

- **序列化**：将数据结构或对象转换成二进制字节流的过程
- **反序列化**：将在序列化过程中所生成的二进制字节流转换成数据结构或者对象的过程

常见的序列化协议，二进制协议：Java自带的序列化，Hessian、Kryo、Protobuf、ProtoStuff，文本序列化：json、xml。

### Java自带的序列化实现

```java
public class RpcRequest implements Serializable {
    private static final long serialVersionUID = 1905122041950251207L;
    private String requestId;
    private String interfaceName;
    transient private String methodName;
    private Object[] parameters;
    private Class<?>[] paramTypes;
    private RpcMessageTypeEnum rpcMessageTypeEnum;
}
```

只需实现Serializable接口，serialVersionUID用于表示序列化版本id，当反序列化时会检查，不同会抛出`InvalidClassException`异常。使用transient可以使变量不被序列化。static变量不会被序列化。

### 为什么不适用Java自带的序列化

- 不支持跨语言调用
- 性能差
- 存在安全问题

## 泛型和通配符

[示例代码](https://github.com/YangZhang-dev/knojava/blob/master/basic/src/main/java/com/zzys/Genericity.java)

## 函数式编程

即将一些操作提供给调用者来实现，增加代码的通用性。

```java
/**
    参数1，提供数组、可以是线程不安全数组或线程安全数组
    参数2，获取数组长度的方法
    参数3，自增方法，回传 array, index
    参数4，打印数组的方法
*/
// supplier 提供者 无中生有 ()->结果
// function 函数 一个参数一个结果 (参数)->结果 , BiFunction (参数1,参数2)->结果
// consumer 消费者 一个参数没结果 (参数)->void, BiConsumer (参数1,参数2)->
private static <T> void demo(
    Supplier<T> arraySupplier,
    Function<T, Integer> lengthFun,
    BiConsumer<T, Integer> putConsumer,
    Consumer<T> printConsumer ) {
    
    List<Thread> ts = new ArrayList<>();
    T array = arraySupplier.get();
    int length = lengthFun.apply(array);
    for (int i = 0; i < length; i++) {
        // 每个线程对数组作 10000 次操作
        ts.add(new Thread(() -> {
            for (int j = 0; j < 10000; j++) {
                putConsumer.accept(array, j%length);
            }
        }));
    }
    ts.forEach(t -> t.start()); // 启动所有线程
    
    ts.forEach(t -> {
        try {
            t.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }); // 等所有线程结束
    printConsumer.accept(array);
}

// 使用
demo(
    ()->new int[10],
    (array)->array.length,
    (array, index) -> array[index]++,
    array-> System.out.println(Arrays.toString(array))
);
demo(
    ()-> new AtomicIntegerArray(10),
    (array) -> array.length(),
    (array, index) -> array.getAndIncrement(index),
    array -> System.out.println(array)
);
```
