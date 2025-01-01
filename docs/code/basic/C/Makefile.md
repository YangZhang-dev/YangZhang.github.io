---
title: Makefile

order: 1
author: zzys
date: 2024-12-31
category:
- Makefile
tag:
- 杂记
---

## 双文件简单编译

```makefile
all: f

# 链接
f: f1.o f2.o
	gcc f1.o f2.o -o f
# 对于f1.o gcc会自动编译
# 而由于f2.o 我们需要指定头文件路径，故手动声明
f2.o:
	gcc -c f2.c -I./tt 
clean:
	rm -f f f1.o f2.o
```

## 复杂编译

.PHONY修饰的目标就是只有规则没有依赖，每次都执行。