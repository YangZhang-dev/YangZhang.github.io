---
title: sprin常见面试题

order: 1
author: zzys
date: 2023-12-02
category:
- 面经
tag:
- 面试
- spring
- 八股
---

[Spring核心原理解析 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/156209283)

## Spring用了什么设计模式



## IOC

IOC容器，里面存放着要使用的bean，同时我们还可能需要一些高级功能，比如bean的处理器，事件发布相关的的，所以一个高级的IOC容器中，应该将低级容器抽取出来，依赖于低级容器，而高级IOC容器只需要关心高级功能，同时可以随时更换低级容器。

### IOC容器的初始化步骤

[Spring详解（五）——Spring IOC容器的初始化过程 ](https://www.cnblogs.com/tanghaorong/p/13497223.html)

[Spring IOC容器初始化主体流程](https://zhuanlan.zhihu.com/p/432896291)

[面试官：你来说一下Spring IOC容器的创建过程](https://zhuanlan.zhihu.com/p/593595408)

[面试问烂的 Spring IOC 过程](https://zhuanlan.zhihu.com/p/150860904)

在ApplicationContext这些高级容器中，实际上是依赖于底层容器（BeanFactory）做Bean的装载。而高级容器实现了一些拓展功能，例如接口回调，监听器，自动实例化单例，发布事件等。

所以IOC容器初始化大致分为两个步骤：

1. 低级容器加载配置文件（从 XML，数据库，Applet），并解析成 BeanDefinition 到低级容器中。
2. 加载成功后，高级容器启动高级功能，例如接口回调，监听器，自动实例化单例，发布事件等等功能。

以`ClassPathXmlApplicationContext`的初始化为例，它会调用`AbstractApplicationContext`中的`refresh`方法，这个是IOC容器最核心的代码，包含了上面的两个步骤。

refresh方法首先通过`obtainFreshBeanFactory`获取到一个Bean工厂（低级容器），实现了对底层容器的刷新。如果当前已经存在了容器，它会将旧容器删除，重新创建新容器。然后重新执行对Resource的定位，Bean的载入以及注册。然后调用`prepareBeanFactory`对工厂进行属性填充。

之后就是一些扩展接口和高级功能，依次包括

- **postProcessBeanFactory：SPI**
- invokeBeanFactoryPostProcessors：调用工厂后置处理器
- registerBeanPostProcessors：注册bean后置处理器
- initMessageSource：初始化国际化资源
- initApplicationEventMulticaster：初始化事件派发器
- **onRefresh**：SPI，可以自定义逻辑，spring boot在这里启动了Tomcat
- registerListeners：注册所有应用监听器，所有实现了ApplicationListener的bean
- **finishBeanFactoryInitialization**：初始化所有懒加载的bean

## bean

### 生命周期

实例化、属性赋值、初始化、销毁

[带你彻底掌握Bean的生命周期 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/638361741)

[java - Spring Bean生命周期详解 - Spring注解全面解析 - SegmentFault 思否](https://segmentfault.com/a/1190000044064099)

## SpringBoot和Spring区别

spb是对sp的拓展，首先是消除了XML配置，将常见的依赖进行整合。提供了自动装配机制。将应用服务器内嵌入应用中，只需要打jar包即可运行服务。

## Spring循环依赖
