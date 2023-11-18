---
title: jvm

order: 1
author: zzys
date: 2023-08-06
category:
- 技术成长
tags:
- jvm
- java
---

JVM 即 Java Virtual Machine，Java虚拟机，java二进制字节码运行环境。

优点：
- 一次编译，处处执行
- 自动的内存管理，垃圾回收机制
- 数组下标越界检查

JVM、JRE、JDK 的关系如下图所示

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/1cc07598f89ac9481e9e7708f004f506.png" alt="image-20230811203550153" style="zoom:50%;" />

jvm内存模型如图：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/91fe86f3aa58b5519ade6b3a6f501c77.png" alt="image-20230811203631650" style="zoom:67%;" />



## 内存结构

### 程序计数器

Program Counter Register 程序计数器（寄存器）

作用：是记录下一条 jvm 指令的执行地址行号。

特点：

- 是线程私有的
- 不会存在内存溢出

- 解释器会解释指令为机器码交给 cpu 执行，程序计数器会记录下一条指令的地址行号，这样下一次解释器会从程序计数器拿到指令然后进行解释执行。
- 多线程的环境下，如果两个线程发生了上下文切换，那么程序计数器会记录线程下一行指令的地址行号，以便于接着往下执行。

### 虚拟机栈

每个线程运行需要的内存空间，称为虚拟机栈，每个栈由多个栈帧（Frame）组成，对应着每次调用方法时所占用的内存，每个线程只能有一个活动栈帧，对应着当前正在执行的方法

问题辨析：

- 垃圾回收是否涉及栈内存？
  不会。栈内存是方法调用产生的，方法调用结束后会弹出栈。

- 栈内存分配越大越好吗？

  不是。因为物理内存是一定的，栈内存越大，可以支持更多的递归调用，但是可执行的线程数就会越少。

- 方法呢的局部变量是否线程安全

  - 如果方法内部的变量没有逃离方法的作用访问，它是线程安全的

  - 如果是局部变量引用了对象，并逃离了方法的访问，那就要考虑线程安全问题

    

> 栈帧过大、过多、或者第三方类库操作，都有可能造成栈内存溢出 java.lang.stackOverflowError ，使用 -Xss256k 指定栈内存大小！

案例：cpu 占用过多

- top 命令，查看是哪个进程占用 CPU 过高

- ps H -eo pid, tid（线程id）, %cpu | grep 刚才通过 top 查到的进程号 通过 ps 命令进一步查看是哪个线程占用 CPU 过高

- jstack 进程 id 通过查看进程中的线程的 nid ，刚才通过 ps 命令看到的 tid 来对比定位，注意 jstack 查找出的线程 id 是 16 进制的，需要转换。

### 本地方法栈

一些带有 native 关键字的方法就是需要 JAVA 去调用本地的C或者C++方法，因为 JAVA 有时候没法直接和操作系统底层交互，所以需要用到本地方法栈，服务于带 native 关键字的方法。

### 堆

Heap 堆

- 通过new关键字创建的对象都会被放在堆内存

特点

- 它是线程共享，堆内存中的对象都需要考虑线程安全问题
- 有垃圾回收机制

#### 堆内存溢出

java.lang.OutofMemoryError ：java heap space. 堆内存溢出
可以使用 -Xmx8m 来指定堆内存大小。

#### 堆内存诊断

1. jps 工具
   查看当前系统中有哪些 java 进程
2. jmap 工具
   查看堆内存占用情况 jmap - heap 进程id
3. jconsole 工具
   图形界面的，多功能的监测工具，可以连续监测
4. jvisualvm 工具

### 方法区

Java 虚拟机有一个在所有 Java 虚拟机线程之间共享的方法区域。方法区域类似于用于传统语言的编译代码的存储区域，或者类似于操作系统进程中的“文本”段。它存储每个类的结构，例如运行时常量池、字段和方法数据，以及方法和构造函数的代码，包括特殊方法，用于类和实例初始化以及接口初始化方法区域是在虚拟机启动时创建的。尽管方法区域在逻辑上是堆的一部分，但简单的实现可能不会选择垃圾收集或压缩它。此规范不强制指定方法区的位置或用于管理已编译代码的策略。方法区域可以具有固定的大小，或者可以根据计算的需要进行扩展，并且如果不需要更大的方法区域，则可以收缩。方法区域的内存不需要是连续的！

永久代：使用heap空间

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/771ad4edb0291ef0607b1f20b6187b52.png" alt="image-20230811204212311" style="zoom:67%;" />

元空间：使用本地内存

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/4aa625382e30b193de6170cc4ef196b4.png" alt="image-20230811204333841" style="zoom:67%;" />

注意无论是永久代还是元空间，都是方法区的实现。

#### 方法区内存溢出

- 1.8 之前会导致永久代内存溢出
  - 使用 -XX:MaxPermSize=8m 指定永久代内存大小
- 1.8 之后会导致元空间内存溢出
  - 使用 -XX:MaxMetaspaceSize=8m 指定元空间大小

### 常量池

常量池就是一张表，虚拟机指令根据这张常量表找到要执行的类名、方法名、参数类型、字面量信息

**运行时常量池**：

常量池是 *.class 文件中的，当该类被加载以后，它的常量池信息就会放入运行时常量池，并把里面的**符号地址**变为**真实地址**。

### StringTable

特点：

- 常量池中的字符串仅是符号，只有在被用到时才会转化为对象，懒加载
- 利用串池的机制，来避免重复创建字符串对象
- 字符串变量拼接的原理是StringBuilder
- 字符串常量拼接的原理是编译器优化，"a" + "b" == "ab"
- 可以使用intern方法，主动将串池中还没有的字符串对象放入串池中

#### intern方法 1.8

调用字符串对象的 intern 方法，会将该字符串对象尝试放入到串池中

- 如果串池中没有该字符串对象，则放入成功
- 如果有该字符串对象，则放入失败
  无论放入是否成功，都会返回串池中的字符串对象

如果是1.6 放入成功则会返回一个副本。

#### 性能调优

- 因为StringTable是由HashTable实现的，所以可以适当增加HashTable桶的个数，来减少字符串放入串池所需要的时间，-XX:StringTableSize=桶个数（最少设置为 1009 以上）
- 考虑是否需要将字符串对象入池，可以通过 intern 方法减少重复入池

### 直接内存

#### 定义

Direct Memory

- 常见于 NIO 操作时，用于数据缓冲区
- 分配回收成本较高，但读写性能高
- 不受 JVM 内存回收管理

将系统缓冲区和java堆缓冲区合并为一个直接缓冲区。

#### 释放

必须通过`unsafe.freMemory`手动释放。

- 使用了 Unsafe 类来完成直接内存的分配回收，回收需要主动调用freeMemory 方法
- ByteBuffer 的实现内部使用了 Cleaner（虚引用）来检测 ByteBuffer 。一旦ByteBuffer 被垃圾回收，那么会由 ReferenceHandler（守护线程） 来调用 Cleaner 的 clean 方法调用 freeMemory 来释放内存

```java
// 创建1KB的直接内存
ByteBuffer byteBuffer = ByteBuffer.allocateDirect(1024);

// 释放过程
// 1. 
public static ByteBuffer allocateDirect(int capacity) {
    return new DirectByteBuffer(capacity);
}

// 2.
DirectByteBuffer(int cap) {   // package-private
    ...
    base = unsafe.allocateMemory(size); // 申请内存
    ...
    unsafe.setMemory(base, size, (byte) 0);
	...
    cleaner = Cleaner.create(this, new Deallocator(base, size, cap)); // 通过虚引用，来实现直接内存的释放，this为虚引用的实际对象, 第二个参数是一个回调，实现了 runnable 接口，run 方法中通过 unsafe 释放内存。
    att = null;
}

// 3. Cleaner内部clean方法
 public void clean() {
        if (remove(this)) {
            try {
            // 都用函数的 run 方法, 释放内存
                this.thunk.run();
            } catch (final Throwable var2) {
                ...
            }

        }
    }
public void run() {
    if (address == 0) {
        // Paranoia
        return;
    }
    // 释放内存
    unsafe.freeMemory(address);
    address = 0;
    Bits.unreserveMemory(size, capacity);
}

```

一旦加入如下参数`-XX:+DisableExplicitGC`，便会禁用手动GC，那么最好在直接内存使用完毕采用`unsafe.freeMemory`释放内存。



## 垃圾回收

### 判断对象是否回收

#### 引用计数法

当一个对象被引用时，就当引用对象的值加一，当值为 0 时，就表示该对象不被引用，可以被垃圾收集器回收。

弊端：当两个对象循环引用时，两个对象的计数都为1，导致两个对象都无法被释放。

#### 可达性分析算法

- JVM 中的垃圾回收器通过可达性分析来探索所有存活的对象
- 扫描堆中的对象，看能否沿着 GC Root 对象为起点的引用链找到该对象，如果找不到，则表示可以回收
- 可以作为 GC Root 的对象
  - 虚拟机栈（栈帧中的本地变量表）中引用的对象。
  - 方法区中类静态属性引用的对象
  - 方法区中常量引用的对象
  - 本地方法栈中 JNI（即一般说的Native方法）引用的对象

### 四种引用

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/f74e4526e1f2716424795fee2d36314b.png" alt="image-20230812205436819" style="zoom:50%;" />

- 强引用
  只有所有 GC Roots 对象都不通过【强引用】引用该对象，该对象才能被垃圾回收
- 软引用（SoftReference）
  仅有软引用引用该对象时，在垃圾回收后，内存仍不足时会再次出发垃圾回收，回收软引用对象
  可以配合引用队列来释放软引用自身
- 弱引用（WeakReference）
  仅有弱引用引用该对象时，在垃圾回收时，无论内存是否充足，都会回收弱引用对象
  可以配合引用队列来释放弱引用自身
- 虚引用（PhantomReference）
  必须配合引用队列使用，主要配合 ByteBuffer 使用，被引用对象回收时，会将虚引用入队，
  由 Reference Handler 线程调用虚引用相关方法释放直接内存
- 终结器引用（FinalReference）
  无需手动编码，但其内部配合引用队列使用，在垃圾回收时，终结器引用入队（被引用对象暂时没有被回收），再由 Finalizer 线程通过终结器引用找到被引用对象并调用它的 finalize 方法，第二次 GC 时才能回收被引用对象。

### 垃圾回收算法

#### 标记清除

特点：

- 速度较快
- 会产生内存碎片

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/891a2a5cecb99b757c1181708d9a3e47.png" alt="image-20230812205607088" style="zoom:50%;" />

#### 标记整理

特点：

- 速慢
- 无内存碎片

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/89ccb0b1fb62debdb425ad2947b5411b.png" alt="image-20230812205702464" style="zoom:50%;" />

#### 复制

特点：

- 无内存碎片
- 需要占用两倍内存

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/a73d36ea87862d87036e63a4c374935e.png" alt="image-20230812205805800" style="zoom:50%;" />

实际上是上面的算法都会使用，在不同的场景下各有优点。

## 分代垃圾回收

from：s0

to：s1

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/138ba9d601023913b9df4c381a916b00.png" alt="image-20230812205941454" style="zoom:50%;" />

过程：

- 新创建的对象首先分配在 eden 区
- 新生代空间不足时，触发 minor gc ，eden 区 和 from 区存活的对象使用 - copy 复制到 to 中，存活的对象年龄加一，然后交换 from to
- minor gc 会引发 stop the world，暂停其他线程，等垃圾回收结束后，恢复用户线程运行
- 当幸存区对象的寿命超过阈值时，会晋升到老年代，最大的寿命是 15（4bit）（不同JVM决定）
- 当老年代空间不足时，会先触发 minor gc，如果空间仍然不足，那么就触发 full fc ，停止的时间更长！

注意

- 从新生代到老年代不是一定要到年龄，会根据当前内存压力的大小决定是否直接晋升

|      **含义**      |                           **参数**                           |
| :----------------: | :----------------------------------------------------------: |
|     堆初始大小     |                             -Xms                             |
|     堆最大大小     |                 -Xmx 或 -XX:MaxHeapSize=size                 |
|     新生代大小     |      -Xmn 或 (-XX:NewSize=size + -XX:MaxNewSize=size )       |
| 幸存区比例（动态） | -XX:InitialSurvivorRatio=ratio 和 -XX:+UseAdaptiveSizePolicy |
|     幸存区比例     |                   -XX:SurvivorRatio=ratio                    |
|      晋升阈值      |              -XX:MaxTenuringThreshold=threshold              |
|      晋升详情      |                -XX:+PrintTenuringDistribution                |
|       GC详情       |               -XX:+PrintGCDetails -verbose:gc                |
| FullGC 前 MinorGC  |                  -XX:+ScavengeBeforeFullGC                   |

## 垃圾回收器

### 串行

**特点**：

- 单线程
- 堆内存较少，适合个人电脑

![image-20230812221210541](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/0030f52d5e63831679e4abb53a9f2bd1.png)

**安全点**：让其他线程都在这个点停下来，以免垃圾回收时移动对象地址，使得其他线程找不到被移动的对象，因为是串行的，所以只有一个垃圾回收线程。且在该线程执行回收工作时，其他线程进入阻塞状态

#### Serial 收集器

单线程、简单高效（与其他收集器的单线程相比），采用复制算法。对于限定单个 CPU 的环境来说，Serial 收集器由于没有线程交互的开销，专心做垃圾收集自然可以获得最高的单线程收集效率。收集器进行垃圾回收时，必须暂停其他所有的工作线程，直到它结束（Stop The World）！

#### ParNew 收集器

ParNew 收集器其实就是 Serial 收集器的多线程版本

特点：

多线程、ParNew 收集器默认开启的收集线程数与CPU的数量相同，在 CPU 非常多的环境中，可以使用 -XX:ParallelGCThreads 参数来限制垃圾收集的线程数。和 Serial 收集器一样存在 Stop The World 问题

#### Serial Old 收集器

Serial Old 是 Serial 收集器的老年代版本

特点：

同样是单线程收集器，采用标记-整理算法

### 吞吐量优先

特点：

- 多线程
- 堆内存较大，多核 cpu
- 让单位时间内，STW 的时间最短

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/352fffbb908a770e2d9aa19e650467fb.png" alt="image-20230812221319868" style="zoom:67%;" />

#### Parallel Scavenge 收集器

与吞吐量关系密切，故也称为吞吐量优先收集器

**特点**：

属于新生代收集器也是采用复制算法的收集器（用到了新生代的幸存区），又是并行的多线程收集器（与 ParNew 收集器类似）
该收集器的目标是达到一个可控制的吞吐量。还有一个值得关注的点是：GC自适应调节策略（与 ParNew 收集器最重要的一个区别）

**GC自适应调节策略**：

Parallel Scavenge 收集器可设置 -XX:+UseAdptiveSizePolicy 参数。当开关打开时不需要手动指定新生代的大小（-Xmn）、Eden 与 Survivor 区的比例（-XX:SurvivorRation）、晋升老年代的对象年龄（-XX:PretenureSizeThreshold）等，虚拟机会根据系统的运行状况收集性能监控信息，动态设置这些参数以提供最优的停顿时间和最高的吞吐量，这种调节方式称为 GC 的自适应调节策略。

**Parallel Scavenge 收集器使用两个参数控制吞吐量**：

- XX:MaxGCPauseMillis=ms 控制最大的垃圾收集停顿时间（默认200ms）

- XX:GCTimeRatio=rario 直接设置吞吐量的大小

#### Parallel Old 收集器

Parallel Scavenge 收集器的老年代版本

特点：

多线程，采用标记-整理算法（老年代没有幸存区）

### 响应时间优先（CMS）

特点：

- 多线程
- 堆内存较大，多核 cpu
- 尽可能让 STW 的单次时间最短

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/90adca19b316548040aa966f4f01a9d8.png" alt="image-20230812221927380" style="zoom:67%;" />

#### CMS 收集器

Concurrent Mark Sweep，一种以获取最短回收停顿时间为目标的老年代收集器

**特点**：基于标记-清除算法实现。并发收集、低停顿，但是会产生内存碎片

**应用场景**：适用于注重服务的响应速度，希望系统停顿时间最短，给用户带来更好的体验等场景下。如 web 程序、b/s 服务
CMS 收集器的运行过程分为下列4步：

**初始标记**：标记 GC Roots 能直接到的对象。速度很快但是仍存在 Stop The World 问题。

**并发标记**：进行 GC Roots Tracing 的过程，找出存活对象且用户线程可并发执行。

**重新标记**：为了修正并发标记期间因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录。仍然存在 Stop The World 问题

**并发清除**：对标记的对象进行清除回收，清除的过程中，可能任然会有新的垃圾产生，这些垃圾就叫**浮动垃圾**由于CMS收集器无法处理“浮动垃圾”（Floating Garbage），有可能出现“Con-current Mode Failure”失败进而导致另一次完全“Stop The World”的Full GC的产生。同时，空间碎片过多时，将会给大对象分配带来很大麻烦，往往会出现老年代还有很多剩余空间，但就是无法找到足够大的连续空间来分配当前对象，而不得不提前触发一次Full GC的情况。

CMS 收集器的内存回收过程是与用户线程一起并发执行的，可以搭配 ParNew 收集器（多线程，新生代，复制算法）与 Serial Old 收集器（单线程，老年代，标记-整理算法）使用。