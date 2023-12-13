---
title: enum

order: 6
author: zzys
date: 2023-12-1
category:
- 笔记
tags:
- enum
- java基础
---

刚学习Java时，一直不知道Enum的底层是什么原理，今天就一探究竟。

[设计山寨枚举](https://www.yuque.com/bravo1988/java/pkloou)

## 自定义枚举

```java
@Getter
class MyEnum {
    // static 代表是类变量，final防止外界更改引用。
    public static final MyEnum ONE;
    public static final MyEnum TOW ;
    public static final MyEnum THREE;
    public static final MyEnum[] VALUES;

    static {
        ONE = new MyEnum(1,"one");
        TOW =  new MyEnum(2,"tow");
        THREE = new MyEnum(3,"three");
        VALUES = new MyEnum[]{ONE,THREE,THREE};
    }
    // private 防止外界更改类变量的内部值。
    private final Integer code;
    private final String desc;
    
    // 只有私有构造，无法创建对象，单例模式
    private MyEnum(Integer code,String desc) {
        this.code = code;
        this.desc = desc;
    }

    // 根据code获取desc
    public static MyEnum of(Integer code) {
        for (MyEnum value : VALUES) {
            if(value.getCode().equals(code)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid Enum code:" + code);
    }
    // 根据desc获取code
    public static String getDescByCode(Integer code) {
        for (MyEnum value : VALUES) {
            if (value.getCode().equals(code)) {
                return value.getDesc();
            }
        }
        throw new IllegalArgumentException("Invalid Enum code:" + code);
    }
}

public class Test {
    public static void main(String[] args) {
        print(MyEnum.TOW);
        // 以下三行无法通过编译
        MyEnum.THREE = new MyEnum(); // 类变量时final，无法更改引用
        MyEnum.ONE.code = 1;  // 实例属性code为private，无法更改值
        print(new MyEnum());  // 构造函数为private，无法创建新的对象
    }
    public static void print(MyEnum myEnum) {}
}
```

通过上面的代码，就已经实现了一个简易版的Enum，其中不难发现，对于MyEnum类，内部限定了一些固定的对象，也就是在调用print方法时，我们只能够传入内部给好的类，这和JDK的Enum已经十分相似了。

## Enum底层

```java
@AllArgsConstructor
@Getter
enum RealEnum {
    ONE(1,"one"),
    TOW(2,"tow");
    private Integer code;
    private String desc;
}
```

我们来看看短短几行的Enum类在底层是什么样子的：

```txt
// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Test.java

package com.zzys.enums;


final class RealEnum extends Enum
{

    public static RealEnum[] values()
    {
        return (RealEnum[])$VALUES.clone();
    }

    public static RealEnum valueOf(String name)
    {
        return (RealEnum)Enum.valueOf(com/zzys/enums/RealEnum, name);
    }

    private RealEnum(String s, int i, Integer code, String desc)
    {
    	// 多了两个字段，传给了Enum类
        super(s, i);
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode()
    {
        return code;
    }

    public String getDesc()
    {
        return desc;
    }

    public static final RealEnum ONE;
    public static final RealEnum TOW;
    private Integer code;
    private String desc;
    private static final RealEnum $VALUES[];

    static 
    {
    	// 比我们多了两个字段
        ONE = new RealEnum("ONE", 0, Integer.valueOf(1), "one");
        TOW = new RealEnum("TOW", 1, Integer.valueOf(2), "tow");
        $VALUES = (new RealEnum[] {
            ONE, TOW
        });
    }
}
```

我们可以发现，基本和我们的简易Enum一模一样，除了它多出来了两个成员变量，很明显，第一个是我们的枚举名字，第二个是枚举序号。那么为什么要传这两个参数呢？

我们知道，下面的写法也是正确的：

```java
@AllArgsConstructor
@Getter
enum RealEnum {
    ONE,
    TOW
}
```

我们知道创建枚举的原因就是为了创建一个特征性的类，并且能够保存多维度的信息。如果没有多出来的两个参数，在上面的情况中，我们存取是正常的，但是没有了特征描述，失去了枚举的意义。