---
title: ostep-concurrency

order: 3
author: zzys
date: 2023-08-11
category:
- 笔记
tag:
- 操作系统
- 并发
---

本章主要讲了并发的相关知识。

## 并发简介

**多线程**（multi-threaded）程序通常会有多个执行点（PC），线程之间类似于进程，但是有一点区别：同一个进程中的线程是共享地址空间的，能够访问到相同的数据。

所以当线程之间上下文切换时，类似于进程需要将状态保存到PCB中，线程需要将状态保存到**线程控制块**（Thread Control Block，TCB）中，但是地址空间保持不变，即页表不需要被切换（这里应该指的时同一进程之间的线程切换）。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/71bc8787dd0e461b797122271d5ad24a.png" alt="image-20230821104926890" style="zoom:67%;" />

左侧时单线程的地址空间模型，右侧时多线程地址空间模型。

### 不可控的调度

线程创建后的执行顺序是不确定的。

由于在高级语言中的`a = a + 1`在汇编代码中会被分解为三步：

```assembly
mov 0x8049a1c, %eax 
add $0x1, %eax 
mov %eax, 0x8049a1c 
```

在多线程的条件下，假设a初始值为1，有可能会存在一个线程在执行完`add`后，被时钟中断，切换到另一个线程，这个线程成功的执行了三行代码，将a存为2，但是当第一个线程重新执行时，又一次将a存为2，这样就出现了错误。

**竞态条件**（race condition）指的是两个或者以上进程或者线程并发执行时，其最终的结果依赖于进程或者线程执行的精确时序。同时，将这种存在于多个线程之间的访问共享资源的代码片段称为**临界区**（critical section）。

### 解决

一是使用**互斥**（mutual exclusion）。这个属性保证了如果一个线程在临界区内执行，其他线程将被阻止进入临界区。

二是**原子性**（atomicity），保证多个指令要么全部成功，要么全部失败。

## 锁

通过在临界区周围加**锁**（lock），来保证临界区能够像单条原子指令一样执行。

### 锁的基本思想

```c
// 流程示例
lock_t mutex;

lock(&mutex);
...
unlock(&mutex);
```

通过一个锁变量，保证了锁在某一时刻的状态，要么是可用的（available，或 unlocked，或 free），要么是被占用的（acquired，或 locked，或 held），当一个线程上锁后，其他线程只能阻塞等待锁的释放。

> POSIX 库将锁称为互斥量（mutex）
>
> ```c
> pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER; 
> Pthread_mutex_lock(&lock); 
> balance = balance + 1; 
> Pthread_mutex_unlock(&lock); 
> ```

### 锁的评判标准

- **互斥**（mutual exclusion）：这是锁是否有效的基础。
- **公平性**（fairness）：每个竞争线程有公平的机会抢到锁，如果不是公平的，那么有可能由线程会发生**饥饿**（starve）的情况。
- **性能**（performance）：加锁肯定意味着性能的下降，那么如何将性能的影响降到最低是关键。不同的场景对性能的影响都需要考虑：一种是一个 CPU 上多个线程竞争，性能如何？一种是多个 CPU、多个线程竞争时的性能。

### 控制中断

在临界区关闭中断，可以保证指令运行的原子性。

```c
void lock() { 
	DisableInterrupts(); 
} 
void unlock() { 
	EnableInterrupts(); 
} 
```

缺点：

- 需要允许所有调用线程执行特权操作。
- 不支持多处理器。
- 关闭中断导致其他的中断信息丢失。
- 效率低。

### 基础思想

用一个变量来标志锁是否被某些线程占用。第一个线程进入临界区，调用 lock()，检查标志是否为 1（这里不是 1），然后设置标志为 1，表明线程持有该锁。结束临界区时，线程调用 unlock()，清除标志，表示锁未被持有。

```c
typedef struct lock_t { int flag; } lock_t; 

void init(lock_t *mutex) { 
    // 0 -> lock is available, 1 -> held 
    mutex->flag = 0; 
} 

void lock(lock_t *mutex) { 
    while (mutex->flag == 1) // TEST the flag 
    ; // spin-wait (do nothing) 
    mutex->flag = 1; // now SET it! 
} 
 
void unlock(lock_t *mutex) { 
	mutex->flag = 0; 
} 
```

缺点：

- 加锁过程存在临界区代码，会发生线程冲突。
- 阻塞的线程不断自旋等待，效率低。

### 硬件原语

#### 可用的自旋锁

在这里必须要借用硬件支持，最简单的硬件原语是**测试并设置指令**（test-and-set instruction），也叫作**原子交换**（atomic exchange）。可以通过下面的代码理解它的工作流程：

```c
int TestAndSet(int *old_ptr, int new) { 
    int old = *old_ptr; // fetch old value at old_ptr 
    *old_ptr = new; // store 'new' into old_ptr 
    return old; // return the old value 
} 
```

在它执行中，整个过程是原子的。使用它来实现自旋锁：

```c
typedef struct lock_t { 
    int flag; 
} lock_t; 

void init(lock_t *lock) { 
    // 0 indicates that lock is available, 1 that it is held 
    lock->flag = 0; 
} 

 void lock(lock_t *lock) { 
    while (TestAndSet(&lock->flag, 1) == 1) 
    ; // spin-wait (do nothing) 
} 

void unlock(lock_t *lock) { 
    lock->flag = 0; 
} 
```

这样就解决的第一个问题，现在加锁是线程安全的了。对于评价指标：

- 可以互斥。
- 无公平性。
- 在单CPU上，性能很差。但是在多核CPU上，性能还可以。

#### 比较并交换

另一种硬件原语是**比较并交换**（compare-and-swap，CAS），伪代码如下：

```c
int CompareAndSwap(int *ptr, int expected, int new) { 
    int actual = *ptr; 
    if (actual == expected) 
    	*ptr = new; 
    return actual; 
} 
```

检查当前内存值和期待值是否相同，如果相同，则更新为新值。返回内存中的实际值。

可以用它来实现加锁。

```c
void lock(lock_t *lock) { 
	while (CompareAndSwap(&lock->flag, 0, 1) == 1) 
		; // spin 
} 
```

> 其他的一些硬件原语：
>
> - 链接的加载 load-linked）和条件式存储（store-conditional）
> - 获取并增加（fetch-and-add）

### 代替自旋

在保证了加锁的线程安全，现在就需要解决自旋过多消耗CPU资源的问题。

#### yield

```c
void init() { 
    flag = 0;
} 

void lock() { 
    while (TestAndSet(&flag, 1) == 1) 
    yield(); // give up the CPU 
} 

void unlock() { 
    flag = 0;
} 
```

通过使用`yield()`函数，可以使当前线程放弃CPU的使用权，从运行状态转变为就绪状态，重新参与CPU的竞争。

缺点：

- 在大量线程竞争的情况下，会发生频繁的上下文切换，影响性能。
- 可能会发生饥饿的情况。

#### 休眠队列

使用一个队列来保存等待锁的线程。同时park()能够让调用线程休眠，unpark(threadID)则会唤醒 threadID 标识的线程。

```c
typedef struct lock_t {
    // 标识当前的锁是否被占用
    int flag;
    // 充当自旋的作用，用来保证flag和queue的操作是原子的
    int guard;
    // 休眠队列
    queue_t *q;
} lock_t;

void lock_init(lock_t *m) {
    m->flag = 0;
    m->guard = 0;
    queue_init(m->q);
}
void lock(lock_t *m) {
    // 通过自旋获取到锁的操作权
    while (TestAndSet(&m->guard, 1) == 1)
        ; //acquire guard lock by spinning
    
    if (m->flag == 0) {  // 锁没有使用者
        m->flag = 1; // 标识锁被占用
        m->guard = 0; // 放开对锁的操作权
    } else { 
        queue_add(m->q, gettid()); // 将当当前线程的tid加入队列
        m->guard = 0;  // 放开对锁的操作权
        park();  // 使当前线程睡眠
    } 
} 

void unlock(lock_t *m) { 
    // 通过自旋获取到锁的操作权
    while (TestAndSet(&m->guard, 1) == 1) 
        ; //acquire guard lock by spinning 
    if (queue_empty(m->q)) 
        m->flag = 0; // 如果队列中没有线程等待，那么就直接将锁放开
    else 
        unpark(queue_remove(m->q)); // 否则就直接从队列中唤醒下一个线程
    m->guard = 0;  // 放开对锁的操作权
}
```

这里面存在一个线程安全的问题：

- 线程a获取到锁。
- 线程b运行到park后被中断。
- a释放锁需要unpark，但是b还没有park。
- 再次中断，b运行park。

这样b就有可能永远的睡眠下去，这被称为**唤醒/等待竞争**（wakeup/waiting race）。

> Solaris 通过增加了第三个系统调用 separk()来解决这一问题。通过 setpark()，一个线程表明自己马上要 park。如果刚好另一个线程被调度，并且调用了 unpark，那么后续的 park调用就会直接返回，而不是一直睡眠。
>
> ```c
> queue_add(m->q, gettid()); 
> setpark(); // new code 
> m->guard = 0; 
> ```

### Linux下的实现

nptl库（gnu libc 库的一部分）中 lowlevellock.h关于锁的代码：

```c
void mutex_lock (int *mutex) {
    int v;
    // 尝试在锁的最高位上设置为1，如果设置成功，直接返回，无需多余操作
    if (atomic_bit_test_set (mutex, 31) == 0)
        return;
    // 到这里表示，有线程已经占用了锁，那么将mutex加一用来记录有多少等待的线程
    atomic_increment (mutex);
    while (1) {
        // 在第一次进来或每次醒来后，都去尝试获取一遍锁
        if (atomic_bit_test_set (mutex, 31) == 0) {
            // 获取到锁之后，更新计数器
            atomic_decrement (mutex);
            return;
        }
        // 当准备要休眠时，再一次确保当前锁的占用情况
        v = *mutex;
        if (v >= 0)
            continue;
        // 休眠
        futex_wait (mutex, v);
    }
}

void mutex_unlock (int *mutex) {
    /* Adding 0x80000000 to the counter results in 0 if and only if
    there are not other interested threads */
    // 如果只有自己占用锁，那么锁的大小应该是0x80000000，再加上0x80000000后，结果为0
    // 那么就可以直接返回，如果还有等待的线程，就会继续向下走
    if (atomic_add_zero (mutex, 0x80000000))
    	return;
	// 唤醒其他线程
    futex_wake (mutex);
}
```



## 并发数据结构

### 计数器

**无锁计数器**

计数器是最常用的数据结构，下面是一个无锁的计数器实现：

```c
typedef struct counter_t { 
    int value; 
} counter_t; 

void init(counter_t *c) { 
    c->value = 0; 
} 

void increment(counter_t *c) { 
    c->value++; 
} 

void decrement(counter_t *c) { 
    c->value--; 
} 

int get(counter_t *c) { 
    return c->value; 
} 
```

**简单加锁的计数器**

```c
typedef struct counter_t { 
    int value; 
    pthread_mutex_t lock; 
} counter_t; 

void init(counter_t *c) { 
    c->value = 0; 
    Pthread_mutex_init(&c->lock, NULL); 
} 

void increment(counter_t *c) { 
    Pthread_mutex_lock(&c->lock); 
    c->value++; 
    Pthread_mutex_unlock(&c->lock); 
} 

void decrement(counter_t *c) { 
    Pthread_mutex_lock(&c->lock); 
    c->value--; 
    Pthread_mutex_unlock(&c->lock); 
} 

int get(counter_t *c) { 
    Pthread_mutex_lock(&c->lock); 
    int rc = c->value; 
    Pthread_mutex_unlock(&c->lock); 
    return rc; 
} 
```

在临界区代码的周围加入锁，完成了线程安全的任务，但是性能低下。

**懒惰计数器**

我们可以创建一个全局计数器，以及若干的局部计数器，分别对全局计数器和局部计数器加不同的锁，这样锁的竞争就会降低，同时在一定数量之后局部计数器将数量同步给全局计数器。懒惰计数器就是在准确性和性能之间折中。我们称**S**为同步数量，S越大性能越好，但是全局计数器会有更高的延时。

```c
typedef struct counter_t {
    int global; // global count
    pthread_mutex_t glock; // global lock
    int local[NUMCPUS]; // local count (per cpu)
    pthread_mutex_t llock[NUMCPUS]; // ... and locks
    int threshold; // update frequency
} counter_t;

// init: record threshold, init locks, init values
// of all local counts and global count
void init(counter_t *c, int threshold) {  // threshold 就是S，同步数量
    c->threshold = threshold;
    c->global = 0;
    pthread_mutex_init(&c->glock, NULL);
    int i;
    for (i = 0; i < NUMCPUS; i++) {
        c->local[i] = 0;
        pthread_mutex_init(&c->llock[i], NULL); 
    } 
} 

// update: usually, just grab local lock and update local amount 
// once local count has risen by 'threshold', grab global 
// lock and transfer local values to it 
void update(counter_t *c, int threadID, int amt) { 
    pthread_mutex_lock(&c->llock[threadID]); 
    c->local[threadID] += amt; // assumes amt > 0 
    if (c->local[threadID] >= c->threshold) { // transfer to global 
        pthread_mutex_lock(&c->glock); 
        c->global += c->local[threadID]; 
        pthread_mutex_unlock(&c->glock); 
        c->local[threadID] = 0; 
    } 
    pthread_mutex_unlock(&c->llock[threadID]); 
} 

// get: just return global amount (which may not be perfect) 
int get(counter_t *c) { 
    pthread_mutex_lock(&c->glock); 
    int val = c->global; 
    pthread_mutex_unlock(&c->glock); 
    return val; // only approximate! 
}
```

### 链表

对于一个普通的链表，加上一个粗粒度的锁

```c
// basic node structure 
typedef struct node_t { 
    int key; 
    struct node_t *next; 
} node_t; 

// basic list structure (one used per list) 
typedef struct list_t { 
    node_t *head; 
    pthread_mutex_t lock; 
} list_t; 

void List_Init(list_t *L) { 
    L->head = NULL; 
    pthread_mutex_init(&L->lock, NULL); 
} 

void List_Insert(list_t *L, int key) { 
    // 我们只对需要进行保护的临界区代码进行加锁
    // synchronization not needed 
    node_t *new = malloc(sizeof(node_t)); 
    if (new == NULL) { 
        perror("malloc"); 
        return; 
    } 
    new->key = key; 
    
    // just lock critical section 
    pthread_mutex_lock(&L->lock); 
    new->next = L->head; 
    L->head = new; 
    pthread_mutex_unlock(&L->lock); 
} 

int List_Lookup(list_t *L, int key) { 
    // 初始化rv为-1，简化了错误处理
    int rv = -1; 
    pthread_mutex_lock(&L->lock); 
    node_t *curr = L->head; 
    while (curr) { 
        if (curr->key == key) { 
            rv = 0; 
            break; 
        } 
        curr = curr->next; 
    } 
    pthread_mutex_unlock(&L->lock); 
    return rv; // now both success and failure 
} 
```

也可以对每个节点加一个锁，称为**交替锁**（hand-over-hand locking）。

### 并发队列

```c
typedef struct node_t {
    int value;
    struct node_t *next;
} node_t;
typedef struct queue_t {
    node_t *head;
    node_t *tail;
    pthread_mutex_t headLock;  // 头锁
    pthread_mutex_t tailLock;  // 尾锁
} queue_t;
void Queue_Init(queue_t *q) {
    node_t *tmp = malloc(sizeof(node_t));
    tmp->next = NULL;
    q->head = q->tail = tmp;
    pthread_mutex_init(&q->headLock, NULL);
    pthread_mutex_init(&q->tailLock, NULL);
}
void Queue_Enqueue(queue_t *q, int value) {
    node_t *tmp = malloc(sizeof(node_t));
    assert(tmp != NULL); 
    tmp->value = value; 
    tmp->next = NULL; 
    
    pthread_mutex_lock(&q->tailLock); 
    q->tail->next = tmp; 
    q->tail = tmp; 
    pthread_mutex_unlock(&q->tailLock); 
} 

int Queue_Dequeue(queue_t *q, int *value) { 
    pthread_mutex_lock(&q->headLock); 
    node_t *tmp = q->head; 
    node_t *newHead = tmp->next; 
    if (newHead == NULL) { 
        pthread_mutex_unlock(&q->headLock); 
        return -1; // queue was empty 
    } 
    *value = newHead->value; 
    q->head = newHead; 
    pthread_mutex_unlock(&q->headLock); 
    free(tmp); 
    return 0; 
} 
```

在这里没有对整个队列加锁，而是根据队列的FIFO性质，只对头和尾加锁，在插入和删除时，设置虚拟节点方便操作。

### 并发Hash

```c
#define BUCKETS (101) 

typedef struct hash_t { 
    list_t lists[BUCKETS]; 
} hash_t;
void Hash_Init(hash_t *H) {
    int i;
    for (i = 0; i < BUCKETS; i++) {
        List_Init(&H->lists[i]);
    }
}
int Hash_Insert(hash_t *H, int key) {
    int bucket = key % BUCKETS;
    return List_Insert(&H->lists[bucket], key);
}
int Hash_Lookup(hash_t *H, int key) {
    int bucket = key % BUCKETS;
    return List_Lookup(&H->lists[bucket], key);
} 
```

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/55dc7a9c77577cbf0bb343f05c5303c4.png" style="zoom:67%;" />

## 条件变量

处理线程的同步问题即解决一个线程和另一个线程之间的通信问题，通常的一种解决办法是**条件变量**（condition variable），条件变量是一个队列，当条件不满足时，线程会把自己加入队列中，并且进入等待状态。而其他的线程则可以改变条件，唤醒一个或多个等待的队列。

```c
// pthread_cond_wait(pthread_cond_t *c, pthread_mutex_t *m);
// pthread_cond_signal(pthread_cond_t *c);

int done = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t c = PTHREAD_COND_INITIALIZER;

void thr_exit() {
    Pthread_mutex_lock(&m);
    done = 1;  // 修改条件
    Pthread_cond_signal(&c); // 随机唤醒一个位于等待队列等待的线程
    Pthread_mutex_unlock(&m);
}
void *child(void *arg) {
    printf("child\n");
    thr_exit();
    return NULL;
}

void thr_join() { 
    Pthread_mutex_lock(&m); 
    while (done == 0)  // 当条件不满足时，进入条件变量的队列中，并且线程进入wait状态，使用while可以防止虚假唤醒
        Pthread_cond_wait(&c, &m); 
    Pthread_mutex_unlock(&m); 
} 

int main(int argc, char *argv[]) { 
    printf("parent: begin\n"); 
    pthread_t p; 
    Pthread_create(&p, NULL, child, NULL); 
    thr_join(); 
    printf("parent: end\n"); 
    return 0; 
} 
```

在这段代码中，`done`变量和锁是缺一不可的。

- 没有`done`变量：假设子线程创建出来就被直接执行，而父线程没有被执行，子线程在唤醒时就会发现没有等待的线程，而当父线程运行时，就会永远陷入等待。
- 没有加锁操作：由于临界区的存在，当父线程判断$done == 0$后，由子线程运行并将其修改至1，这样父线程就会永久等待。

### 生产者/消费者模型（有界缓冲区）

存在一个或多个**生产者**（producer）向缓冲区中放入数据，一个或多个**消费者**（consumer）从缓冲区中取出数据。

```c
int buffer[MAX];  // 缓冲区
int fill = 0; // 当前写入的索引
int use = 0;  // 当前读出的索引
int count = 0;  // 当前的元素的数量，通过count来确保数据的安全，不会被覆盖。

void put(int value) {
    buffer[fill] = value;
    fill = (fill + 1) % MAX;
    count++;
}
int get() {
    int tmp = buffer[use];
    use = (use + 1) % MAX;
    count--;
    return tmp;
}

cond_t empty, fill;  // 两种类型的条件变量，分别用于消费者和生产者
mutex_t mutex; // 保证缓冲区的线程安全
void *producer(void *arg) {
    int i;
    for (i = 0; i < loops; i++) {
        Pthread_mutex_lock(&mutex); 
        while (count == MAX)  // 当缓冲区的数量满了时，在empty队列上等待
            Pthread_cond_wait(&empty, &mutex); 
        put(i); 
        Pthread_cond_signal(&fill);  // 随机唤醒一个等待的生产者线程
        Pthread_mutex_unlock(&mutex); 
    }
}
void *consumer(void *arg) {
    int i;
    for (i = 0; i < loops; i++) {
        Pthread_mutex_lock(&mutex); 
        while (count == 0) 
            Pthread_cond_wait(&fill, &mutex); 
        int tmp = get(); 
        Pthread_cond_signal(&empty); 
        Pthread_mutex_unlock(&mutex); 
        printf("%d\n", tmp);
    }
}
```

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e7843d224c488deb6fce17e255a426cf.png" style="zoom: 80%;" />

> **覆盖条件**（covering condition），即可以将一个条件变量上的所有线程唤醒。



## 信号量

**信号量**（semaphore）是有一个整数值的对象，在 POSIX 标准中，是 sem_wait()和 sem_post()。

```c
#include <semaphore.h> 
// sem_t 本质是一个长整型类型
sem_t s;  // 如果信号量为负数，那么它的绝对值就是等待的线程数
sem_init(&s, 0, 1);  // 第二个参数为0表示当前的信号量是单个进程内多线程共享的

int sem_wait(sem_t *s) { 
    // 为信号量减去一，如果结果为负数就将当前线程转换到等待状态
} 

int sem_post(sem_t *s) { 
	// 为信号量增加一，如果有线程在等待就唤醒一个
} 
```

### 信号量实现锁

```c
sem_t m; 
sem_init(&m, 0, 1); // 注意这里的1

sem_wait(&m); 
// critical section here 
sem_post(&m); 
```

### 信号量实现条件变量

```c
sem_t s; 

void *child(void *arg) { 
	printf("child\n"); 
	sem_post(&s); 
	return NULL; 
} 

int main(int argc, char *argv[]) { 
	sem_init(&s, 0, 0); // 注意这里的0
	printf("parent: begin\n"); 
	pthread_t c; 
	Pthread_create(c, NULL, child, NULL); 
	sem_wait(&s); 
	printf("parent: end\n"); 
	return 0; 
} 
```

### 缓冲区

使用信号量模拟锁和条件变量来实现缓冲区模型

```c
// 注意这三个条件变量的初始化
sem_t empty; 
sem_t full; 
sem_t mutex; // 模拟互斥锁

void *producer(void *arg) { 
    int i; 
    for (i = 0; i < loops; i++) { 
        sem_wait(&empty); 
        sem_wait(&mutex); 
        put(i); 
        sem_post(&mutex); 
        sem_post(&full); 
    } 
} 

void *consumer(void *arg) { 
    int i; 
    for (i = 0; i < loops; i++) { 
        sem_wait(&full); 
        sem_wait(&mutex); 
        int tmp = get(); 
        sem_post(&mutex); 
        sem_post(&empty); 
        printf("%d\n", tmp); 
    } 
} 

int main(int argc, char *argv[]) { 
    // ... 
    sem_init(&empty, 0, MAX);
    sem_init(&full, 0, 0); 
    sem_init(&mutex, 0, 1);
    // ... 
} 
```

### 读写锁

支持一写或多读。

```c
typedef struct _rwlock_t {
    sem_t lock; // binary semaphore (basic lock)
    sem_t writelock; // used to allow ONE writer or MANY readers
    int readers; // 记录当前的读线程数
} rwlock_t;

void rwlock_init(rwlock_t *rw) {
    rw->readers = 0;
    sem_init(&rw->lock, 0, 1);
    sem_init(&rw->writelock, 0, 1);
}

void rwlock_acquire_readlock(rwlock_t *rw) {
    sem_wait(&rw->lock);
    rw->readers++;
    if (rw->readers == 1)
    	sem_wait(&rw->writelock); // 第一个读线程同时获得写锁
    sem_post(&rw->lock);
}

void rwlock_release_readlock(rwlock_t *rw) {
    sem_wait(&rw->lock);
    rw->readers--;
    if (rw->readers == 0)
        sem_post(&rw->writelock); // 最后一个读线程释放写锁
    sem_post(&rw->lock);
}

void rwlock_acquire_writelock(rwlock_t *rw) {
    sem_wait(&rw->writelock);
}

void rwlock_release_writelock(rwlock_t *rw){
        sem_post(&rw->writelock);
}
```



[信号量和条件变量的关系是什么？](https://www.zhihu.com/question/481951579)

## 并发问题

### 非死锁缺陷

**违反原子性**（atomicity violation）缺陷和**错误顺序**（order  violation）缺陷。一个可以理解为没有满足**互斥**，另一个是没有满足**同步**。

#### 违反原子性

```c
int i = 0;

// T1
if(i != 0) {
    ...
}

// T2
i = 0
```

上述代码就会出现并发问题，解决办法很简单，加入一个互斥锁就好了，当然亦可以采用其他的互斥策略，如CAS。

#### 错误顺序

```c
int i = 0;

// T1
int t1() {
    i = 1;
}

// main
int mMain() {
    create_thread(t1,...);
    assert(i, 1);
}
```

这里假设了T1线程会先运行，所以有可能会发生并发问题，可以采用信号量等同步策略。

```c
int i = 0;
int mtInit = 0;
pthread_mutex_t mtLock = PTHREAD_MUTEX_INITIALIZER; 
pthread_cond_t mtCond = PTHREAD_COND_INITIALIZER;
// T1
int t1() {
    pthread_mutex_lock(&mtLock);	
    i = 1;
    mtInit = 1;
    pthread_cond_signal(&mtCond); 
	pthread_mutex_unlock(&mtLock); 
}

// main
int mMain() {
    create_thread(t1,...);
    pthread_mutex_lock(&mtLock); 
	while (mtInit == 0) 
		pthread_cond_wait(&mtCond, &mtLock); 
	pthread_mutex_unlock(&mtLock); 
    assert(i, 1);
}
```

### 死锁

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/4e568a9b76263b80af55dd043a606eb9.png" alt="image-20230906103302075" style="zoom:67%;" />

#### 条件

只要有一个条件不满足，就不会发生死锁。

- 互斥：线程对于需要的资源进行互斥的访问（例如一个线程抢到锁）。 
- 持有并等待：线程持有了资源（例如已将持有的锁），同时又在等待其他资源（例如，需要获得的锁）。 
- 非抢占：线程获得的资源（例如锁），不能被抢占。 
- 循环等待：线程之间存在一个环路，环路上每个线程都额外持有一个资源，而这 个资源又是下一个线程要申请的。

#### 预防

**循环等待**

可以采用一定的顺序加锁，如**全序**（total ordering）或**偏序**（partial）加锁。

> 一条路有两个方向，一辆车要通过这条路需要同时从一个方向往另一个方向开，如果两辆车相向而行，那就是死锁，如果两辆车同向行驶，那就不会死锁

**持有并等待**

我们可以在最开始，把所有需要用到的锁全部申请，例如设置一个全局锁，在临界区内将所有需要的资源全部申请。

**非抢占**

普通的抢占锁在获取锁失败后会陷入阻塞，可以采用尝试获取锁的方式`tryLock`，当抢占锁失败后返回`-1`。

**互斥**

采用无锁并发的思想，利用`CAS`来预防死锁。

```c
void AtomicIncrement(int *value, int amount) { 
	do { 
		int old = *value; 
	} while (CompareAndSwap(value, old, old + amount) == 0); 
} 
```

**调度实现**

一是将需要不同资源的线程分时进行。

![image-20230906105328627](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/5110733ac7f446ea2bbf95b448c0ca68.png)

二是将需要相同资源的线程使用统一CPU执行。

![image-20230906105340938](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/6e88d2cd67769acd97cb0e6ddde631ee.png)
