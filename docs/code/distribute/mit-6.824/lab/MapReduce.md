---
title: MapReduce

order: 0
author: zzys
date: 2023-09-20
category:
- lab
tag:
- MapReduce
---

本文会将一下我的设计思路，没有做过实验的还是希望自己调试出来再看，本人新手菜鸟，如果有问题还请多多指教。

lab1总体实现起来还是清晰明了的，没有那么难，主要是再三个文件上修修改改，所以以代码和注释为主。

## Task

首先明确MapReduce中的核心：任务。所以在这里定义一些任务的类型：

```go
// 定义任务类型
type TaskType int8

const (
	TNoTask     TaskType = -1
	TMapTask    TaskType = 1
	TReduceTask TaskType = 2
)
// 定义任务状态
type status int8

const (
	UN_ALLOCATION status = -1
	ALLOCATION    status = 1
	COMPLETE      status = 2
	TIMEOUT       status = 3
)
// 任务结构体
type Task struct {
	T              TaskType
    // 用于存放生成文件路径
	TargetFilePath string
	Status         status
	ID             int
    // 用于判断任务是否超时
	startTime      int64
}
type MapTask struct {
	Task
	SourceFilePath string
}
type ReduceTask struct {
	Task
	BuketKey     int
	BuketNumber  int
    // 存放所有的中间文件
	FilePathList []string
}
```

## Worker

worker的设计思路也很好理解

```go
type KeyValue struct {
	Key   string
	Value string
}

type ByKey []KeyValue
// 用于排序
func (a ByKey) Len() int           { return len(a) }
func (a ByKey) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByKey) Less(i, j int) bool { return a[i].Key < a[j].Key }

func ihash(key string) int {
	h := fnv.New32a()
	h.Write([]byte(key))
	return int(h.Sum32() & 0x7fffffff)
}

type MapWorker struct {
	MapTask MapTask
	MapFunc func(string, string) []KeyValue
}
type ReduceWorker struct {
	ReduceTask ReduceTask
	ReduceFunc func(string, []string) string
}
// 工作者类型
type TWorker int8

const (
	NoWorker      = -1
	TMapWorker    = 1
	TReduceWorker = 2
)

type Worker struct {
	T TWorker
	MapWorker
	ReduceWorker
}

func WorkerInit(mapf func(string, string) []KeyValue,
	reducef func(string, []string) string) {
    // 用于注册序列化类型
	gob.Register(MapTask{})
	gob.Register(ReduceTask{})
	worker := &Worker{
		T: NoWorker,
		MapWorker: MapWorker{
			MapFunc: mapf,
		},
		ReduceWorker: ReduceWorker{
			ReduceFunc: reducef,
		},
	}
	count := 0
    // 不断的循环遍历获取任务，当20次获取不到任务时自动退出
	for {
		t, task := PullTask()
		log.Printf("get a new task,info:%+v\n", task)
		if t == TMapTask {
			log.Println("will start mapTask")
			worker.T = TMapWorker
			worker.MapWorker.MapTask = task.(MapTask)
			worker.MapWorker.invoke()
		} else if t == TReduceTask {
			worker.T = TReduceWorker
			worker.ReduceWorker.ReduceTask = task.(ReduceTask)
			log.Println("will start reduceTask")
			worker.ReduceWorker.invoke()
		} else {
			count++
			if count > 20 {
				break
			}
			time.Sleep(1 * time.Second)
		}
		log.Println("will request a new task")
	}

}
func (m *MapWorker) invoke() {
	filename := m.MapTask.SourceFilePath
	file, err := os.Open(filename)
	if err != nil {
		log.Fatalf("cannot open %v", filename)
	}
	content, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf("cannot read %v", filename)
	}
	file.Close()
	kva := m.MapFunc(filename, string(content))
	sort.Sort(ByKey(kva))
	intermediate := "mr-" + strconv.Itoa(m.MapTask.ID)
	ofile, _ := os.Create(intermediate)
	m.MapTask.TargetFilePath = intermediate

	enc := json.NewEncoder(ofile)
	for _, kv := range kva {
		enc.Encode(&kv)
	}
	log.Printf("success create file in %v\n", ofile.Name())
	m.CallbackFinishMapTask()
}
// MapWork结束时向master发送一个消息
func (m *MapWorker) CallbackFinishMapTask() {
	args := CallbackFinishTaskReq{}
	args.TaskId = m.MapTask.ID
	args.FilePath = m.MapTask.TargetFilePath
	rsp := CallbackFinishTaskRsp{}
	f := call("Coordinator.CallbackFinishMapTask", &args, &rsp)
	if f {
		log.Println("commit a mapTask")
	} else {
		log.Fatalf("commit a mapTask fail")
	}
}
// 借鉴MapReduce的思想和官方代码
func (r *ReduceWorker) invoke() {
	bucketKey := r.ReduceTask.BuketKey
	buketNumber := r.ReduceTask.BuketNumber
	var kva []KeyValue
	for _, intermediate := range r.ReduceTask.FilePathList {
		file, err := os.Open(intermediate)
		if err != nil {
			log.Fatalf("cannot open %v", intermediate)
		}
		dec := json.NewDecoder(file)
		for {
			var kv KeyValue
			if err := dec.Decode(&kv); err != nil {
				break
			}
			if ihash(kv.Key)%buketNumber == bucketKey {
				kva = append(kva, kv)
			}
		}
		file.Close()
	}
	outPutFileName := "mr-out-" + strconv.Itoa(r.ReduceTask.ID)
	f, _ := os.Create(outPutFileName)
	i := 0
	sort.Sort(ByKey(kva))
	for i < len(kva) {
		j := i + 1
		for j < len(kva) && kva[j].Key == kva[i].Key {
			j++
		}
		var values []string
		for k := i; k < j; k++ {
			values = append(values, kva[k].Value)
		}
		output := r.ReduceFunc(kva[i].Key, values)
		fmt.Fprintf(f, "%v %v\n", kva[i].Key, output)
		i = j
	}
	r.CallbackFinishReduceTask()
}
// ReduceWork结束时向master发送一个消息
func (r *ReduceWorker) CallbackFinishReduceTask() {
	args := CallbackFinishTaskReq{}
	rsp := CallbackFinishTaskRsp{}
	args.FilePath = r.ReduceTask.TargetFilePath
	args.TaskId = r.ReduceTask.ID
	f := call("Coordinator.CallbackFinishReduceTask", &args, &rsp)
	if f {
		log.Println("commit a reduceTask")
	} else {
		log.Fatalf("commit a reduceTask fail")
	}
}
func PullTask() (TaskType, interface{}) {
	args := PullTaskReq{}
	rsp := PullTaskRsp{}
	call("Coordinator.PullTask", &args, &rsp)
	return rsp.T, rsp.Task
}
```

## Master

这里没有做很多的封装，比如可以搞一些任务队列，做一下生产者消费者模型。

```go
type MapTasks struct {
    // 存放任务，没有去区分类型存放
	MapTaskList           []MapTask
    // 可分配的MapTask，没有什么用，主要用来调试了
	CanAllocateTaskNumber int
    // 完成的任务数，用于Done
	CompleteTaskNumber    int
    // 总分配任务，由于slice存在扩容，所以不能用len来获取
	AllTaskNumber         int
	*sync.RWMutex
}

type ReduceTasks struct {
	BuketNumber           int
	ReduceTaskList        []ReduceTask
	CompleteTaskNumber    int
	CanAllocateTaskNumber int
	*sync.RWMutex
}

type Coordinator struct {
	ReduceTasks
	MapTasks
}

func MakeCoordinator(files []string, nReduce int) *Coordinator {
	gob.Register(MapTask{})
	gob.Register(ReduceTask{})
	r := ReduceTasks{
		BuketNumber:           nReduce,
		RWMutex:               &sync.RWMutex{},
		CanAllocateTaskNumber: 0,
		ReduceTaskList:        []ReduceTask{},
	}

	m := MapTasks{
		MapTaskList:           []MapTask{},
		CanAllocateTaskNumber: 0,
		AllTaskNumber:         0,
		RWMutex:               &sync.RWMutex{},
	}
	m.init(files)
	c := Coordinator{
		ReduceTasks: r,
		MapTasks:    m,
	}
	c.server()
    // 开一个协程，不断的判断是否有超时任务
	go c.tailCheck()
	return &c
}

func (m *MapTasks) init(files []string) {
	m.Lock()
	defer m.Unlock()
	for _, file := range files {
		m.MapTaskList = append(m.MapTaskList, MapTask{
			Task: Task{
				T:              TMapTask,
				TargetFilePath: "",
				startTime:      0,
				Status:         UN_ALLOCATION,
				ID:             len(m.MapTaskList),
			},
			SourceFilePath: file,
		})
	}
	m.CanAllocateTaskNumber = len(files)
	m.AllTaskNumber = len(files)
	log.Printf("now have %v maptask\n", len(files))
}
// 注意reduce的任务和map的任务不一样，不是刚开始就分配，而是在map任务完成后分配，见122行
func (r *ReduceTasks) init(files []string) {
	r.Lock()
	defer r.Unlock()
    // 按照桶的个数分配任务
	for i := 0; i < r.BuketNumber; i++ {
		r.ReduceTaskList = append(r.ReduceTaskList, ReduceTask{
			Task: Task{
				T:              TReduceTask,
				TargetFilePath: "",
				Status:         UN_ALLOCATION,
				ID:             len(r.ReduceTaskList),
				startTime:      0,
			},
			BuketNumber:  r.BuketNumber,
			BuketKey:     i,
			FilePathList: files,
		})
	}
}
// 先查Map任务，再查Reduce任务，这里可以用一下CanAllocateTaskNumber
func (c *Coordinator) PullTask(args *PullTaskReq, reply *PullTaskRsp) error {
	mt := c.getMapTask()
	reply.Task = mt
	reply.T = mt.T
	if mt.T != TNoTask {
		log.Printf("Allocate a MapTask , id is %v,type is %v, path is: %v\n",
			mt.ID, mt.T, mt.SourceFilePath)
		return nil
	}
	rt := c.getReduceTask()
	reply.Task = rt
	reply.T = rt.T
	if rt.T != TNoTask {
		log.Printf("Allocate a ReduceTaskList , id is %v,type is %v\n",
			rt.ID, rt.T)
		return nil
	}
	log.Printf("have not a task to allocate\n")
	return nil
}
func (c *Coordinator) CallbackFinishMapTask(args *CallbackFinishTaskReq, reply *CallbackFinishTaskRsp) error {
	taskId := args.TaskId
	filePath := args.FilePath
	f := false
	c.MapTasks.Lock()
	c.MapTaskList[taskId].Status = COMPLETE
	log.Println("a map task finish")
	c.MapTasks.CompleteTaskNumber++
	if c.MapTasks.CompleteTaskNumber == c.MapTasks.AllTaskNumber {
		log.Println("all map task finish")
		f = true
	}
	c.MapTaskList[taskId].TargetFilePath = filePath
	c.MapTasks.Unlock()

	if f {
		c.MapTasks.RLock()
		var fileList []string
		for _, mapTask := range c.MapTaskList {
			fileList = append(fileList, mapTask.TargetFilePath)
		}
		c.MapTasks.RUnlock()
		c.ReduceTasks.init(fileList)
		log.Println("start reduce tasks")
	}
	return nil
}
func (c *Coordinator) CallbackFinishReduceTask(args *CallbackFinishTaskReq, reply *CallbackFinishTaskRsp) error {
	taskId := args.TaskId
	filePath := args.FilePath
	c.ReduceTasks.Lock()
	defer c.ReduceTasks.Unlock()
	c.ReduceTaskList[taskId].Status = COMPLETE
	c.ReduceTasks.CompleteTaskNumber++
	log.Println("a reduce task finish")
	c.ReduceTaskList[taskId].TargetFilePath = filePath
	return nil
}

func (c *Coordinator) getReduceTask() ReduceTask {
	c.ReduceTasks.Lock()
	defer c.ReduceTasks.Unlock()
	for i, task := range c.ReduceTaskList {
		if task.Status == UN_ALLOCATION || task.Status == TIMEOUT {
			c.ReduceTaskList[i].Status = ALLOCATION
			c.ReduceTasks.CanAllocateTaskNumber--
			c.ReduceTaskList[i].startTime = time.Now().Unix()
			return task
		}
	}
	return ReduceTask{Task: Task{T: TNoTask}}
}

func (c *Coordinator) getMapTask() MapTask {
	c.MapTasks.Lock()
	defer c.MapTasks.Unlock()
	for i, task := range c.MapTasks.MapTaskList {
		if task.Status == UN_ALLOCATION || task.Status == TIMEOUT {
			c.MapTasks.CanAllocateTaskNumber--
			c.MapTaskList[i].Status = ALLOCATION
			c.MapTaskList[i].startTime = time.Now().Unix()
			return task
		}
	}
	return MapTask{Task: Task{T: TNoTask}}
}
func (c *Coordinator) getCanAllocateTaskNumber() (int, int) {
	c.MapTasks.RLock()
	mts := c.MapTasks.CanAllocateTaskNumber
	c.MapTasks.RUnlock()
	c.ReduceTasks.RLock()
	rts := c.ReduceTasks.CanAllocateTaskNumber
	c.ReduceTasks.RUnlock()
	return mts, rts
}
func (c *Coordinator) Done() bool {
	ret := false
	c.ReduceTasks.RLock()
	defer c.ReduceTasks.RUnlock()
	if c.ReduceTasks.CompleteTaskNumber == c.ReduceTasks.BuketNumber {
		ret = true
	}
	return ret
}
func (c *Coordinator) tailCheck() {
	for {
		time.Sleep(10)
		c.MapTasks.Lock()
		for i, task := range c.MapTasks.MapTaskList {
			if task.Status == ALLOCATION {
				t := time.Since(time.Unix(task.startTime, 0))
				if t > time.Second*10 {
					c.MapTaskList[i].Status = TIMEOUT
					c.MapTasks.CanAllocateTaskNumber++
					log.Printf("a map task timeout,t:%v\n", t)
				}
			}
		}
		c.MapTasks.Unlock()
		c.ReduceTasks.Lock()
		for i, task := range c.ReduceTasks.ReduceTaskList {
			if task.Status == ALLOCATION {
				t := time.Since(time.Unix(task.startTime, 0))
				if t > time.Second*10 {
					c.ReduceTaskList[i].Status = TIMEOUT
					c.ReduceTasks.CanAllocateTaskNumber++
					log.Println("a reduce task timeout")
				}
			}
		}
		c.ReduceTasks.Unlock()
	}
}
```

