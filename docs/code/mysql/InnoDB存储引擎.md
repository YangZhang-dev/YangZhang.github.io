---
title: 存储引擎

order: 1
author: zzys
date: 2023-09-09
category:
- 笔记
tag:
- MySQL
- 事务
---

本章介绍有关于MySQL存储引擎的相关知识。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/2a490a89b2cf3dd239d991810dcb99b2.png" alt="image-20230813214128532" style="zoom:67%;" />

## 存储引擎简介

存储引擎就是存储数据，建立索引，更新查询数据等计数的实现方式。存储引擎时基于表的，而不是库。所以也被称为表类型。

创建表时指定存储引擎：

```sql
-- 默认innodb
create table xxx (
	...
)ENGINE=INNODB;

-- 查询可用的引擎
show engines;
```

## InnoDB

特点：

- 事务
- 外键
- 行级锁

文件格式：table.ibd,存储该表的结构，数据和索引。

### 逻辑存储结构

![image-20230906171525655](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/daf439bfd70ed25d96aa200d1e5428b8.png)

![image-20230909164021758](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/6cf94ae1b575cb535dfb832f89e613b1.png)

### 架构

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/c41b518a7805fe7d6dd0ee4ecaa3a2ad.png" alt="image-20230909164110673" style="zoom:67%;" />

左侧是内存架构，右侧是磁盘架构。

#### 内存架构

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/38ee7648bb396e732485e30471e66fe5.png" alt="image-20230909164250749" style="zoom:67%;" />

![image-20230909164345538](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/d852ce2ca111ba153aaa56a2486ef195.png)

![image-20230909164411087](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/7b44aeecc50038ecb76642c36d4f836a.png)

![image-20230909164435062](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e88621eb2c627c6648af79ffa87682c3.png)

#### 磁盘架构

![image-20230909164837187](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/dad9ad46fc838c4d4679b82447d9f092.png)

![image-20230909164855802](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/465b6aeb18da76602d6241fb5c3d9e40.png)

![image-20230909165000920](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/39d3b2d41b7120cd9621d239939d2370.png)

#### 后台线程

![image-20230909165104103](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/b69a2a2030911a75c787645b048dbcbb.png)

### 事务原理

![image-20230909165200548](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e73fc73bc539e86c4a51487720ef2709.png)

#### redo log

![image-20230909165414548](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ffaa3a80ccd8b811ab915eb4898fb0bd.png)

#### undo log

![image-20230909165526386](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e346b0ea269a6c0f12dd1ad82b60271f.png)

### MVCC

![image-20230909165931909](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/d76d77384b8f1a25ea23db6e92ed4dba.png)

#### 原理

![image-20230909170112305](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/7f6cb5156e5c77be62deaab735911eb9.png)

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/5c47230d11333debff16808c0afb425a.png" alt="image-20230909170217209" style="zoom:67%;" />

![image-20230909170257042](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/9ca662c13caf032b14a1112e07881249.png)

![image-20230909170950358](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/1c5eab10f1b68036bb5ca610f5bed3a2.png)

![image-20230909170358757](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/5a721e66c68ac14215860f630d0960d1.png)