import{_ as l,r as a,o as r,c as v,a as n,b as i,d as s,e as d}from"./app-20538318.js";const t={},u=d('<p><strong>Go语言的优点？</strong></p><ol start="0"><li>高性能、高并发</li><li>语法简单、学习曲线平缓</li><li>丰富的标准库</li><li>完善的工具链</li><li>静态链接</li><li>快速编译</li><li>跨平台</li><li>垃圾回收</li></ol><h2 id="_1-安装和配置go" tabindex="-1"><a class="header-anchor" href="#_1-安装和配置go" aria-hidden="true">#</a> 1. 安装和配置GO</h2><h3 id="_1-1-安装" tabindex="-1"><a class="header-anchor" href="#_1-1-安装" aria-hidden="true">#</a> 1.1 安装</h3>',4),c={href:"https://link.juejin.cn/?target=https%3A%2F%2Fgo.dev%2F",title:"https://go.dev/",target:"_blank",rel:"noopener noreferrer"},m={href:"https://link.juejin.cn/?target=https%3A%2F%2Fstudygolang.com%2Fdl",title:"https://studygolang.com/dl",target:"_blank",rel:"noopener noreferrer"},o=d(`<h3 id="_1-2-配置-linux" tabindex="-1"><a class="header-anchor" href="#_1-2-配置-linux" aria-hidden="true">#</a> 1. 2 配置（Linux）</h3><ul><li>配置PATH</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>vim ~/.bashrc

export GOPATH=$HOME/gopath
export GOROOT=/home/zzys/Downloads/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

source ~/.bashrc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>IDE 这里我选用的是Goland</li></ul><h2 id="_2-go语言基础语法" tabindex="-1"><a class="header-anchor" href="#_2-go语言基础语法" aria-hidden="true">#</a> 2. GO语言基础语法</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>package main

import (
    &quot;encoding/json&quot;
    &quot;fmt&quot;
    &quot;github.com/pkg/errors&quot;
    &quot;time&quot;
)

func main() {
    fmt.Println(&quot;hello go&quot;)
        //fmt是官方提供的包，亦可以自己写一个包或下载第三方报
    //1.变量和常量.....
    //声明方式
    var a int = 1
    _, b, z := 2, 3, 4 //由于go不允许存在未使用的变量，当这个变量不重要是，使用_来进行占位
    const c = &quot;go&quot;
    var d float64 = 3.2
    //强制类型转换
    e := float32(d)

    //2.if else....
    //主要就是条件不带括号,if和else后面的大括号不能换行
    if a &gt; 2 {
        fmt.Println(&quot;a is bigger then 2&quot;)
    } else {
        fmt.Println(&quot;ais smaller than 2&quot;)
    }

    //3.循环.............................
    //Go中只有for循环,条件的不加括号，大括号同样不能换行.break和continue可以使用
    for f := 3; f &lt; 10; f++ {
        fmt.Printf(&quot;f is %d&quot;, f)
        f++
    }

    //4.switch...............................
    //Go的switch括号，大括号同上，功能更强大，可以不加变量，直接写条件
    switch {
    case e &gt; 2:
        fmt.Println(&quot;1&quot;)
    case time.Now().Hour() == 3:
        fmt.Println(&quot;hour is 3&quot;)
    default:
        fmt.Println(&quot;2&quot;)
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
    m[&quot;one&quot;] = 1
    delete(m, &quot;one&quot;)

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
    s1 := Student{Name: &quot;ming&quot;} //实例化
    s2 := new(Student)          //返回指针
    s3 := &amp;Student{&quot;s&quot;, 4}      //同样返回指针
    //对于上面，没有指定的会进行默认初始化0,&quot;&quot;,nil
    //同样，结构体首字母大写可被包外访问，字段小写不可进行序列化操作
    //后方的Tag元信息可以在运行时通过反射读取

    //序列化和反序列化
    _, err = json.Marshal(s1)
    str := \`{&quot;name&quot;:&quot;a&quot;,&quot;num&quot;:&quot;3&quot;}\`
    err = json.Unmarshal([]byte(str), s2)
    
    //11.时间，字符串操作，数字解析，os.Args,exec.Commend等一系列操作
}

func action(a, b int) (int, error) {
    if a+b &gt; 10 {
        return a + b, nil
    } else {
        return -1, errors.Errorf(&quot;sum is smaller than 10&quot;)
    }
}

type Student struct {
    Name string \`json:&quot;name&quot;\`
    Num  uint   \`json:&quot;num&quot;\`
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-go语言进阶语法" tabindex="-1"><a class="header-anchor" href="#_3-go语言进阶语法" aria-hidden="true">#</a> 3. Go语言进阶语法</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>package main

import (
    &quot;fmt&quot;
    &quot;sync&quot;
)

func main() {

    //两种方式创建一个协程
    go func() {
        fmt.Println(&quot;ok&quot;)
    }()
    go str(true)

    //channel
    c1 := make(chan int)    //无缓冲通道
    c2 := make(chan int, 3) //有缓冲通道

    //例子
    go func() {
        defer close(c1)  //关闭channel，defer会位于return后执行
        for i := 0; i &lt; 10; i++ {
            c1 &lt;- i //对于无缓冲通道，只有存在(接受者/发送者)才会(发送/接受)，不然会一直阻塞该协程
        }
    }()
    go func() {
        defer close(c2)
        for i := range c1 {
            c2 &lt;- i * i //对于有缓冲通道，在未到达容量前，不会阻塞，满了之后同无缓冲通道
        }
    }()
    for i := range c2 {
        fmt.Println(i)
    }

    //sync
    mutex := sync.Mutex{}     //互斥锁
    rwMutex := sync.RWMutex{} //读写锁
    wg := sync.WaitGroup{}    //同步原语
    
    for i := 0; i &lt; 10; i++ {
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
        return &quot;ok&quot;
    } else {
        return &quot;false&quot;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-依赖管理" tabindex="-1"><a class="header-anchor" href="#_4-依赖管理" aria-hidden="true">#</a> 4. 依赖管理</h2><p><s>GOPATH</s> --&gt; <s>GOVendor</s> --&gt; <strong>Gomodule</strong></p><h3 id="_4-1-go-mod文件" tabindex="-1"><a class="header-anchor" href="#_4-1-go-mod文件" aria-hidden="true">#</a> 4.1 go.mod文件</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>module ex

//原生库
go 1.18

//单元依赖
require (
    github.com/dgrijalva/jwt-go v3.2.0+incompatible //对于没有go.mod并且版本大于2.0会增加此标志
    github.com/gin-contrib/sse v0.1.0 // indirect   //间接依赖
)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-proxy" tabindex="-1"><a class="header-anchor" href="#_4-2-proxy" aria-hidden="true">#</a> 4.2 proxy</h3><p><em>如果没有代理站点会有什么缺点？</em></p><ol start="0"><li>无法保证构建稳定性，作者增加/修改/删除软件版本</li><li>无法保证依赖可用性，作者删除软件</li><li>增加第三方压力，代码托管平台负载问题 <strong>而go proxy就是解决这些问题的方案，Go Proxy是一个服务站点， 它会缓源站中的软件内容， 缓存的软件版本不会改变，并且在源站软件删除之后依然可用，从而实现了供imuability和avilable的依赖分发;</strong></li></ol><blockquote><p><code>go env -w GOPROXY=https://goproxy.cn,direct //改变go的proxy，从前向后匹配，direct是源站</code></p></blockquote><h3 id="_4-3-go-get和go-mod" tabindex="-1"><a class="header-anchor" href="#_4-3-go-get和go-mod" aria-hidden="true">#</a> 4.3 go get和go mod</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1. go get example.org.pkg (@update/@none/@v1.1.2/)
2. go mod init example //初始化mod
3. go mod tidy //整理依赖删除不用的依赖
4. go mod download //依赖下载
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-测试" tabindex="-1"><a class="header-anchor" href="#_5-测试" aria-hidden="true">#</a> 5. 测试</h2><h3 id="_5-1-单元测试" tabindex="-1"><a class="header-anchor" href="#_5-1-单元测试" aria-hidden="true">#</a> 5.1 单元测试</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ex.go
package main

func Add(a int, b int) int {
    return a + b
}

func Mul(a int, b int) int {
    return a * b
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ex_test.go
package main

import (
    &quot;testing&quot;
)

func TestAdd(t *testing.T) {
    if ans := Add(1, 2); ans != 3 {
        t.Errorf(&quot;1 + 2 expected be 3, but %d got&quot;, ans)
    }
}
func TestMul(t *testing.T) {

    if ans := Mul(-10, -20); ans != 200 {
        t.Errorf(&quot;-10 * -20 expected be 200, but %d got&quot;, ans)
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="0"><li>测试文件名称以源文件名称加_test为标准</li><li>测试函数函数名以Test+原函数名为标准</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>go test -run TestAdd-v --cover 
## -v 详细信息 -run TestAdd  指定函数测试--cover 代码覆盖率
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,24),b={href:"https://geektutu.com/post/quick-go-test.html",target:"_blank",rel:"noopener noreferrer"},g=n("h3",{id:"_5-2-mock测试",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#_5-2-mock测试","aria-hidden":"true"},"#"),i(" 5.2 mock测试")],-1),h={href:"https://cloud.tencent.com/developer/article/1399242",target:"_blank",rel:"noopener noreferrer"},f=n("h3",{id:"_5-3-基准测试",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#_5-3-基准测试","aria-hidden":"true"},"#"),i(" 5.3 基准测试")],-1),p={href:"https://zhuanlan.zhihu.com/p/375554518",target:"_blank",rel:"noopener noreferrer"};function x(_,q){const e=a("ExternalLinkIcon");return r(),v("div",null,[u,n("ul",null,[n("li",null,[i("访问 "),n("a",c,[i("go.dev/"),s(e)]),i(" ，点击 Download ，下载对应平台安装包，安装即可")]),n("li",null,[i("如果无法访问上述网址，可以改为访问 "),n("a",m,[i("studygolang.com/dl"),s(e)]),i(" 下载安装")])]),o,n("p",null,[n("a",b,[i("这篇文章介绍了大部分单元测试"),s(e)])]),g,n("p",null,[i("mock测试主要是解决io类型的测试："),n("a",h,[i("golang单元测试之mock - 云+社区 - 腾讯云 (tencent.com)"),s(e)])]),f,n("p",null,[i("由于对基准测试不够了解，所以这里就贴出一个连接："),n("a",p,[i("Go高性能系列教程之一：基准测试 - 知乎 (zhihu.com)"),s(e)])])])}const y=l(t,[["render",x],["__file","golang基础入门.html.vue"]]);export{y as default};
