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

