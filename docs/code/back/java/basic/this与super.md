---
title: this与super

order: 2
author: zzys
date: 2023-11-17
category:
- 技术成长
tags:
- 基础
- java
---

## this

对象是**数据**的承载体，类是**操作**的承载体。因为一些对象操作相同，所以抽象为类。类可以看作对象的模板，但其实类也可以看作对象，在jvm类加载后成为`Class`对象。

```java
class Student {
    private String name;
    public void study(Student this) {
        System.out.println(this.name);
    }
}
Student t = new Student();
t.study();
```

上面是伪代码，方法有**隐式参数**和**显式参数**的区分，隐参是方法名前的对象，显参是方法名后面的数值，静态方法没有隐参，所以在调用`t.study()`后，**t会作为隐式参数传入study方法中**。这样jvm在方法区中执行时才知道是哪个对象（数据）执行的方法。

查看编译后的字节码，果然，在`study`方法的本地变量表中出现了名字叫做`this`，类型为`Student`的引用。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/463a5dafb162aeeb756b1a3afecf30e5.png" alt="image-20231117171508400" style="zoom: 50%;" />

同样在构造函数中也存在隐式传参，如下

```java
class F {
    private int _i;
    public F(int i) {
        _i = i;
        System.out.println(_i);
        System.out.println(getClass().getName());
    }
}
class S extends F {
    public S(int i) {
        super(i); // 删掉这一行？
        System.out.println("S");
    }
}
// 1
// com.zzys.S
// S
```

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/03dce9fa7654ba87d87cf84fc028e988.png" alt="image-20231117172312361" style="zoom: 67%;" />

同时我们可以发现，在父类中使用`getClass()`返回的是子类，由此可以看出，**this是当前运行时的实例对象，无论是调用子类还是父类的方法**。只有当运行时类没有某个属性或方法时，才会向上（父类）寻找。

## super

还是上面的代码，同时可以发现，S继承于F，所以在S的构造函数中，必须在第一行只调用一次父类的构造函数。

对象的初始化：[对象初始化流程 --init 方法、cinit 方法_](https://blog.csdn.net/weixin_43935927/article/details/113852227)

> 1. 父类静态变量初始化 <cinit>
> 2. 父类静态语句块
> 3. 子类静态变量初始化
> 4. 子类静态语句块
> 5. 父类变量初始化 <init>
> 6. 父类语句块
> 7. 父类构造函数
> 8. 子类变量初始化
> 9. 子类语句块
> 10. 子类构造函数

如果删掉第11行，就会报错。因为当S的构造函数不写`super()`时，会默认调用无参的`super()`，也就是会默认调用F的无参构造，但F并没有提供无参构造。

下面的子类不显示的指明`super`，同时父类有两个构造函数，如下：

```java
class F {
    private String name;
    public F() {
        System.out.println(this.getClass().getName());
    }
    public F (String name) {
        this.name = name;
    }
}
class S extends F {
    public S() {
        System.out.println(this.getClass().getName());
        System.out.println(super.getClass().getName());
    }
}
// com.zzys.S
// com.zzys.S
// com.zzys.S
```

通过字节码可知，super还是会隐式的调用父类的无参构造函数。

![image-20231117173010965](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e187e5ba640813cafaf82d13e00b2cd3.png)

对于`super`关键字来说，它起到的作用是调用父类方法，但是对于`getClass()`方法却有点特殊。

我们会发现，在子类中调用`super.getClass().getName()`竟然返回的也是子类的名称。原因是`getClass`是顶级类`Object`类所拥有的，并且是`final`修饰的，子类无法继承修改，所以无论`S`还是`F`都会到`Object`类中执行，而根据`getClass`源码可知：

**Returns the runtime class of this Object.** 

`getClass`方法会返回当前运行时类的Class，就可以明白为什么都是子类的名称了。

同样字节码如下：

![image-20231117173206229](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/935fd26fe020d75224cf37f1d1e8e431.png)

