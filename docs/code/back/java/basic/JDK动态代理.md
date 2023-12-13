---
title: JDK动态代理

order: 5
author: zzys
date: 2023-12-1
category:
- 笔记
tags:
- 动态代理
- java基础
---

## 静态代理

每次谈到动态代理，都需要把静态代理拿出来诋毁一番。静态代理，顾名思义就是需要我们静态的提供一个代理类，创建代理对象，实现增强操作。

代理是一种模式，提供了对目标对象的间接访问方式，即通过代理访问目标对象。如此便于在目标实现的基础上增加额外的功能操作，前拦截，后拦截等，以满足自身的业务需求。

### 实现

```bash
├─TargetService.java   # 接口
├─TestStaticProxy.java  # 测试类
├─impl
|  ├─TargetProxy.java   # 静态代理类
|  └TargetServiceImpl.java  # 目标类
```

```java
public class TargetProxy implements TargetService {
    // private 防止外界修改，final防止子类修改
    private final TargetService targetService;

    public TargetProxy(TargetService targetService) {
        this.targetService = targetService;
    }

    @Override
    public void doSomething() {
        System.out.println("before do something");
        targetService.doSomething();
        System.out.println("after do something");
    }
}
```

我们会发现，每当我们需要为一个接口下的实现类做代理，就需要一个新的代理类，这确实也体现了静态的特点。其实，所有的代理类大体都是相似的，不同的是**增强逻辑**以及**需要被代理的类**。我们能不能不去手动新建代理类，直接通过这两个就获取到代理对象呢？

## JDK动态代理

我们知道，创建对象的过程：`java代码-->class字节码-->Class对象-->实际对象`。我们不想编写java代码，也就意味着class字节码是不存在了，需要凭空出现一个Class对象，并且这个对象还需要有我们希望被代理对象的关键方法（继承自接口的方法）。

那么就要想方法拿到关键方法的信息，有两种途径：

- 一是直接通过需要被代理的对象直接获取（CGLib动态代理）
- 二是通过代理接口获取（JDK动态代理）

通过实验能够发现，接口中不存在构造器的方法信息，只存在方法的信息，那么我们就可以考虑从接口获取代理对象。

### Proxy

在`java.lang.reflect`中有名叫`Proxy`的类，其中：

```java
public static Class<?> getProxyClass(ClassLoader loader,
                                     Class<?>... interfaces)
    throws IllegalArgumentException
{
    final Class<?>[] intfs = interfaces.clone();
    final SecurityManager sm = System.getSecurityManager();
    if (sm != null) {
        checkProxyAccess(Reflection.getCallerClass(), loader, intfs);
    }

    return getProxyClass0(loader, intfs);
}
```

此方法需要我们传入一个类加载器以及接口的Class信息，在方法中调用Class的clone方法生成了全新的Class对象，这样就完成了我们的诉求，即没有字节码，创建全新的Class对象，总结来说就是**用Class造Class，即用接口Class造出一个代理类Class，然后把我们接口中的所有方法复制过去**。

我们调用此方法，获取Class对象，同时尝试获取构造器。

```java
Class<?> proxyClass = Proxy.getProxyClass(TargetService.class.getClassLoader(),TargetService.class);
Constructor<?> constructor = proxyClass.getConstructor(InvocationHandler.class);
// public com.sun.proxy.$Proxy0(java.lang.reflect.InvocationHandler)

// getMethod()中有一条：public final void com.sun.proxy.$Proxy0.doSomething()
```

可以发现，JDK底层不仅为我们构造好了代理对象，同时，为我们创建了一个有参构造，其中需要传入`InvocationHandler`类，同时，我们需要的同名目标方法也已经存在。

那么我们就顺着这个构造函数创建代理对象：

```java
TargetService service = (TargetService)constructor.newInstance(new InvocationHandler() {
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        TargetServiceImpl targetService = new TargetServiceImpl();
        Object res = method.invoke(TargetServiceImpl.class.newInstance(), args);
        return res;
    }
});
service.doSomething();
```

传入一个匿名类，实现它的invoke方法，其中第一个参数是代理对象实例，一般不用。第二个是调用的方法，第三个是传入的参数。

当我们调用代理类的方法的同名方法`doSomething`时，内部调用了`InvocationHandler`的`invoke`方法，里面就是我们自己的逻辑了。

### 问题

`Proxy`是怎么强转为`TargetService`的呢？实际上`$Proxy0`是运行时才存在的类，它会被JVM底层动态的实现TargetService接口，所以强转不会报错。

同时，为什么调用Proxy的同名方法就可以实现调用增强代码呢？还记的在获取构造器是，我们匹配到了含有一个`InvocationHandler`参数的构造器，所以在下面的构造方法中，`invocationHandler`就被父类`Proxy`所赋值给`h`属性，我们就可以在`$Proxy0`中调用`this.h`来执行增强代码了。

```java
// 1.自动实现目标接口，所以代理对象可以转成Calculator
final class $Proxy0 extends Proxy implements Proxy.TergetService {
    private static Method m3;

    public $Proxy0(InvocationHandler invocationHandler) {
        super(invocationHandler);
    }

    static {
        // 2.获取目标方法Method
        m3 = Class.forName("com.zzys.demo.Proxy$Calculator").getMethod("doSomething", 可以有参数（Integer.TYPE）);
    }

    public final int doSomething(int n, int n2) {
        // 3.通过InvocationHandler执行方法
        //   this：就是$Proxy0的实例，所以是代理对象，不是目标对象
        return (Integer)this.h.invoke(this, m3, new Object[]{n, n2});
    }
}
```

