---
title: 网络面经

order: 1
author: zzys
date: 2023-12-02
category:
- 面经
tag:
- 面试
- 网络
- 八股
---

## TCP

### 三次握手

[tcp-三次握手过程是怎样的](https://xiaolincoding.com/network/3_tcp/tcp_interview.html#tcp-三次握手过程是怎样的)

从状态和报文的角度来回答：

- 客户端主动向服务端发送SYN报文，其中序列号初始化**随机数**，随后客户端由CLOSE进入SYN_SEND状态。
- 当服务端收到之后，发送SYN+ACK报文，初始化自己的序列号随机数，应答号写入客户端的序列号加一，内核会将连接存储到半连接队列(SYN Queue)（SYN泛洪攻击）。随后由LISTEN进入SYN_RCVD状态。
- 客户端收到后发送ACK报文，应答号为服务端序列号加一，同时可以附加上应用层数据。然后进入ESTABLISHED状态。当服务端收到时，内核将连接从半连接队列(SYN Queue)中取出，添加到全连接队列(Accept Queue)，也进入ESTABLISHED状态。代表着连接已建立。

### 四次挥手

[tcp-四次挥手过程是怎样的](https://xiaolincoding.com/network/3_tcp/tcp_interview.html#tcp-四次挥手过程是怎样的)

断开连接是双方都可以发起的操作，以客户端断开为例

- 客户端发出FIN报文，随机进入FIN_WAIT_1状态，不再发送数据，但还可以接收数据。
- 服务端收到后首先返回ACK报文，进入CLOSE_WAIT状态，此时还可以发送没有发送完毕的数据。
- 客户端收到后进入FIN_WAIT_2状态，等待服务端的FIN报文
- 服务端返回FIN报文，进入LAST_ACK状态。
- 客户端收到FIN报文，向服务端发送ACK报文，随机进入TIME_WAIT状态（只有主动关闭的一方才有此状态），等待2MSL时间后进入CLOSE状态。
- 当服务端收到ACK响应后，直接进入CLOSE状态。
