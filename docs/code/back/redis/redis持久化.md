---
title: redis持久化

author: zzys
date: 2023-10-19
category:
- 笔记
tag:
- redis
- 实战
---

Redis有两种持久化方式：

- RDB：全量备份，相当于是为Redis做了数据快照

- AOF：追加备份

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/a11230b3ad7368fb878d4aa7fba6c683.png" alt="image-20210725151940515" style="zoom:67%;" />

## RDB

RDB全称Redis Database Backup file（Redis数据备份文件），也被叫做Redis数据快照。简单来说就是把内存中的所有数据都记录到磁盘中。当Redis实例故障重启后，从磁盘读取快照文件，恢复数据。快照文件称为RDB文件，默认是保存在当前运行目录。

[Redis持久化策略—RDB](https://zhuanlan.zhihu.com/p/443951927)

### 执行时机

- 执行save命令，**阻塞**

- 执行bgsave命令，**非阻塞**

- Redis停机时

- 触发RDB条件时

  `save 900 2`：当900秒内有两个key被改变，则执行RDB备份。

### bgsave原理

利用了操作系统的fork函数，启用子进程对数据进行备份，其中牵涉到了COW技术： [COW-写时复制](..\..\sundry\COW-写时复制.md) 

父子进程共享一块只读数据，当主进程接收到修改命令后，拷贝出一个数据副本（实际是以页表为单位）对其进行修改。

![image-20210725151319695](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/49cc88c188890cbc83cfe5d8cfa1ca74.png)

### 缺点

- RDB执行间隔时间长，两次RDB之间写入数据有丢失的风险
- fork子进程、压缩、写出RDB文件都比较耗时

### 配置

```conf
# 是否压缩 ,建议不开启，压缩也会消耗cpu，磁盘的话不值钱
rdbcompression yes

# RDB文件名称
dbfilename dump.rdb  

# 文件保存的路径目录
dir ./ 

# 执行策略
save 900 1
```

## AOF

AOF全称为Append Only File（追加文件）。Redis处理的每一个写命令都会记录在AOF文件，可以看做是命令日志文件。

[从底层彻底吃透AOF技术原理](https://zhuanlan.zhihu.com/p/407031491)

### 文件重写

对于重复的key修改，大部分情况下可以压缩为一条命令，Redis会根据不同的策略来进行文件重写。由于是模拟快照的过程，因此在重写AOF文件时并没有读取旧的AOF文件，而是将整个内存中的数据库内容用命令的方式重写了一个新的AOF文件。

### 配置

```conf
# 是否开启AOF功能，默认是no
appendonly yes
# AOF文件的名称
appendfilename "appendonly.aof"

# 执行AOF的三种策略

# 表示每执行一次写命令，立即记录到AOF文件
appendfsync always 
# 写命令执行完先放入AOF缓冲区，然后表示每隔1秒将缓冲区数据写到AOF文件，是默认方案
appendfsync everysec 
# 写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘
appendfsync no

# AOF文件比上次文件 增长超过多少百分比则触发重写
auto-aof-rewrite-percentage 100
# AOF文件体积最小多大以上才触发重写 
auto-aof-rewrite-min-size 64mb 
```

![image-20210725151654046](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/8992d07f1a35e0d9bc86939be07ca67a.png)

### 缺点

如果开启每次命令刷盘，那么会大大的降低效率。体积较大，恢复效率较慢。
