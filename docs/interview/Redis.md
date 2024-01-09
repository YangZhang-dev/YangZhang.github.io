---
title: Redis面经

order: 1
author: zzys
date: 2023-12-02
category:
- 面经
tag:
- 面试
- redis
- 八股
---

## Lua脚本的原子性如何保证

由于Redis中执行命令是使用的单线程模型，所以在执行当前Lua脚本时，不会执行其他的脚本或命令，也就间接的保证了原子性，类似于数据库的可串行化，但是一部分执行成功，其他部分失败后无法回滚。

## Redis数据结构

string hash set zset list bitmap hyperloglog geospatial

底层数据结构、优缺点、应用场景