---
title: java集合类

order: 7
author: zzys
date: 2023-03-10
category:
- 面经
tag:
- 面试
- java集合类
- 八股
---

## Map

map常见的是HashMap、TreeMap、HashTable和ConcurrentHashMap。其中HashTable不常用，单线程使用HashMap，多线程使用ConcurrentHashMap。

### HashMap的长度为什么是2的幂次方

因为hashCode的范围是`-2^31~2^31-1`，加起来大概40亿的映射空间，内存存放不下，所以我们需要对长度进行取模处理。并且在`n == 2^n`的情况下，使用`hashCode & (n - 1)`是和`hashCode % n`相等的，加快运算速度。 

### HashMap的hash方法

hash方法是用来在一个元素加入map时，确定其位置时使用的方法

```java
   // JDK1.8：
	static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
```

如果传入的对象是空，那么直接返回0。否则进行以下计算：

获取对象的hashcode并和hashcode的算术右移十六位进行异或。这两步是进行了扰动计算，在put之前调用此方法，目的是为了将高十六位也加入到特征计算中，防止在hash位置时只有低位的特征，尽可能的减少哈希冲突的概率，同时采用异或是为了尽可能的保证高十六位的特性，避免像与和或运算那样将计算结果靠拢0，1。

### HashMap的底层实现

JDK1.7之前是使用拉链法，即数组加链表解决哈希冲突，每当新插入的元素和旧的元素发生哈希冲突时，就插入到对应链表中。

JDK1.8后，在链表插入时，如果个数大于8个元素，会将链表转化为红黑树结构（中间会有一次判断，如果数组的长度小于64，那么会先选择扩容，而不是转换），减少搜索时间。`treeifyBin`是将链表转换为红黑树的方法 

### ConcurrentHashMap和HashTable

两者都实现了线程安全，Hash是在所有的方法上加入了synchronized，当一个线程插入时，其余线程无法插入，效率很低。

在JDK1.7前，ConcurrentHashMap是对底层数组进行了分段，对段数组进行加锁处理

## ArrayList

线程不安全，底层是`Object[]`，尾插`O(1)`，头插和任意插入是`O(n)`，实现了`RandomAccess`接口支持随机访问，每次扩容有可能会预留一定的空间，以空间换时间，减少分配次数。

### ArrayList 可以添加 null 值吗？

可以，但不建议，可能忘记判空处理

### ArrayList核心源码

![](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/553856791c3ee1774ca7167f1f8de27f.jpg)

