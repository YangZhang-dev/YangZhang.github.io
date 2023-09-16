---
title: golang基础入门

order: 1
author: zzys
date: 2022-05-13
category:
- 技术
tag:
- golang
- 语法
---

**Go语言的优点？**

0.  高性能、高并发
0.  语法简单、学习曲线平缓
0.  丰富的标准库
0.  完善的工具链
0.  静态链接
0.  快速编译
0.  跨平台
0.  垃圾回收

## 1. 安装和配置GO

### 1.1 安装

-   访问 [go.dev/](https://link.juejin.cn/?target=https%3A%2F%2Fgo.dev%2F "https://go.dev/") ，点击 Download ，下载对应平台安装包，安装即可
-   如果无法访问上述网址，可以改为访问 [studygolang.com/dl](https://link.juejin.cn/?target=https%3A%2F%2Fstudygolang.com%2Fdl "https://studygolang.com/dl") 下载安装

### 1. 2 配置（Linux）

-   配置PATH

```
vim ~/.bashrc

export GOPATH=$HOME/gopath
export GOROOT=/home/zzys/Downloads/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

source ~/.bashrc
```

-   IDE 这里我选用的是Goland

## 2. GO语言基础语法

```
package main

import (
    "encoding/json"
    "fmt"
    "github.com/pkg/errors"
    "time"
)

func main() {
    fmt.Println("hello go")
        //fmt是官方提供的包，亦可以自己写一个包或下载第三方报
    //1.变量和常量.....
    //声明方式
    var a int = 1
    _, b, z := 2, 3, 4 //由于go不允许存在未使用的变量，当这个变量不重要是，使用_来进行占位
    const c = "go"
    var d float64 = 3.2
    //强制类型转换
    e := float32(d)

    //2.if else....
    //主要就是条件不带括号,if和else后面的大括号不能换行
    if a > 2 {
        fmt.Println("a is bigger then 2")
    } else {
        fmt.Println("ais smaller than 2")
    }

    //3.循环.............................
    //Go中只有for循环,条件的不加括号，大括号同样不能换行.break和continue可以使用
    for f := 3; f < 10; f++ {
        fmt.Printf("f is %d", f)
        f++
    }

    //4.switch...............................
    //Go的switch括号，大括号同上，功能更强大，可以不加变量，直接写条件
    switch {
    case e > 2:
        fmt.Println("1")
    case time.Now().Hour() == 3:
        fmt.Println("hour is 3")
    default:
        fmt.Println("2")
    }

    //5.数组..................................
    //声明
    var g [5]int
    h := [4][4]float32{}
    for _, num := range h { //range []int返回的第一个是下表，第二个是数值，mao同理
        fmt.Println(num)
    }

    //6.切片..............................
    k := make([]int, 2, 4)
    //2是长度，4是预先额外分配的容量，减少分配内存的消耗提高性能，切片在len满后，会自动扩容一倍
    ints := append(k, 3) //向为不添加元素，返回一个切片
    l := ints[1:2]       //可以向python一样操作

    //7.map...............................
    //map是无序的
    m := make(map[string]int) //一般不指明大小
    m["one"] = 1
    delete(m, "one")

    //8.函数................................
    //函数可以返回多个值,若函数首字母大写则全局可用，否则只能本包内调用
    sum, err := action(b, z)
    if err != nil { //这里是Go的错误判断，error是错误类型
        fmt.Println(err)
    } else {
        fmt.Println(sum)
    }

    //9.指针同c/c++...................................

    //10.结构体.................................
    //初始化
    s1 := Student{Name: "ming"} //实例化
    s2 := new(Student)          //返回指针
    s3 := &Student{"s", 4}      //同样返回指针
    //对于上面，没有指定的会进行默认初始化0,"",nil
    //同样，结构体首字母大写可被包外访问，字段小写不可进行序列化操作
    //后方的Tag元信息可以在运行时通过反射读取

    //序列化和反序列化
    _, err = json.Marshal(s1)
    str := `{"name":"a","num":"3"}`
    err = json.Unmarshal([]byte(str), s2)
    
    //11.时间，字符串操作，数字解析，os.Args,exec.Commend等一系列操作
}

func action(a, b int) (int, error) {
    if a+b > 10 {
        return a + b, nil
    } else {
        return -1, errors.Errorf("sum is smaller than 10")
    }
}

type Student struct {
    Name string `json:"name"`
    Num  uint   `json:"num"`
}

```

## 3. Go语言进阶语法

```
package main

import (
    "fmt"
    "sync"
)

func main() {

    //两种方式创建一个协程
    go func() {
        fmt.Println("ok")
    }()
    go str(true)

    //channel
    c1 := make(chan int)    //无缓冲通道
    c2 := make(chan int, 3) //有缓冲通道

    //例子
    go func() {
        defer close(c1)  //关闭channel，defer会位于return后执行
        for i := 0; i < 10; i++ {
            c1 <- i //对于无缓冲通道，只有存在(接受者/发送者)才会(发送/接受)，不然会一直阻塞该协程
        }
    }()
    go func() {
        defer close(c2)
        for i := range c1 {
            c2 <- i * i //对于有缓冲通道，在未到达容量前，不会阻塞，满了之后同无缓冲通道
        }
    }()
    for i := range c2 {
        fmt.Println(i)
    }

    //sync
    mutex := sync.Mutex{}     //互斥锁
    rwMutex := sync.RWMutex{} //读写锁
    wg := sync.WaitGroup{}    //同步原语
    
    for i := 0; i < 10; i++ {
        wg.Add(1) //增加一个任务
        go func(i int) {
            mutex.Lock()
            fmt.Println(i)
            mutex.Unlock()
            wg.Done() //一个任务完成
        }(i)

        wg.Wait() //阻塞等待任务全部完成
    }
}
func str(ok bool) string {
    if ok {
        return "ok"
    } else {
        return "false"
    }
}

```

## 4. 依赖管理

~~GOPATH~~ --> ~~GOVendor~~ --> **Gomodule**

### 4.1 go.mod文件

```
module ex

//原生库
go 1.18

//单元依赖
require (
    github.com/dgrijalva/jwt-go v3.2.0+incompatible //对于没有go.mod并且版本大于2.0会增加此标志
    github.com/gin-contrib/sse v0.1.0 // indirect   //间接依赖
)
```

### 4.2 proxy

*如果没有代理站点会有什么缺点？*

0.  无法保证构建稳定性，作者增加/修改/删除软件版本
0.  无法保证依赖可用性，作者删除软件
0.  增加第三方压力，代码托管平台负载问题 **而go proxy就是解决这些问题的方案，Go Proxy是一个服务站点， 它会缓源站中的软件内容， 缓存的软件版本不会改变，并且在源站软件删除之后依然可用，从而实现了供imuability和avilable的依赖分发;**

> `go env -w GOPROXY=https://goproxy.cn,direct //改变go的proxy，从前向后匹配，direct是源站`

### 4.3 go get和go mod

```
1. go get example.org.pkg (@update/@none/@v1.1.2/)
2. go mod init example //初始化mod
3. go mod tidy //整理依赖删除不用的依赖
4. go mod download //依赖下载
```

## 5. 测试

### 5.1 单元测试

```
//ex.go
package main

func Add(a int, b int) int {
    return a + b
}

func Mul(a int, b int) int {
    return a * b
}

```

```
//ex_test.go
package main

import (
    "testing"
)

func TestAdd(t *testing.T) {
    if ans := Add(1, 2); ans != 3 {
        t.Errorf("1 + 2 expected be 3, but %d got", ans)
    }
}
func TestMul(t *testing.T) {

    if ans := Mul(-10, -20); ans != 200 {
        t.Errorf("-10 * -20 expected be 200, but %d got", ans)
    }
}

```

0.  测试文件名称以源文件名称加_test为标准
0.  测试函数函数名以Test+原函数名为标准

```
go test -run TestAdd-v --cover 
## -v 详细信息 -run TestAdd  指定函数测试--cover 代码覆盖率
```

[这篇文章介绍了大部分单元测试](https://geektutu.com/post/quick-go-test.html)

### 5.2 mock测试

mock测试主要是解决io类型的测试：[golang单元测试之mock - 云+社区 - 腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1399242)

### 5.3 基准测试

由于对基准测试不够了解，所以这里就贴出一个连接：[Go高性能系列教程之一：基准测试 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/375554518)