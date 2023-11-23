---
title: IO多路复用

order: 4
author: zzys
date: 2023-11-22
category:
- 笔记
tag:
- IO
- linux
---

## C10K

[上一个10年，著名的C10K并发连接问题](https://zhuanlan.zhihu.com/p/23114695)

C10K曾是高性能网络编程中的一大难题，即单机并发超过一万。当时刚到达web2.0时，网页交互开始流行，然后发展到即时通信和实时互动，而且都需要通过TCP**保持连接**才能进行实时交互。这就会导致当一次HTTP请求/响应成功后，TCP不会立即断开连接，即使当前socket上并没有请求发送。

在最初的服务器都是基于进程/线程模型的，新到来**一个TCP连接**，就需要分配**1个进程**（或者线程）。而进程又是操作系统最昂贵的资源，一台机器无法创建很多进程。如果是C10K就要创建1万个进程，**上下文切换**会极其频繁，那么单机而言操作系统是无法承受的（往往出现效率低下甚至完全瘫痪）。这就会导致即使socket没有请求，线程依然需要阻塞read，直到socket被关闭。

那么就需要新的IO模型来提高性能。（C10M是通过绕过OS和硬件直接交互解决的）

## IO模型

[一文搞懂，4种主要的 I/O 模型](https://blog.csdn.net/ldw201510803006/article/details/119767467?spm=1001.2014.3001.5501)

当用户线程发起 I/O 操作后，网络数据读取操作会经历两个步骤：

- 用户线程等待内核将数据从网卡拷贝到内核空间。
- 内核将数据从内核空间拷贝到用户空间

**阻塞与非阻塞**：指应用程序在发起 I/O 操作时，是立即返回还是等待

**同步与异步**：指应用程序在与内核通信时，数据从内核空间到应用空间的拷贝，是由内核主动发起还是由应用程序来触发；内核主动发起则是异步，反之为同步

### 阻塞IO

传统的IO模型是以 `read()`为代表的阻塞式IO，在使用read系统调用后，用户态线程陷入内核态，阻塞等待数据拷贝到用户区。

```pseudocode
listenfd = socket();   // 打开一个网络通信端口
bind(listenfd);        // 绑定
listen(listenfd);      // 监听
while(1) {
  connfd = accept(listenfd);  // 阻塞建立连接
  int n = read(connfd, buf);  // 阻塞读数据
  doSomeThing(buf);  // 利用读到的数据做些什么
  close(connfd);     // 关闭连接，循环等待下一个连接
}
```



<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/56cb9cd5fc6741cd7d508f15a1eba631.gif" style="zoom:67%;" />

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/b7cc284fd97e6dbf9c32dac4c730ba91.png" alt="image-20231123173330361" style="zoom:50%;" />

### 同步非阻塞IO

用户线程不断的发起 read 调用，数据没到内核空间时，每次都返回失败（**非阻塞**），直到数据到了内核空间，这一次 read 调用后，在等待数据从内核空间拷贝到用户空间这段时间里，线程还是**阻塞**的，等数据到了用户空间再把线程叫醒。

这里需要使用`fcntl`将fd设置为非阻塞模式。

```c
fcntl(connfd, F_SETFL, O_NONBLOCK);
int n = read(connfd, buffer) != SUCCESS);
```

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/af49b6370850ff03f59cb71d5bb0a219.gif" style="zoom:67%;" />

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/24c4916de101b24950c70409eeadbb93.png" alt="image-20231123173401180" style="zoom:50%;" />

### 异步IO

用户线程发起 read 调用的同时注册一个回调函数，read 立即返回，等**内核将数据准备好**后，再调用指定的**回调函数**完成处理。在这个过程中，用户线程**一直没有阻塞**。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ed78d1dddf67b47ac662f48e1c4e6357.png" alt="image-20231123173858699" style="zoom:50%;" />

### 信号驱动IO

[一文看懂IO多路复用](https://zhuanlan.zhihu.com/p/115220699)

[信号驱动IO](https://link.zhihu.com/?target=http%3A//man7.org/linux/man-pages/man7/signal.7.html)是利用信号机制，让内核告知应用程序文件描述符的相关事件。这里有一个信号驱动IO相关的[例子](https://link.zhihu.com/?target=https%3A//github.com/troydhanson/network/blob/master/tcp/server/sigio-server.c)。

但信号驱动IO在网络编程的时候通常很少用到，因为在网络环境中，和socket相关的读写事件太多了，比如下面的事件都会导致SIGIO信号的产生：

1. TCP连接建立
2. 一方断开TCP连接请求
3. 断开TCP连接请求完成
4. TCP连接半关闭
5. 数据到达TCP socket
6. 数据已经发送出去(如：写buffer有空余空间)

上面所有的这些都会产生SIGIO信号，但我们没办法在SIGIO对应的信号处理函数中区分上述不同的事件，SIGIO只应该在IO事件单一情况下使用，比如说用来监听端口的socket，因为只有客户端发起新连接的时候才会产生SIGIO信号。

它和异步IO最大的不同是，当数据到达内核后，内核不会主动将数据传递给用户，而是需要用户阻塞拷贝。

## IO多路复用

[你管这破玩意叫 IO 多路复用？](https://mp.weixin.qq.com/s?__biz=Mzk0MjE3NDE0Ng==&mid=2247494866&idx=1&sn=0ebeb60dbc1fd7f9473943df7ce5fd95&chksm=c2c5967ff5b21f69030636334f6a5a7dc52c0f4de9b668f7bac15b2c1a2660ae533dd9878c7c&scene=21#wechat_redirect)

IO多路复用也是IO模型的一种，在这里将它挑出来重点叙述。

在传统的阻塞式IO中我们一次只能接收一个请求，于是后面就产生了多线程处理模式，处理逻辑放在新的线程中执行，主线程就可以继续接收请求。但在C10K中我们知道，每当一个连接到来时就创建一个对应的线程会极大的影响性能，很大的原因就是socket不是一直都有请求的。

那么我们就需要想一个其他的办法，能够同时监听多个socket上的请求。这里既可以包括监听套接字上的连接请求，也可以包括已连接套接字上的读写请求。

### 非阻塞式IO实现多路复用

好像，上面所叙述的非阻塞式IO就可以实现？每当我们接收到一个accept，就将它放进一个数组中。然后只需要遍历数组，使用非阻塞IO处理已就绪的请求，如果有请求到达，再创建线程处理。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/b499e399a9b1a4ae26813f355bb87e4b.gif" style="zoom: 67%;" />

但是我们会发现，每次read其实都需要陷入一次内核态，需要两次上下文切换，当连接多起来时，显然很不划算。

> 在 while 循环里做系统调用，就好比你做分布式项目时在 while 里做 rpc 请求一样，是不划算的。

那我们就想，怎样才能即非阻塞又不去过多的陷入内核态呢？

### select

当然是让操作系统帮我们实现啦。既然我们每次都需要陷入内核态才可以判断是否可读，直接让os在内核态帮我们遍历好了:happy:

select函数就是帮我们做这件事情的，我们将fd数组传入，操作系统帮我们遍历判断socket是否可读，一旦有可读的socket，就返回可读的数量。可以看出select是阻塞的。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/320be0c91e2a376199b1d5eef626758e.gif" style="zoom:67%;" />

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/6705367fe23e0f4e87dcac35903b4a78.png" alt="image-20231123191613036" style="zoom: 50%;" />

select函数原型如下：

```c
#define __FD_SETSIZE 1024 
int select(
    int nfds,
    fd_set *readfds,
    fd_set *writefds,
    fd_set *exceptfds,
    struct timeval *timeout);
// nfds:监控的文件描述符集里最大文件描述符加1
// readfds：监控有读数据到达文件描述符集合，传入传出参数
// writefds：监控写数据到达文件描述符集合，传入传出参数
// exceptfds：监控异常发生达文件描述符集合, 传入传出参数
// timeout：定时阻塞监控时间，3种情况
//  1.NULL，永远等下去
//  2.设置timeval，等待固定时间
//  3.设置timeval里时间均为0，检查描述字后立即返回，轮询

typedef struct {
   …
   __fd_mask  __fds_bits[__FD_SETSIZE / __NFDBITS];
   …
} fd_set
```

我们可以看出select目前的一些缺点：

1. select 调用需要传入 fd 数组，需要**拷贝**一份到内核，高并发场景下这样的拷贝消耗的资源是惊人的。（可优化为不复制）
2. select 函数对单个进程能`监听的文件描述符数量是有限制`的，它能监听的文件描述符个数由 *__FD_SETSIZE* 决定，默认值是 *1024*。

2. select 在内核层仍然是通过**遍历**的方式检查文件描述符的就绪状态，是个同步过程，只不过无系统调用切换上下文的开销。（内核层可优化为异步事件通知）

3. select 仅仅返回可读文件描述符的个数，具体哪个可读还是要用户自己**遍历**。（可优化为只返回给用户就绪的文件描述符，无需用户做无效的遍历）

### poll

poll相较于select只有一个进步，那就是不在限制数量。

```c
int poll(struct pollfd *fds, nfds_tnfds, int timeout);

struct pollfd {
  intfd; /*文件描述符*/
  shortevents; /*监控的事件*/
  shortrevents; /*监控事件中满足条件返回的事件*/
};
```

### epoll

而epoll直接一下子把select的缺点全都解决了:satisfied:

1. 内核中保存一份文件描述符集合，无需用户每次都重新传入，只需告诉内核修改的部分即可。（mmap）
2. 不限制数量

2. 内核不再通过轮询的方式找到就绪的文件描述符，而是通过异步 IO 事件唤醒。

3. 内核仅会将有 IO 事件的文件描述符返回给用户，用户也无需遍历整个文件描述符集合。

提供的函数如下：

- 创建一个epoll句柄

  ```c
  int epoll_create(int size);
  // 参数size表明内核要监听的描述符数量
  ```

- 向内核添加、修改或删除要监控的文件描述符。

  ```c
  int epoll_ctl(
    int epfd, int op, int fd, struct epoll_event *event);
  // epfd 表示 epoll 句柄
  // op 表示 fd 操作类型，有如下3种
  //   EPOLL_CTL_ADD 注册新的 fd 到 epfd 中
  //   EPOLL_CTL_MOD 修改已注册的 fd 的监听事件
  //   EPOLL_CTL_DEL 从 epfd 中删除一个 fd
  //   fd 是要监听的描述符
  // event 表示要监听的事件
  ```

- 类似于select的阻塞调用

  ```c
  int epoll_wait(
    int epfd, struct epoll_event *events, int max events, int timeout);
  // epfd 是 epoll 句柄
  // events 表示从内核得到的就绪事件集合
  // maxevents 告诉内核 events 的大小
  // timeout 表示等待的超时事件
  
  typedef union epoll_data
  {
    ...
    int fd;  //记录文件描述符
    ...
  } epoll_data_t;
  
  
  struct epoll_event
  {
    uint32_t events;  //epoll监听的事件类型
    epoll_data_t data; //应用程序数据
  };
  
  // 常见的事件
  // EPOLLIN：读事件，表示文件描述符对应套接字有数据可读。
  // EPOLLOUT：写事件，表示文件描述符对应套接字有数据要写。
  // EPOLLERR：错误事件，表示文件描述符对于套接字出错。
  ```

  <img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/70f8e9bc1a028d252c01c32329e49341.gif" style="zoom: 67%;" />

epoll如何处理写事件？[I/O 多路复用如何高效处理写事件](https://blog.csdn.net/The_Old_man_and_sea/article/details/102633590)

### epoll为什么高效

1. epoll 采用红黑树管理文件描述符
   从上图可以看出，epoll使用红黑树管理文件描述符，红黑树插入和删除的都是时间复杂度 O(logN)，不会随着文件描述符数量增加而改变。
   select、poll采用数组或者链表的形式管理文件描述符，那么在遍历文件描述符时，时间复杂度会随着文件描述的增加而增加。

2. epoll 将文件描述符添加和检测分离，减少了文件描述符拷贝的消耗
   select&poll 调用时会将全部监听的 fd 从用户态空间拷贝至内核态空间并线性扫描一遍找出就绪的 fd 再返回到用户态。下次需要监听时，又需要把之前已经传递过的文件描述符再读传递进去，增加了拷贝文件的无效消耗，当文件描述很多时，性能瓶颈更加明显。
   而epoll只需要使用epoll_ctl添加一次，后续的检查使用epoll_wait，减少了文件拷贝的消耗。
### epoll的边缘触发与水平触发

[IO多路复用就这么简单](https://zhuanlan.zhihu.com/p/668197926)

#### 水平触发(LT)

   关注点是数据，只要**读缓冲区不为空**，**写缓冲区不满**，那么epoll_wait就会**一直返回就绪**，水平触发是epoll的**默认**工作方式。

#### 边缘触发(ET)

   关注点是**变化**，只要缓冲区的数据有变化，epoll_wait就会返回就绪。
   这里的数据变化并不单纯指，缓冲区从有数据变为没有数据，或者从没有数据变为有数据，还包括了数据变多或者变少。换句话说，**当buffer长度有变化时，就会触发**。
   假设epoll被设置为了边缘触发，当客户端写入了10个字符，由于缓冲区从0变为了10，于是服务端epoll_wait触发一次就绪，服务端读取了2个字节后不再读取。这个时候再去调用epoll_wait会发现不会就绪，只有当客户端再次写入数据后，才会触发就绪。
   这就导致如果使用ET模式，那就必须保证要「一次性把数据读取/写入完」，否则会导致数据长期无法读取/写入。
   LT模式则没有这个问题。

### 总结

单线程串行处理socket事件-->accept后多个线程阻塞监听自己的事件-->一个线程在用户态使用非阻塞IO循环监听所有事件-->操作系统遍历监听事件-->操作系统利用fd的callback异步通知。

## Reactor

[高性能IO模型分析-Reactor模式和Proactor模式（二）](https://zhuanlan.zhihu.com/p/95662364)

[高性能网络编程之 Reactor 网络模型（彻底搞懂）](https://juejin.cn/post/7092436770519777311)

有了IO多路复用技术，性能确实提升了不少，但是我们会发现，好像不太容易编程，对于可连接，可读，可写事件，我们完全就是在面向过程编程，这时，Reactor模型就应运而生。

Reactor 模型其核心是**事件驱动**，**有一个或多个并发输入源，有一个Service Handler，有多个Request Handlers**。Service Handler会对输入的请求（Event）进行多路复用，并同步地将它们分发给相应的Request Handler。可以理解为 Reactor 模型中的反应器角色类似于事件转发器（承接**连接建立**、**IO处理**以及**事件分发**），所以Reactor模式也可称为**Dispatcher**模式。

Reactor通常以三种形式呈现：

- 单线程模型
- 多线程模型：工作者线程池
- 主从多线程模型：工作者线程池，拆分Reactor

### 单线程模式

单线程模式就是由一个线程完成所有的事情：连接建立，读写事件，事件分发，业务处理。

缺点也很明显：

- 一个线程支持处理的连接数非常有限，CPU 很容易打满，性能方面有明显瓶颈；

- 当多个事件被同时触发时，只要有一个事件没有处理完，其他后面的事件就无法执行，这就会造成消息积压及请求超时；

- 线程在处理 I/O 事件时，Select 无法同时处理连接建立、事件分发等操作；

- 如果 I/O 线程一直处于满负荷状态，很可能造成服务端节点不可用。



<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/fc2fc5ffee0b9e2cde3a91dc3326ae1c.png" alt="image-20231123203522878" style="zoom:50%;" />

### 多线程模型

在这里，我们将业务处理外包出去，使用我们常见的线程池技术来处理耗时的业务操作。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/8c4a0af1bac505f8b39f761f8c5eee3b.png" alt="image-20231123205101226" style="zoom: 50%;" />

但是读写操作任然是由Reactor单线程执行，阻塞问题依然存在。

### 	主从线程模型

主从 Reactor 模式中，分为了主 Reactor 和 从 Reactor，分别处理 `新建立的连接`、`IO读写事件/事件分发`。

- 一来，主 Reactor 可以解决同一时间大量新连接，将其注册到从 Reactor 上进行IO事件监听处理
- 二来，IO事件监听相对新连接处理更加耗时，此处我们可以考虑使用线程池来处理。这样能充分利用多核 CPU 的特性，能使更多就绪的IO事件及时处理。

简言之，主从多线程模型由多个 Reactor 线程组成，每个 Reactor 线程都有独立的 Selector 对象。MainReactor 仅负责处理客户端连接的 Accept 事件，连接建立成功后将新创建的连接对象注册至 SubReactor。再由 SubReactor 分配线程池中的 I/O 线程与其连接绑定，它将负责连接生命周期内所有的 I/O 事件。

在海量客户端并发请求的场景下，主从多线程模式甚至可以适当增加 SubReactor 线程的数量，从而利用多核能力提升系统的吞吐量。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/2d1124b96118580bbcb8708c04592feb.png" alt="image-20231123205228569" style="zoom:50%;" />