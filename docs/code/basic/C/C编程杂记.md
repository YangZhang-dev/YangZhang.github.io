---
title: C编程杂记

order: 1
author: zzys
date: 2024-12-31
category:
- C
tag:
- 杂记
---

## extern

通常在.h文件中声明

```c
// f1.c
int x = 1;

// f1.h
extern int x;

// f2.c
#include "f1.h"
printf("%d", x);
```



## 宏

[练习20：Zed的强大的调试宏 · 笨办法学C](https://wizardforcel.gitbooks.io/lcthw/content/ex20.html)

```c
#define log_info(M, ...) fprintf(stderr, "[INFO] (%s:%d) " M "\n", __FILE__, __LINE__, ##__VA_ARGS__)

// __FILE__ 打印文件名, __LINE__ 打印当前执行的是第几行
// ... 和 ##__VA_ARGS__ 搭配使用达成可变参数的作用
// 其中 M 是我们的模板字符串

#define check(A, M, ...) if(!(A)) { log_err(M, ##__VA_ARGS__); errno=0; goto error; }
#define check_mem(A) check((A), "Out of memory.")

// 在check_mem 中实现了宏的嵌套，宏是递归展开的
```



## 预处理编译链接

预处理的本质是文本的粘贴替换

主要作用：

- 把头文件的内容粘贴进来
- 把宏递归展开
- #ifdef 条件编译处理


```bash
# 查看预处理后的文件
gcc -E f1.c | vim -
# 查看预处理的详细信息，可用于查看 <> 系统头文件的查询顺序
gcc -E --verbose f2.c > /dev/null
```

用户头文件：

1. 当前目录下
2. `-I`参数：`gcc -I./include/ -c f.c`

GCC编译链接：
```bash
// 通过 -I 参数指定头文件扫描的目录
gcc -c f1.c f2.c -I./include
gcc f1.o f2.o -o f

// 直接编译为可执行文件
gcc -c f.c -o f
```

## 函数指针

```c
// 函数指针，声明了一个指针变量
int (*callme)(int a, int b);
// 为入参是两个int，返回值是一个int的函数起了一个别名（类型）
typedef int (*callme)(int a, int b);


#include <stdio.h>
int (*fptr)(int, int);
typedef int (*fptr_t)(int, int);
int add(int a, int b) {
    return a + b;
}

int main() {
    fptr = add;
    printf("%d\n", fptr(2, 3));
    fptr_t fptr2 = add;
    printf("%d\n", fptr2(3, 4));
    return 0;
}
```



## 静态链接

将多个`.o`文件归档为一个`.a`文件，链接器在链接时可以选择性的链接需要的符号。

### 创建静态库

```c
// myhello.h
#ifndef MYHELLO_H
#define MYHELLO_H

int print_a_message(const char *msg);
#endif

// myhello.c
#include "myhello.h"
int main()
{
    print_a_message("Hello, World!");
    return 0;
}
```

```bash
# 生成.o文件
gcc -c myhello.c

# 生成静态链接库,命名规范：libxxx.a
ar -rc libmyhello.a myhello.o

# -t 查看当前静态链接库中含有哪些.o文件
ar -t libmyhello.a 
```

测试：

```c
// test.c
#include "myhello.h"
int main()
{
    print_a_message("Hello, World!");
    return 0;
}
```

```bash
# -L. 指定用户要扫描的目录
# -l 指定静态链接库的名称
gcc test.c -L. -lmyhello -o test
```



## 动态链接

### 隐式动态链接

隐式链接在编译/链接阶段完成，由编译系统根据动态库的头文件和库文件进行编译和链接。从而确定待调用的函数原形和地址。

```bash
// 生成动态链接库
gcc -fPIC -shared -o libmyhello.so myhello.c
// 进行链接
gcc test.c -L. -lmyhello -o test
// 执行报错
> ./test: error while loading shared libraries: libmyhello.so: cannot open shared object file: No such file or directory
```

推荐方法：

```bash
sudo vim /etc/ld.so.conf
# 加入当前.so 文件的绝对路径
sudo ldconfig -v
```

- 使用`nm -g libmyhello.so`查找当前动态链接库中导出的符号
- 使用`ldd test` 查看当前程序的动态链接库

### 显式动态链接

利用API函数实现加载和卸载共享库，获取带调用函数，变量地址，获取错误信息等功能，需要手动指定符号。

```c
// my.h
#ifndef MYHELLO_H
#define MYHELLO_H
int my_number = 10;
int add_two_ints(int a, int b);
#endif

// my.c
#include <stdio.h>
#include "my.h"

int add_two_ints(int a, int b)
{
    return a + b;
}

// test.c
#include <dlfcn.h>
#include <stdlib.h>  

typedef int (*add_two_ints)(int, int);

int main(int argc, char *argv[])
{
    char *lib_file = argv[1];
    char *data1 = argv[2];

    void *lib = dlopen(lib_file, RTLD_NOW);

    add_two_ints func2 = dlsym(lib, "add_two_ints");
    int* my_number = (int *)dlsym(lib, "my_number");
    printf("Result: %d\n", func2(atoi(data1), *my_number)) ;
    
    dlclose(lib);
    return 0;
}
```

和隐式动态链接相同的构建动态库，也需要配置路径，只是在链接时：

```bash
// 进行链接
gcc test.c -ldl -o test
// 执行, 其中 ./ 一定要带
./test ./libmy.so 1 
```



### 静动混合

当有重名的静态动态文件时，默认链接动态，若要链接静态，则需：

```bash
gcc test.c -L. -lmyhello -static -o test
```

若要指定静态动态库：

```bash
gcc test.c -L. -Wl,Bstatic -lmy1 -Wl,Bdynamic -lmy2 -o test
```

### 三种链接混合举例

```c
// my1.h 使用静态链接
#ifndef MY1_H
#define MY1_H
extern int x;
#endif

// my1.c
int x = 1;

// my2.h 使用隐式动态链接
#ifndef MY2_H
#define MY2_H
extern int y;
#endif

// my2.c
int y = 1;

// my3.h 使用显式动态链接
#ifndef MY3_H
#define MY3_H
int add(int a, int b);
#endif

// my3.c
int add(int a, int b) {
    return a + b;
}

// test.c
#include <dlfcn.h>
#include "dbg.h"    
#include "my1.h"
#include "my2.h"

typedef int (*add)(int, int);
int main(int argc, char *argv[])
{
    void *lib = dlopen("./libmy3.so", RTLD_NOW);
    add func = dlsym(lib, "add");
    printf("result = %d\n", func(x, y));
    return 0;
}
```

测试：

```bash
gcc -c my1.c
ar -rc libmy1.a my1.o

gcc -fPIC -shared -o libmy2.so my2.c

gcc -fPIC -shared -o libmy3.so my3.c
// -g 用于生成gdb调试信息
gcc test.c -g -L. -Wl,-Bstatic -lmy1 -Wl,-Bdynamic -lmy2 -ldl -o test

./test
```

