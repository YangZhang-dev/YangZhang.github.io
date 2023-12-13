---
title: ostep-virtualization-cpu

order: 1
author: zzys
date: 2023-08-08
category:
- 笔记
tag:
- 操作系统
- 虚拟化
---

本章主要讲了虚拟化CPU。

## 进程抽象

错觉：在多程序运行的情况下，为何感觉上有无数的CPU可供使用？

OS通过虚拟化（virtualizing）CPU来提供这种错觉。其中使用了**分时**（time shareing）技术保证用户可以同时运行多道程序。但是它潜在的问题是性能，每个程序需要更多的时间去执行。

为了实现这种虚拟化，OS需要**底层的机械机制**（low-level machinery **mechanisms**）和**智能的策略**（ high-level **policies**）。

底层机械机制通常指的是构建底层的一些方法或协议去实现一部分需要的功能，例如**上下文切换**（context switch）。智能策略指的是能够帮助OS做出更好的抉择的一些算法，如**调度算法**（scheduling policy），决定当前执行哪个程序。

### 进程

将操作系统为运行中的程序提供的抽象称之为**进程**（Process）。

**机器状态**（machine state）： what a program can read or update when it is running.At any given time, what parts of the machine are important to the execution of this program?

进程的机器状态通常通过观察内存（memory），寄存器（registers），持久化设备（ persistent storage devices）例如I/O。

### 进程 API

- create
- destroy
- wait
- miscellaneous control
- status

fork,exec,wait,kill...

###  进程的创建

将dist中的可执行程序变成进程，需要将程序和一些静态数据从disk中取出加载到主存中。注意在现代操作系统中，程序通常是**懒加载**（lazily）的，不会将所有代码一下全部加载进内存中。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/46dc522656902c7d2415b79437d85054.png" alt="image-20230808160556598" style="zoom:50%;" />

在加载过程中，OS还需要做很多事。

首先是为进程分配**运行时栈**（run-time stack），它保存了返回地址，本地变量，以及函数参数，有时还会用函数参数初始化堆栈。

其次还需要为程序初始化**堆**（heap），在C中，它保存着显示动态请求的内存（malloc，free）

同时还需要初始化有关I/O的信息。例如对于从命令行读取或打印在屏幕上。

在执行完初始化操作后，OS就会在入口点处（main）去启动程序，将控制权交给进程。

### 进程的状态

对于进程的状态，简化后的形式将其分为三种：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/b9e0294188c01f11c530c358c38e7757.png" alt="image-20230808162904400" style="zoom:50%;" />

Running<--->Ready之间是由OS的调度机制决定。在运行中的程序如果发生了阻塞（如I/O）不在需要CPU，那么就会进入Blocked状态，直到有一些事件触发，就会重新回到Ready状态等待调度。

### 数据结构

OS和其他进程一样也有自己的内存数据结构，最基础的就是**进程列表**（process list），保留了处于各种状态的进程，并在特定的场合对其进行特定的操作。下面的代码是一个示例PCB。

```c
// the registers xv6 will save and restore
// to stop and subsequently restart a process
struct context {
    int eip;
    int esp;
    int ebx;
    int ecx;
    int edx;
    int esi;
    int edi;
    int ebp;
};
// the different states a process can be in
// 注意ZOMBIE僵尸线程：已经退出但还没有被清理的状态。
enum proc_state { UNUSED, EMBRYO, SLEEPING,
				RUNNABLE, RUNNING, ZOMBIE };
// the information xv6 tracks about each process
// including its register context and state
struct proc {
    char *mem; // Start of process memory
    uint sz; // Size of process memory
    char *kstack; // Bottom of kernel stack
    // for this process
    enum proc_state state; // Process state
    int pid; // Process ID
    struct proc *parent; // Parent process
    void *chan; // If non-zero, sleeping on chan
    int killed; // If non-zero, have been killed
    struct file *ofile[NOFILE]; // Open files
    struct inode *cwd; // Current directory
    struct context context; // Switch here to run process
    struct trapframe *tf; // Trap frame for the
    // current interrupt
};
```

> 进程控制块（Process Control Block）：用于存储进程信息的结构，每个进程都有一个对应的PCB
>
> [彻底搞懂孤儿/僵尸/守护进程](https://zhuanlan.zhihu.com/p/654235321)

## 受限的直接访问

在虚拟化CPU的过程中，会遇到两个矛盾点：性能以及控制，如何在OS保证对程序的控制的同时而不去增加过多的开销。在这里OS就需要使用一些硬件支持来完成任务。

###  直接访问

直接访问即让程序在CPU上直运行，流程如下图和上文进程的创建是很像的：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/dfe9cb24cc95acda1e4030c09fac30a8.png" alt="image-20230808173708296" style="zoom:67%;" />

但是这里就有两个问题：

- 操作系统如何能确保该程序不做任何我们不希望它做的事情，同时仍然有效地运行它。

- 操作系统如何在合适的事件阻止它运行并切换到另一个进程，从而实现虚拟化CPU所需的分时共享。

### 受限操作

上面的方式由于原生的运行在CPU上，速度很快，但是思考下面的场景，一个进程必须能够执行I/O（如读取或写入文件）和其他一些受限制的操作，但不可以拥有系统的完全控制。操作系统和硬件如何协同做到这一点？

所以在这里引出了一种新的处理器模式，称为**用户模式**（user mode）。在用户模式下运行的代码被限制在它所能做的事情上。例如，在用户模式下运行时，进程不能发出I/O请求；这样做会导致处理器引发异常；然后操作系统可能会杀死这个进程。

与用户模式相反的是**内核模式**（kernel mode），操作系统（或内核）运行在它中。在这种模式下，运行的代码可以做任何事情，包括特权操作，如发出I/O请求和执行所有类型的受限指令。

所以当用户进程希望执行某种特权操作时，比如从磁盘读取，它应该做什么？这里就借用了硬件支持用户程序**系统调用**（system call）。

要执行一个系统调用，一个程序必须执行一个特殊的**陷阱**（trap）指令。该指令同时跳入内核，并将特权级别提升到内核模式；一旦进入内核，系统现在就可以执行所需的任何特权操作（如果允许的话），从而为调用进程执行所需的工作。完成后，操作系统会调用一个特殊的**陷阱返回**（return-from-trap）指令，它会返回到调用用户程序中，同时将特权级别降低回用户模式。

当从用户态陷入内核态时，会将一些用户态的信息压入**内核栈**（kernel stack）中，设置栈指针寄存器的内容为内核栈的地址。从陷阱返回将把这些值从堆栈中弹出，将保存在内核栈里面的用户栈的地址恢复到堆栈指针寄存器，恢复用户态模式程序的执行。

> [内核堆栈和用户堆栈 小结 - Dormant - 博客园 (cnblogs.com)](https://www.cnblogs.com/dormant/p/5456491.html)

但是，硬件是怎么知道当用户态的程序陷入内核态时，需要执行那些代码呢？

内核会在引导式设置一个**陷阱表**（trap table）来实现这一点，操作系统做的第一件事是告诉硬件在某些异常事件发生时要运行哪些代码。例如，当硬盘中断发生、键盘中断发生或程序进行系统调用时，应该运行什么代码。一旦硬件被通知，它就会记住这些处理程序的位置，直到机器下次重新启动，因此当系统调用和其他异常事件发生时，硬件知道该做什么（即要跳转到什么代码）。

下图是对上面的描述：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e2f1eda2735093c7009fff30c17138a5.png" alt="image-20230808183342127" style="zoom: 67%;" />

用户态和内核态通过陷阱相连，由硬件控制整个过程。

### 上下文切换

下面一个问题就是实现对于进程之间的切换。这里首先引出一个问题，对于其他的程序占用CPU，也就意味着OS没有被运行。如何才能够使得OS重新获得CPU的使用权呢？

#### OS获取CPU使用权

一种是合作的方法，OS会信任程序可以合理的运行，并且可以周期性的放弃CPU占用，通常是在一个程序使用了系统调用（yield），陷入内核态时。或者是程序有非法行为，也会生成一个陷阱使得OS可以再次操作CPU。但是很明显，当程序陷入无限循环后，这种方式就失效了。

另一种是非合作的方式，**计时器中断**（timer interrupt），通过一个定时器设备，在每隔几毫秒会引起一次中断，当中断被引发时，当前程序停止运行，OS运行预先配置的**中断处理**（interrupt handler）程序，此时，操作系统就获取到了CPU的使用权。

和系统调用类似，在启动时OS必须通知硬件在中断时要执行哪些代码。同时启动计时器。

当中断发生时，硬件需要在中断发生时保存足够的程序的状态，以便后续返回指令将能够正确恢复运行的程序。这组操作非常类似于硬件在进入内核的显式系统调用陷阱期间的行为，各种寄存器因此被保存，因此很容易通过从陷阱返回的指令恢复。

#### 状态保存

在OS可以获取到CPU的使用权后，接下来就是上下文切换的问题了，如果操作系统决定要进行线程切换，为了保存当前运行的进程的上下文，操作系统将执行一些低级程序集代码来保存通用寄存器PC以及当前运行进程的内核栈指针，然后恢复将要执行进程的寄存器PC，并切换到内核堆栈指针。通过切换堆栈，内核进入在一个进程（被中断的进程）的上下文中调用switch代码，并在另一个进程的上下文（即将执行的上下文）中返回。当操作系统最终执行一个从陷阱返回的指令时，即将执行的进程将成为当前运行的进程。

在此过程中，有两种类型的寄存器保存/恢复。第一个是计时器中断发生时（普通的系统调用也会发生），在这种情况下，正在运行的进程的用户态信息（寄存器信息）由硬件**隐式保存到该进程的内核堆栈**。第二种情况是当操作系统决定从切换时；在这种情况下，是内核寄存器状态被软件（即操作系统）**显式**保存，**但这一次被保存到进程结构中的内存中**。

> 第一种寄存器变更并不算上下文切换，从始至终都是同一个进程在执行。

下图是对上面的总结：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/80690548a0146e36c58846bf36a07d03.png" alt="image-20230808220149243" style="zoom:50%;" />

所示红圈即为两次寄存器保存。

### 并发中断

有一种情况是当系统调用时触发中断或在中断时再次中断怎么办，操作系统可能会做的一件简单的事情是在中断处理过程中禁用中断；这样做可以确保当一个中断被处理时，没有其他的中断将被传递到CPU。

## 调度

在了解了底层机制后，就需要对高层的**调度策略**（scheduling policies）进行研究。这里需要引入衡量调度策略的指标。

### workload

对系统进程做出一些合理化假设，使得问题简化，称之为workload（找不到好翻译）。慢慢的完善假设，最终构建出一个**全面运行的调度规则**（fully-operational scheduling discipline）。

在这里将进程称之为**作业**（job），下面是对进程4个假设：

1. 每个作业运行所需要的时间都相同。 

2. 所有的工作都需要同时调用（同时到达）。 

3. 所有作业都只使用CPU（即不执行I/O) 

4. 每个作业的运行时长都是已知的。

### 调度指标

除了假设工作负载之外，还需要另外能够比较不同的调度策略：**周转时间**（**scheduling metric**）:

$ T_{turnaround} = T_{completion} − T_{arrival}$ 

即周转时间等于作业完成时间减去作业到达时间。很明显它是一个性能指标。

另一个重要的指标是**公平性**（fairness），调度器可以优化性能，但以阻止一些作业运行为代价，从而降低公平性。所以公平性和性能通常是不一致的。

### FIFO

FIFO，即先到先服务、先进先出，在当前的假设下，它即容易实现，又工作的很好，对于如下的情况：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/9df470027b36de582c1a9e06305ac754.png" alt="image-20230809143946335" style="zoom: 67%;" />

可以计算出**平均周转时间**（average turnaround time）为

$(10+20+30)/3=20$

那么现在去掉假设一，每个程序运行所需的时间不相同，这样就会出现一些问题：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/599ec312cdfd2e8bbdfd15752be90055.png" alt="image-20230809144307112" style="zoom:50%;" />

如果先到达的程序需要运行的时间较长，平均周转时间就会增长到110，这种情况称之为**护航效应**（convoy effect）。

### Shortest Job First

SJF，即最短作业优先，很简单，就是所需最短时间的作业先执行，这样作业的排列顺序就如下图：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/d00f386680e698f8f8076ac726662fa8.png" alt="image-20230809144847221" style="zoom:50%;" />

平均周转时间从110降到了50。

那么现在去掉假设二，如果作业到达的顺序不同呢？A就有可能排到了最前面，那么周转时间又一次的逼近了110。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/88e9ee3db17596d752d2e1822cbaacb9.png" alt="image-20230809145150018" style="zoom: 50%;" />

###  Shortest Time-to-Completion First

STCF，即最短完成时间，由于上面已经有了关于计时器中断、上下文切换等底层机制，OS就可以决定在B、C到达时，是否**抢占**（preempt）作业A。如下图：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ee1b77c276ec16d98fc291842e0721d4.png" alt="image-20230809145720813" style="zoom:50%;" />

每当一个新作业进入系统时，它都会确定剩余的作业和新作业，它们谁剩下的时间最少，然后调度该作业。

这样又一次将平均周转时间降到了50。

但是现在又有一个指标被引入：**响应时间**（response time），由于分时机器的引入。现在，用户也会坐在终端前，要求系统的交互性能。响应时间按被定义为作业第一次被调度的时间减去到达时间。

$T_{response} = T{firstrun} − T{arrival}$

对于类似于STCF之类的调度算法，它对于响应时间时不敏感的。如果三个作业同时到达，第三个必须等待前两个作业结束后才可以被调度，尽管前两个的运行时间小于第三个，但也是不可控的。

###  Round Robin

RR，即轮询。RR不是运行作业完成，而是**时间片**（time slice），有时称为**调度量**（cheduling quantum），然后切换到运行队列中的下一个作业。它会重复这样做，直到作业完成。因此，RR有时被称为**时间分割**（time slicing）。在这里，时间片的长度必须是定时器中断周期的倍数；因此，如果计时器每10毫秒中断一次，则时间片可以是10、20或任何其他10 ms的倍数。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/9945a1ac6395d654c9252eae18bf7a98.png" alt="image-20230809151102682" style="zoom: 67%;" />

这样，响应时间就和时间片的长度呈正相关，时间片越短，响应时间越短。同时，上下文切换也越频繁，性能也将下降。

> CPU亲和性：上下文切换的成本并不仅仅来自于保存和恢复一些寄存器的操作系统操作。当程序运行时，它们在CPU缓存、TLB、分支预测器和其他片上硬件中建立了大量的状态。切换到另一个作业会导致刷新此状态，并引入与当前正在运行的作业相关的新状态，这可能会导致明显的性能成本上升。

但是，如果时间分片是1，对于上图的平均周转时间，就达到了14，相较于SJF的10，再加上上下文切换的成本，上升还是很大的。 这种就是公平和性能之间的权衡。

### Incorporating I/O

一个程序对于输入输出是必然需要的，当程序进行I/O时，是不占用CPU的，那么它就会被**阻塞**（blocked）等待I/O结束，这时，调度程序可能在CPU上调度下一个作业。如下图：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/131319c7a2658b82c051679394c50820.png" alt="image-20230809155336573" style="zoom: 67%;" />

当A在等待I/O时，调度系统将CPU的使用权交给B，当A阻塞结束后，重新进入调度中。也就是将A分成了一个一个的子作业。

对于最后一个假设，通过构建一个调度程序被称为**多级反馈队列**（multi-level feedback queue，MLFQ）来处理。

## 多级反馈队列调度

MLFQ试图解决的基本问题有两方面。它希望优化周转时间，并且最小化响应时间。

MLFQ有许多不同的**队列**（queue），每个队列都被分配了不同的**优先级**（priority level）。在任何给定的时间，准备运行的作业都在单个队列上。MLFQ使用优先级来决定在给定的时间应该运行哪个作业：选择具有更高优先级的作业（即在更高队列上的作业）来运行。同时，在相同优先级队列上的作业，使用RR调度。

因此，MLFQ调度的关键在于调度器如何设置优先级。MLFQ并没有给每个作业一个固定的优先级，而是根据其观察到的行为来改变作业的优先级。例如，如果一个作业在等待键盘输入时反复放弃CPU，MLFQ将保持其高优先级，因为这可能是交互过程的行为方式。相反，如果一个作业长时间集中使用CPU，MLFQ将降低其优先级。通过这种方式，MLFQ将尝试了解正在运行的进程，从而使用作业的历史记录来预测其未来的行为。

这样，就有了两条规则：

- **Rule 1:** If Priority(A) > Priority(B), A runs (B doesn’t).

- **Rule 2:** If Priority(A) = Priority(B), A & B run in RR.

那么在现在看来，MLFQ的状态有可能是下图：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/63643379e57705e830bad607d8ab436c.png" alt="image-20230809164430628" style="zoom:67%;" />

但是很显然由于规则一，C和D将不会被执行，会存在饥饿的问题。所以，引入第一次改变。

### 改变优先级

假设我们由两种作业，一种是短期的交互式作业（响应时间敏感），由于系统I/O，可能会放弃CPU使用。一种是CPU密集型的长时间占用CPU的CPU绑定型作业（对响应时间不敏感）。

下面引入两条规则：

- **Rule 3:** 当作业进入系统时，作业将处于最高优先级（最高队列）。

- **Rule 4a:** 如果作业在运行时耗尽了整个时间片，其优先级将降低（它向下移动一个队列）。

- **Rule 4b:** 如果作业在时间片出现之前放弃CPU，它保持在相同的优先级。

下面举三个例子：

1. CPU密集型作业：

   <img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/389245a9e1b98ee8d4cc52cfa0ddaf4b.png" alt="image-20230809165129748" style="zoom:67%;" />

2. 短暂性工作

   <img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/f3040642fe6b09f019d33ca9348499fe.png" alt="image-20230809165248274" style="zoom:67%;" />

   可以看到，当高优先级作业到达时，便会将CPU的使用权从低优先级作业中转移。

3. I/O操作

   <img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/19f9a268e09f38474a2137862a4e7d7f.png" alt="image-20230809165440269" style="zoom:67%;" />

   如果一个交互式作业做了大量的I/O（例如等待用户从键盘或鼠标输入），它将在其时间片完成之前放弃CPU。这样我们并不希望降低它的优先级。

但是现在还存在一些问题：

1. 当交互性作业过多时，底优先级的作业将永远无法执行，被称为**饥饿**（starvation）。

2. 不良用户将会利用4.a，4.b的规则，在时间片快要耗尽时，放弃CPU（I/O）以获得更高百分比的CPU时间。

3. 一个程序可能会随着时间的推移而改变其行为（由CPU密集转变为交互式）但是我们并没有优先级上升的方式。

### 优先级提升

这里可以使用最简单的方式：

- **Rule 5:** 经过一段时间段 $S$ 后，将系统中的所有作业移到最顶层的队列中。

这样就解决了上面的第一个和第三个问题，下面是例子：

1. 对于处在底层的作业，不会发生饥饿，长时间无法获取CPU使用

   <img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/3f32cc737b020bb90bf9aaf772a97def.png" alt="image-20230809170612513" style="zoom:50%;" />

2. 对于作业形式的转变，在优先级提升后，调度程序会根据规则4正确的对待。

   <img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/625abdd2dc3a828d9a5326101f9aa23d.png" alt="image-20230809170811674" style="zoom: 50%;" />

> S 的设置，称之为 **voo-doo constants**, If it is set too high, long-running jobs could starve; too low, and interactive jobs may not get a proper share of the CPU.

### 优化计算

针对欺骗问题，这里对CPU使用时间的计算进行了优化，有了以下规则：

- **Rule 4:** 一旦一个作业耗尽了给定级别的时间分配（不管它放弃了多少次），它的优先级就会降低（向下移动一个队列）。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/0f94d2cace30d61730d7aad750723422.png" alt="image-20230809171643621" style="zoom:67%;" />



> 在MLFQ调度中还出现了其他一些问题。一个大问题是如何参数化这样的调度器。例如，应该有多少个队列？每个队列的时间片应该有多大？为了避免饥饿和解释行为的变化，应该多久增加一次优先级？这些问题没有简单的答案，因此只有一些关于工作负载和后续调度器调优的经验才能导致令人满意的平衡。例如，大多数MLFQ变体允许在不同的队列中改变时间片长度。高优先级队列通常有较短的时间切片；毕竟，它们由交互式作业组成，因此在它们之间快速交替是有意义的（例如，10毫秒或更少毫秒）。相比之下，低优先级队列包含CPU绑定的长运行作业；因此，较长的时间片工作得很好（例如，100秒毫秒）。许多调度程序还有一些您可能会遇到的其他特性。例如，一些调度程序为操作系统的工作保留了最高的优先级；因此，典型的用户作业永远无法在系统中获得最高的优先级。有些系统还允许一些用户建议来帮助设置优先级；例如，通过使用命令行实用程序nice，您可以增加或减少作业的优先级（有些程度上），从而增加或减少作业在任何给定时间运行的机会。



## 比例份额调度

取代于上面的调度，**比例份额**（proportional share）调度会去保证每一个程序可以获取到一定百分比的CPU时间。最典型的例子是**彩票**（lottery）调度。

### 彩票数决定份额

彩票调度最基本的概念是**彩票**（tickets），它代表了一个程序应该接收到的资源共享，程序所拥有的彩票的百分比表示其对系统资源的份额。

例子：A和B程序，A有75张票，而B只有25张。因此，A获得75%的CPU，而B接收剩下的25%。彩票程序在每一次时间片结束后，进行选票，假设五次选票结果如下： 43，23，88，56，44 。那么调度结果就是：A、A、B、A、A。程序A获取到了CPU的80%的时间，随着竞争的时间加长，概率会越来越接近期望值。

> 彩票调度是基于**随机性**（randomness）的，随机性相比较于传统的调度有三个优势：
>
> - 随机通常可以避免出现像一个更传统的算法可能出现的难以处理的奇怪的边角情况行为。、
> - 随机也是轻量级的，需要很少的状态来跟踪替代方案
> - 随机性的速度可以相当快，需求越快，随机就越倾向于**伪随机**（pseudo-random）

### 彩票机制

第一种彩票机制是**彩票货币**（ticket currency），允许拥有一组彩票的用户以他们自己的某种货币，将彩票分给自己的不同工作。之后OS再自动将这种货币兑换为正确的全局彩票。

```
User A  -> 500 (A’s currency) to A1 -> 50 (global currency)
		-> 500 (A’s currency) to A2 -> 50 (global currency)
User B  -> 10 (B’s currency) to B1 -> 100 (global currency)
```

A将自己的彩票一般分给A1，一般分给A2。用户B将自己的彩票全部分给B1。随后OS就将所有的彩票统一处理，得到全局彩票值。

另一种机制是**彩票转换**（ticket transfer）：，一个进程可以临时将自己的彩票交给另一个进程。这种机制在客户端/服务端交互的场景中尤其有用。

最后一种是**彩票通胀**（ticket inflation）。利用通胀，一个进程可以临时提升或降低自己拥有的彩票数量。通胀可以用于进程之间相互信任的环境。在竞争环境中，进程之间互相不信任，这种机制就没什么意义。

### 实现

只需要一个不错的随机数生成器来选择中奖彩票和一个记录系统中所有进程的数据结构（一个列表），以及所有彩票的总数就可以实现彩票调度。假定我们用列表记录进程，如下图：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/b7858087076a3495d99108016e64a6e1.png" alt="image-20230811084048585" style="zoom: 80%;" />

下面是实现代码：

```c++
// 当前遍历到的值
int counter = 0;

// 使用一个随机数代表赢票值，范围是0到totaltickets
int winner = getrandom(0, totaltickets);

// 使用current遍历程序链表
node_t *current = head;

// 遍历程序，直到找到赢票属于哪一个程序
while (current) {
  counter = counter + current->tickets;
  if (counter > winner)
    break; // 找到赢票程序
  current = current->next;
}
// 赢票程序被调度
```

通常会将其优化，从更多的票排序向少的票，这样增大了在前面找到赢家的概率，降低了平均循环次数。

### 彩票机制的问题

这里考虑两个竞争的程序A、B，各自都有100张票，它们的运行时间分别是R1、R2 。**不公平衡量标准**（unfairness metric）U代表了它们之间的比例，通常将U趋近于1称之更加公平。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/c64b7784508fef9a4fdfa175fa7e2f0a.png" alt="image-20230811090526160" style="zoom:50%;" />

如上图，对于平均长度越短的程序之间的U值越小，代表着越不公平。也就是说彩票调度不会给我们带来精确的比例，特别是在短时间尺度上。

### 步长调度

步长调度（stride scheduling,）是一种确定性的公平共享调度器。它有两个值，一是**步长值**（stride value），这个值与票数值成反比（取各票数的一个较大公倍数/各票数）。二是**行程值**（pass value）。

当需要进行调度时，选择目前拥有最小行程值的进程，并且在运行之后将该进程的行程值增加一个步长。

```c++
current = remove_min(queue); // 选择行程值最小的进程
schedule(current); // 进行调度
current->pass += current->stride; // 将行程值加上步长值
insert(queue, current); // 放回队列
```

### 对比

彩票调度有一个步长调度没有的优势——**不需要全局状态**。

假如一个新的进程在步长调度执行过程中加入系统，应该怎么设置它的行程值呢？如果设置成0，新来的进程就独占CPU了。

彩票调度算法不需要对每个进程记录全局状态，只需要用新进程的票数更新全局的总票数就可以了。

因此彩票调度算法能够更合理地处理新加入的进程。

### 总结

彩票调度和步长调度并没有作为CPU调度程序被广泛使用，原因如下：

- 不能很好地适合I/O；
- 最难的票数分配问题并没有确定的解决方式，

比例份额调度程序只有在这些问题可以相对容易解决的领域更有用（例如容易确定份额比例）。例如在虚拟（virtualized）数据中心中，你可能会希望分配1/4的CPU周期给Windows虚拟机，剩余的给Linux系统，比例分配的方式可以更简单高效。

## 多处理器调度

现在计算机都是**多核处理器**（multiprocessor），所以要讨论一下**多处理器调度**（multiprocessor scheduling）。

实际上一个程序只是用一个CPU，多个CPU不会使得程序更快，所以代码中需要使用多线程才能发挥多核的更大优势。多线程应用程序可以将工作扩展到多个CPU上，因此在给定更多的CPU资源时运行得更快。

### 多处理体系架构

为了理解围绕多处理器调度的新问题，必须了解单cpu硬件和多CPU硬件之间的根本区别。这种差异集中在硬件缓存的使用上，以及如何跨多个处理器共享数据。

在具有单个CPU的系统中，只存在一个缓存：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/3195faa7eb0e894b33d04757f0dbb8ec.png" alt="image-20230811100213192" style="zoom:50%;" />

关于缓存的知识不再介绍。

当在多个CPU的时候，就会有**缓存一致性**（cache coherence）的问题。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/1ee0b1de4792d1d0c34743333acc7212.png" alt="image-20230811100132884" style="zoom:50%;" />

> 硬件提供的基本解决方案由硬件提供：通过监控内存访问，硬件可以确保基本上“正确的事情”发生，并保留单个共享内存的视图。在基于总线的系统上（如上所述）上做到这一点的一种方法是使用一种称为**总线窥探**（bus snooping）的旧技术。每个缓存通过观察连接到主内存的总线来注意内存更新。当CPU看到它在缓存中的数据项的更新时，它会注意到更改，并使它的副本失效（即从自己的缓存中删除它）或更新它（即将新值放入缓存中）。回写缓存使这变得更加复杂（因为对主存的写入直到以后才可见）。

### 同步

即使硬件已经做了很多对于缓存一致性的问题，软件程序仍然需要去保证共享数据的正确性。如锁，或者无锁并发（可以参见JUC文章）。很明显同步策略是一定会对效率产生影响的。

### 缓存亲和性

最后一个问题出现在构建多处理器缓存调度器时，称为缓存亲和性。当一个进程在一个特定的CPU上运行时，它会在CPU的缓存（和TLB）中建立一个相当多的状态。下次进程运行时，在相同的CPU上运行它通常是有利的，因为如果它的某些状态已经出现在该CPU上的缓存中了，它就会运行得更快。相反，如果每次在不同的CPU上运行一个进程，那么进程的性能将会更差，因为每次运行时都必须重新加载状态（注意，由于硬件的缓存一致性协议，它将在不同的CPU上正确运行）。因此，多处理器调度器在做出调度决策时应该考虑缓存亲和性，如果可能的话，它可能更倾向于将一个进程保持在同一个CPU上。

### 单队列调度

**单队列调度**（single queue multiprocessor scheduling）。SQMS即将所有的任务放入同一个队列，它无需花费太多的工作来选择现有的策略，并使其适应在多个CPU上工作。

SQMS的第一个问题是缺乏**可扩展性**（scalability），为了确保调度器在多个cpu上正确工作，开发人员将在代码中插入某种形式的锁定，如上所述。锁确保当SQMS代码访问单个队列（例如，查找下一个要运行的作业）时，会出现正确的结果。随着CPU的增加，对于单一锁的竞争会越来越激烈。

第二个问题是对于缓存亲和性支持度不高，有下面的一个任务队列：


<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/3a1e7d506a6656c14f4a8aa456d4f379.png" alt="image-20230811101740680" style="zoom: 67%;" />

着时间的推移，假设每个作业运行一个时间片，然后选择另一个作业，这里是一个跨cpu的可能的作业计划：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/0627e0f5fad69112db122993573a5ad5.png" alt="image-20230811101835983" style="zoom: 67%;" />

为了处理这个问题，大多数SQMS调度程序都包含了某种关联机制，如果可能的话，它试图使该进程更有可能继续在同一CPU上运行。具体来说，可能为一些工作提供亲和力，但移动其他工作以平衡负载。实现方案可能会很复杂，例如：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/a5212b13986ab0d6b5cc89e56bac83ed.png" alt="image-20230811102046826" style="zoom:67%;" />

因此，SQMS的方法也有其优缺点。给定一个现有的单cpu调度器，实现它很简单，根据定义，它只有一个队列。但是，它不能很好地伸缩（由于同步开销），并且不容易保持缓存亲和力。

### 多队列调度

对于每个CPU都有一个队列，将这种方法称为**多队列多处理器调度**（multi-queue multiprocessor scheduling）。

MQMS扩展性好，对于增加CPU，只需要为它增加对于的队列即可。同时，它在本质上也保证了缓存亲和性。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/d974f47be133df1ecb0bbd2c3b6aaf23.png" alt="image-20230811102535304" style="zoom:67%;" />

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/9cc9dc13d5fdc7588556e1022d356dab.png" alt="image-20230811102549192" style="zoom:67%;" />

但是MQMS可能会出现**负载不均衡**（ load imbalance）的问题。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/0e7850e821da9a2c9e78efc784549db7.png" alt="image-20230811102658160" style="zoom:67%;" />

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/b80fe406f1dfec5fd6b0fcd482d34d12.png" alt="image-20230811102709509" style="zoom:67%;" />

甚至还有可能CPU0没有任务，但是CPU1还有很多任务执行。

这时候就要移动作业。称之为**迁移**（migration）。通过将作业从一个CPU迁移到另一个CPU，可以实现真正的**负载平衡**（load balance）。

实现迁移策略的一种基本方法是被称为**工作窃取**（work stealing）的技术。作业不足的（源）队列会偶尔查看另一个（目标）队列，以查看其状态。如果目标队列（特别是）比源队列作业更多，那么源队列将从目标队列中“窃取”一个或多个作业，以帮助平衡负载。

一方面，如果经常查看其他队列，将遭受高开销和缩放困难。另一方面，如果不经常查看其他队列，那么就会面临严重的负载平衡的危险。



> linux多处理器调度：
>
> - O(1)：多队列，基于优先级的调度器类似于MLFQ
> - CFS：多队列，一种确定性的比例份额方法（更像是步长调度）
> - BFS：单队列，也是比例共享，但基于一个更复杂的方案，称为最早合格的虚拟截止日期优先
