---
title: JUC常见面试题

order: 1
author: zzys
date: 2023-12-04
category:
- 面经
tag:
- 面试
- JUC
- 八股
---

## 介绍一下CAS

CAS是compare and swap的简写，它实际上是硬件底层提供的原语，例如在intel的机器上是cmpxchg指令。CAS操作包含三个参数，内存地址，预期值，新值。如果预期值和实际值不相同则不做任何操作，否则修改为新值。这其中实际上体现到了乐观锁的思想，可以用来实现无锁并发。

在Java层面就是以Atomic打头的类，如AtomicInteger，其中有compareAndSet方法。

缺点：存在ABA问题。当并发量高时，CPU盲轮询情况严重。不能保证代码块的原子性。

## 说一下volatile

总线风暴
