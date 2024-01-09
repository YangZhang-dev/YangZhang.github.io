---
title: ThreadLocal

order: 8
author: zzys
date: 2023-12-20
category:
- 笔记
tag:
- ThreadLocal
- java基础
---

本文我们来说一下ThreadLocal的底层原理，以及可继承的ThreadLoca和Alibaba开源的TTL。

## Set

我们首先来看一下ThreadLocal的set方法，如下：

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    // ThreadLocalMap map = getMap(t);
    ThreadLocalMap map = t.threadLocals;
    if (map != null) {
        map.set(this, value);
    } else {
        // createMap(t, value);
        t.threadLocals = new ThreadLocalMap(this, value);
    }
}
```

根据上面的代码，我们可以很明显看出：

- 数据实际上是放在线程的一个ThreadLocalMap属性上
- ThreadLocalMap的key是ThreadLocal（看起来很别扭）
- 看起来ThreadLocalMap是懒加载的

根据以上特征，我们可以猜测ThreadLocal实际上是一个工具人，像一个特殊钩子一样将数据从Thread中的ThreadMap中勾出来，为什么说它特殊呢，因为一种钩子只能从ThreadLocalMap中勾出一个指定的数据。当然钩子这种工具应该是可以公用的，同一个ThreadLocal可以由多个不同的Thread使用，但是Thread不同，勾出的内容当然也不相同。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/24860c85f058eecf7ff063dafaabace1.png" style="zoom: 80%;" />

## Get

下面我们看一下get源码：

```java
public T get() {
    ThreadLocalMap map = getMap(Thread.currentThread());
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            T result = (T)e.value;
            return result;
        }
    }
    // 获取并设置初始值
    return setInitialValue();
}
private T setInitialValue() {
    // 获取初始值
    T value = initialValue();
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        map.set(this, value);
    } else {
        createMap(t, value);
    }
    if (this instanceof TerminatingThreadLocal) {
        TerminatingThreadLocal.register((TerminatingThreadLocal<?>) this);
    }
    return value;
}
protected T initialValue() {
    return null;
}
```

我们会发现，当获取的值不存在时，会去尝试获取并设置初始值，但是initialValue返回的是null。如果我们需要这个功能，可以使用以下方法创建ThreadLocal：

```java
ThreadLocal<String> tl = ThreadLocal.withInitial(() -> "hello");
tl.get();
```

内部就是使用了我们传入的Supplier用于初始化参数（但是还是懒加载）

## ThreadLocalMap

​	ThreadLocalMap是为这个场景下单独设计的类型，其中的表项是Entry类型，而Entry继承了弱引用。

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;

    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```

可见其将Entry的key设计为了弱引用，具体的表设计不再叙述，重点是对这里使用弱引用的考虑。

在内存中的结构应该是这样的，实线代表强引用，虚线代表虚引用，只被虚引用引用的对象每次被GC扫描到后，会直接清除。

![](D:\桌面\ThreadLocal-memory.png)

如果我们将ThreadLocalRef设置为NULL，会发生什么呢？

这是ThreadLocal就只有ThreadLocalMap中的ThreadLocalRef虚引用，当被GC到后，就会清除。

如果ThreadLocalMap中的ThreadLocalRef指向ThreadLocal的不是虚引用，而是强引用，就算我们将栈上的ThreadLocaRef置为NULL，ThreadLocal对象的内存也不会被回收。

但这里注意，我们只回收到了Key，Value是没有被回收的。虽然每次get操作都会检测key是否存在，不存在置为NULL。但是最保险的是我们手动进行清理，调用remove方法。

```java
public void remove() {
    ThreadLocalMap m = getMap(Thread.currentThread());
    if (m != null) {
        m.remove(this);
    }
}
```

那么为啥要设计为通过ThreadLocal获取value呢？我们知道对于一个线程，使用其ThreadLocalMap不是一个频率较高的情况，如果内嵌到Thread类中，只会增加不必要的开销。只有在创建ThreadLocal，调用get/set方法后，才会懒加载出ThreadLocalMap这个对象，对性能有一定提升。

[ThreadLocalMap为什么要定义在ThreadLocal中，而不直接定义在Thread中？](https://ask.csdn.net/questions/730831)

## InheritableThreadLocal

### 使用

当我们需要在子线程中使用父线程的ThreadLocalMap的值时，即便是由同一ThreadLocal对象，获取到的也不是同一个值，具体可见： [ThreadLocal](.\basic\ThreadLocal.md) 

所以JDK官方推出了一个InheritableThreadLocal，可继承的ThreadLocal。常规的使用如下：

```java
public class StringInheritable {
    private static final ThreadLocal<String> threadLocal = new InheritableThreadLocal<>();

    public static void main(String[] args) {
        threadLocal.set("main");
        new Thread(()->{
            System.out.println(threadLocal.get());
            threadLocal.set("t1");
        }).start();
        try {
            Thread.sleep(1000);
            System.out.println(threadLocal.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
// main
// main
```

我们这样就成功的在子线程中获取到了父线程的main。

但是我们真的是获取父线程中的ThreadLocalMap的值吗？其实在代码中就可以发现一丝端倪。我们在子线程中对值进行修改，父线程中的值却依旧保持不变。那么就证明我们的猜想是有一点问题的。

### 原理

我们先看一下InheritableThreadLocal的源码，它继承于ThreadLocal，其中重写了少部分代码，如下：

```java
public class InheritableThreadLocal<T> extends ThreadLocal<T> {

    protected T childValue(T parentValue) {
        return parentValue;
    }

    ThreadLocalMap getMap(Thread t) {
       return t.inheritableThreadLocals;
    }

    void createMap(Thread t, T firstValue) {
        t.inheritableThreadLocals = new ThreadLocalMap(this, firstValue);
    }
}
```

根据以上代码，我们不难发现，当我们使用InheritableThreadLocal类时，对于父子线程，我们实际上使用的不再是Thread.threadLocals，而是Thread.inheritableThreadLocals属性。

那我们是什么时候对inheritableThreadLocals复制的呢？如果在InheritableThreadLocal类中，找不到，那么只能去Thread类中寻找答案。

```java
private void init(ThreadGroup g, Runnable target, String name,
                  long stackSize, AccessControlContext acc,
                  boolean inheritThreadLocals) {
    // ...
    if (inheritThreadLocals && parent.inheritableThreadLocals != null)
        this.inheritableThreadLocals =
            ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
    // ...
}
```

答案在创建类时的init方法中，我们默认创建线程时，inheritThreadLocals这个变量是true，那么一旦我们的父线程，也就是在创建当前线程的线程含有一个不为空的inheritableThreadLocals属性时，我们就会调用createInheritedMap方法。

```java
static ThreadLocalMap createInheritedMap(ThreadLocalMap parentMap) {
    return new ThreadLocalMap(parentMap);
}
private ThreadLocalMap(ThreadLocalMap parentMap) {
    Entry[] parentTable = parentMap.table;
    int len = parentTable.length;
    setThreshold(len);
    table = new Entry[len];

    for (int j = 0; j < len; j++) {
        Entry e = parentTable[j];
        if (e != null) {
            ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
            if (key != null) {
                Object value = key.childValue(e.value);
                Entry c = new Entry(key, value);
                int h = key.threadLocalHashCode & (len - 1);
                while (table[h] != null)
                    h = nextIndex(h, len);
                table[h] = c;
                size++;
            }
        }
    }
}
```

当创建一个可继承的ThreadLocal时，我们会遍历它的Entry，创建一个新下Entry放入我们自己的ThreadLocalMap中。

所以，子线程获取的值实际上是父线程值的副本，当我们改变值时，父线程不会改变。

上面这句话对吗？

实际上不严谨，应该是获取到值引用的副本，也就是说，我们实际上现在有两个引用，都指向堆中的对象。

对于第一段代码举得例子，我们实际上是将子线程inheritableThreadLocals中的值指向了新的String。

下面的代码我们使用反射将堆中的对象改变后，我们就会发现，在主线程中，String的值发生了改变。

```java
public class StringInheritable {
    private static final ThreadLocal<String> threadLocal = new InheritableThreadLocal<>();

    public static void main(String[] args) {
        threadLocal.set("main");
        new Thread(()->{
            System.out.println(threadLocal.get());
            try {
                Field value = String.class.getDeclaredField("value");
                value.setAccessible(true);
                value.set(threadLocal.get(),"t1".toCharArray());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }).start();
        try {
            Thread.sleep(1000);
            System.out.println(threadLocal.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

如图所示，两个线程通过同一个InheritableThreadLocal，获取到自己的ThreadLocalMap，但是其中的Key和Value都是分别指向相同的对象，如果对对象进行改变，另一个线程会感知到。

![](D:\桌面\InheritableThreadLocal.png)

### 改进

我们转念一想，这不就是浅拷贝吗？如果能在复制是使用深拷贝就好了。这时就轮到childValue方法起作用了。

在上面ThreadLocalMap的构造方法中可以看到，Value实际上会传递给childValue方法处理，这实际上就是一种模板方法，交给子类去扩展，它本身是直接将值返回，我们可以对它进行重写，换为深拷贝。

```java
public class StringInheritable {
    private static final ThreadLocal<String> threadLocal = new InheritableThreadLocal(){
        @Override
        protected Object childValue(Object parentValue) {
            if (parentValue instanceof String){
                return new String((String)parentValue);
            }
            return super.childValue(parentValue);
        }
    };

    public static void main(String[] args) {
        threadLocal.set("main");
        new Thread(()->{
            System.out.println(threadLocal.get());
            try {
                Field value = String.class.getDeclaredField("value");
                value.setAccessible(true);
                value.set(threadLocal.get(),"t1".toCharArray());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }).start();
        try {
            Thread.sleep(1000);
            System.out.println(threadLocal.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
// main
// main
```

## TTL

[alibaba/transmittable-thread-local](https://github.com/alibaba/transmittable-thread-local)

[全链路追踪必备组件之 TransmittableThreadLocal 详解](https://zhuanlan.zhihu.com/p/146124826)

在父子线程这种关系之间，我们的InheritableThreadLocal已经可以工作的很好了，但是我们又引出了一个新的场景，线程池。

我们知道，线程池实际上是用了池化技术，对线程进行复用，工作完的核心线程不去立即销毁，而是等待下一个任务的到来。

那么这个场景对我们的InheritableThreadLocal是有一定的问题的，如果一个工作线程是在线程复用的状态下执行新的任务，那么它不会走Thread#init方法，也就是它的ThreadLocalMap还是上一次的旧的数据。

那么我们这里就引入了Alibaba的TransmittableThreadLocal，它就是专门为了这种场景而生的，具体的原理我们不再介绍，大致是当向线程池提交任务时，创建当前线程的ThreadLocal快照，当Worker准备执行时将快照应用。[Transmittable-Thread-Local：阿里开源的线程间上下文传递解决方案 ](https://zhuanlan.zhihu.com/p/113388946)

这里主要是说一下如果我们想要达到父子线程对于引用类型达到深拷贝的效果，只是重写childValue是不够的，我们必须要在应用快照时，也对快照内的内容进行深拷贝，具体如下：

我们初始化一个TTL和一个总线程数为1的线程池，保证一定复用。

首先在主线程中将值设置为main，然后提交一个任务，在其中延时500ms后打印值，并且通过反射修改值。

接着提交一个任务，这个任务会放在阻塞队列中等待任务一完成，所以它会复用任务一的队列，它所做的操作和任务一相同。

主线程在1000ms后打印值。

```java
public class TTL {
    private static final ThreadLocal<String> threadLocal = new TransmittableThreadLocal(){
        @Override
        public Object copy(Object parentValue) {
            if (parentValue instanceof String)
                return new String((String) parentValue);
            return super.copy(parentValue);
        }
        @Override
        protected Object childValue(Object parentValue) {
            if (parentValue instanceof String)
                return new String((String) parentValue);
            return super.childValue(parentValue);
        }
    };
    private static final ThreadPoolExecutor executor = new ThreadPoolExecutor(1,1,1, TimeUnit.SECONDS,new LinkedBlockingDeque<>());

    public static void main(String[] args) {
        threadLocal.set("main");
        executor.execute(TtlRunnable.get(()->{
            try {
                Thread.sleep(500);
                System.out.println("t1: " + threadLocal.get());
                Field value = String.class.getDeclaredField("value");
                value.setAccessible(true);
                value.set(threadLocal.get(),"thread1".toCharArray());
            } catch (InterruptedException | NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }));
        executor.execute(TtlRunnable.get(()->{
            System.out.println("t2: " + threadLocal.get());
            try {
                Field value = String.class.getDeclaredField("value");
                value.setAccessible(true);
                value.set(threadLocal.get(),"thread2".toCharArray());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }));
        try {
            Thread.sleep(1000);
            System.out.println("main: " + threadLocal.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

上述结果打印的三个都是main，也是合理的，三个都是自己的副本。

如果没有重写copy方法，那么三个的String都是同一个对象，那么结果就如下：

```
t1: main
t2: thread1
main: thread2
```

