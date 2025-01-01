---
title: ebpf杂记

order: 1
author: zzys
date: 2024-12-28
category:
- 笔记
tag:
- ebpf
- linux
---

**BPF** 是一个通用的内核框架，用于在内核中执行用户定义的程序，最初用于网络数据包过滤，后来扩展到很多其他领域。

**XDP** 是 BPF 在网络领域的一个特定扩展，它专注于优化网络数据包的处理，直接在网络接口的接收路径上运行，避免了传统网络协议栈的开销，从而提高了网络性能。

![](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/46a00b5bc4e062afc9aaee0c3f2d0351.png)