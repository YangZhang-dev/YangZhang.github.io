---
title: Backup-VMware

order: 3
author: zzys
date: 2023-09-22
category:
- 笔记
tag:
- 分布式
- backup
---

本节主要讲的是主从复制之间的细节以及VMware如何做的。

## Backup

为了提高系统的容错能力，通常会采用主从复制的技术，即有两个或多个机器，分出主从，维护它们之间的状态同一，当主服务器出现崩溃时，可以再次选取一个从服务器代替。（同时可以通过这一特点做读写分离，不过要考虑一致性的问题）。

### 复制失败场景

- fail-stop failure：计算机停止工作：断电，地震等。
- logic bugs：复制逻辑问题或配置异常，无法通过系统自动恢复。
- malicious errors：在这里假设所有的机器都是可信的，没有对伪造者进行判别。

在这里只通过复制技术处理第一种的失败情况。

### 难点

- 如何判断primary失败？
  - 无法区分是网络分区还是机器故障。
  - 如果是网络分区，primary有可能还在和client交流。在这时如果又选出一个primary，就会出现**脑裂**（split-brain）场景，这样数据的一致性就无法得到保证，服务器之间就会出现状态的各种不一致。
- 如何主从同步：
  - 保证所有操作按照正确的顺序被处理。
  - 避免或解决非决定论（如获取当前时间）。
- 故障转移：希望在进行主备切换时，能够使primary完成自己的client响应。

### 主备复制

有两种主备复制选项：

- **状态转移**（state transfer）：在primary响应client之前，将checkpoint同步到backup上。
- **复制状态机**（replicated state machine，RSM）：和上面的类似，只是同步的不再是状态，而是操作。

通常采用第二种，第一种有可能产生多种状态，增大网络消耗。

> 不可以直接将client发至backup上：因为对于不确定的操作，两个机器会产生不一样的结果。而对于复制状态机方案，由分布式系统内部设计解决该问题。

### 复制操作级别

- application-level-operations：即在主从之间传递应用层面的消息。
- machine-level-operations：即传递的是机器级别的指令。

## VM-FT

虚拟化复制对应用程序透明，能够提供很强的一致性（可以见得它的性能应该不咋地）。



<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ce9a032c6337e31a8be574a501768b0d.png" style="zoom: 80%;" />

### 组成部分

#### hypervisor

虚拟监视器，当硬件产生中断（网络包，定时器）时会对中断进行捕捉处理。

对于数据包到达中断，primary会将其通过log channel将其传递给backup，对于无状态的应用程序，使用确定性的指令，并输入相同的输出，最后的结果是相同的。这样就保证了数据的一致性。

当backup接收到消息后，会立即返回ack，然后backup的hypervisor将数据包传递给backup的VM，然而当backup的程序运行完毕后向虚拟网卡发送数据包时，hypervisor会判断自己是backup，就不会将数据包传递给物理网卡。

当primary处理完毕后，必须等到backup的ack后才能对client做出响应，这被称为**输出规则**（output rule）。一旦backup成功收到信息，崩溃之后就可以通过checkpoint保障数据一致性。

#### server

在仲裁服务器中，用于存储和判断谁是primary。flag初始化为0，当多台服务器竞争primary时，用到了[test-and-set](../../basic/ostep/ostep-concurrency.md#硬件原语)来进行选举primary。何时设置为0：

- 系统初始化时。
-  primary故障，多backup竞争时，手动设置为0。

#### log channel

log channel是最为重要的组件，在保证数据的一致性时，就使用到了log channel。

假设在运行的应用程序的指令都是确定含义的状态下，它可以工作的很好，但是对于非确定性含义的指令，会带来灾难。对于获取当前时间指令，主从不可能做到完全一致，这样就可能影响到一致性的保证。

同时，两台不同的主机，时钟中断也是不同的，同样会造成状态不一致。

#### disk

在论文中，disk的设计分为两种：

- 主从共用：实际上只有primary进行写入。
- 主从分离：各自写入，但是在初始化阶段需要同步disk。

### 差异来源

- 网络包中断，定时器中断
- 非确定性的指令
- 多核：对于多线程的资源争夺，不同的计算机的结果可能是不同的，VM-FT只是简单的禁用了多核。

### 处理中断

出处：[参考笔记](https://ashiamd.github.io/docsify-notes/#/study/分布式策略/MIT6.824网课学习笔记-01)

这里VM-FT是这样处理的，当接受到中断时，VM-FT能知道CPU已经执行了多少指令（比如执行了100条指令），并且计算一个位置（比如100），告知backup之后在指令执行到第100条的时候，执行中断处理程序。大多数处理器（比如x86）支持在执行到第X条指令后停止，然后将控制权返还给操作系统（这里即虚拟机监视器）。

 通过上面的流程，VM-FT能保证primary和backup按照相同的指令流顺序执行。当然，这里backup会落后一条message（因为primary总是领先backup执行完需要在logging channel上传递的消息）。

### 处理非确定性指令

 出处：[参考笔记](https://ashiamd.github.io/docsify-notes/#/study/分布式策略/MIT6.824网课学习笔记-01)

在启动Guest space中的Linux之前（boot），先扫描Linux中所有的非确定性指令，确保把它们转为无效指令(invalid instruction)。

当Guest space中的Linux执行这些非确定性的指令时，它将控制权通过trap交给hypervisor，此时hypervisor通过导致trap的原因能知道guest在执行非确定的指令，它会模拟这条指令的执行效果，然后记录指令模拟执行后的结果，比如记录到寄存器a0中，值为221。

而backup备机上的Linux在后续某个时间点也会执行这条非确定性指令，然后通过trap进入backup的hypervisor，通常backup的hypervisor会等待，直到primary将这条指令模拟执行后的结果同步给自己(backup)，然后backup就能和primary在这条非确定性指令执行上拥有一致的结果。

VM-FT paper：[The design of a practical system for fault-tolerant virtual machines (mit.edu)](http://nil.csail.mit.edu/6.824/2021/papers/vm-ft.pdf)。
