---
title: Java常见面试题

order: 1
author: zzys
date: 2023-12-04
category:
- 面经
tag:
- 面试
- Java
- 八股
---

## JDK动态代理，不实现接口就不能做代理了吗，为什么

是的，如果要使用JDK动态代理必须要创建接口，在JDK1.8下的Proxy类中有一个静态内部类ProxyClassFactory，其中的apply方法是用来生产Proxy的，中间有一段代码：
```java
 /*
 * Verify that the Class object actually represents an
 * interface.
 */
if (!interfaceClass.isInterface()) {
    throw new IllegalArgumentException(
        interfaceClass.getName() + " is not an interface");
}
```

如果传入的Class不是interface类型，会直接抛出异常。

## ThreadLocal使用场景原理

在项目中主要使用ThreadLocal保存线程的本地变量，比如可以在拦截器中放入用户id，之后都可以很方便的取出id，但是要注意在拦截器的后置处理中一定要将其remove，不然会导致内存泄漏。

虽然前面说的时使用ThreadLocal保存线程本地变量，但是我更倾向于把它称作一个钩子，利用它可以将ThreadLocalMap中钩出想要的数据，ThreadLocalMap是Thread的一个属性，它是懒加载的，只有当我们第一次访问时才会创建。

ThreadLocalMap中的Entry是以当前的ThreadLocal为key，设置的值为value存放的，对于不同的线程，使用相同的ThreadLocal去获取数据，获取到的是Thread自己的ThreadLocalMap内部的Entry，也就实现了线程本地变量。向外保持了很好的封装性。

## Java为什么不可以多继承

声明多继承（支持）、实现多继承（不支持）

[Java 为什么不支持多继承？](https://www.zhihu.com/question/24317891)
