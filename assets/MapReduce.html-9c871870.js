import{_ as n,o as s,c as a,e as t}from"./app-20538318.js";const p={},o=t(`<p>本文会将一下我的设计思路，没有做过实验的还是希望自己调试出来再看，本人新手菜鸟，如果有问题还请多多指教。</p><p>lab1总体实现起来还是清晰明了的，没有那么难，主要是再三个文件上修修改改，所以以代码和注释为主。</p><h2 id="task" tabindex="-1"><a class="header-anchor" href="#task" aria-hidden="true">#</a> Task</h2><p>首先明确MapReduce中的核心：任务。所以在这里定义一些任务的类型：</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// 定义任务类型</span>
<span class="token keyword">type</span> TaskType <span class="token builtin">int8</span>

<span class="token keyword">const</span> <span class="token punctuation">(</span>
	TNoTask     TaskType <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
	TMapTask    TaskType <span class="token operator">=</span> <span class="token number">1</span>
	TReduceTask TaskType <span class="token operator">=</span> <span class="token number">2</span>
<span class="token punctuation">)</span>
<span class="token comment">// 定义任务状态</span>
<span class="token keyword">type</span> status <span class="token builtin">int8</span>

<span class="token keyword">const</span> <span class="token punctuation">(</span>
	UN_ALLOCATION status <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
	ALLOCATION    status <span class="token operator">=</span> <span class="token number">1</span>
	COMPLETE      status <span class="token operator">=</span> <span class="token number">2</span>
	TIMEOUT       status <span class="token operator">=</span> <span class="token number">3</span>
<span class="token punctuation">)</span>
<span class="token comment">// 任务结构体</span>
<span class="token keyword">type</span> Task <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	T              TaskType
    <span class="token comment">// 用于存放生成文件路径</span>
	TargetFilePath <span class="token builtin">string</span>
	Status         status
	ID             <span class="token builtin">int</span>
    <span class="token comment">// 用于判断任务是否超时</span>
	startTime      <span class="token builtin">int64</span>
<span class="token punctuation">}</span>
<span class="token keyword">type</span> MapTask <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Task
	SourceFilePath <span class="token builtin">string</span>
<span class="token punctuation">}</span>
<span class="token keyword">type</span> ReduceTask <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Task
	BuketKey     <span class="token builtin">int</span>
	BuketNumber  <span class="token builtin">int</span>
    <span class="token comment">// 存放所有的中间文件</span>
	FilePathList <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="worker" tabindex="-1"><a class="header-anchor" href="#worker" aria-hidden="true">#</a> Worker</h2><p>worker的设计思路也很好理解</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> KeyValue <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Key   <span class="token builtin">string</span>
	Value <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> ByKey <span class="token punctuation">[</span><span class="token punctuation">]</span>KeyValue
<span class="token comment">// 用于排序</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>a ByKey<span class="token punctuation">)</span> <span class="token function">Len</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">int</span>           <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token function">len</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span> <span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>a ByKey<span class="token punctuation">)</span> <span class="token function">Swap</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> j <span class="token builtin">int</span><span class="token punctuation">)</span>      <span class="token punctuation">{</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> a<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> a<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>a ByKey<span class="token punctuation">)</span> <span class="token function">Less</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> j <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">bool</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Key <span class="token operator">&lt;</span> a<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">.</span>Key <span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">ihash</span><span class="token punctuation">(</span>key <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
	h <span class="token operator">:=</span> fnv<span class="token punctuation">.</span><span class="token function">New32a</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	h<span class="token punctuation">.</span><span class="token function">Write</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> <span class="token function">int</span><span class="token punctuation">(</span>h<span class="token punctuation">.</span><span class="token function">Sum32</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0x7fffffff</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> MapWorker <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	MapTask MapTask
	MapFunc <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>KeyValue
<span class="token punctuation">}</span>
<span class="token keyword">type</span> ReduceWorker <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	ReduceTask ReduceTask
	ReduceFunc <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>
<span class="token comment">// 工作者类型</span>
<span class="token keyword">type</span> TWorker <span class="token builtin">int8</span>

<span class="token keyword">const</span> <span class="token punctuation">(</span>
	NoWorker      <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
	TMapWorker    <span class="token operator">=</span> <span class="token number">1</span>
	TReduceWorker <span class="token operator">=</span> <span class="token number">2</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Worker <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	T TWorker
	MapWorker
	ReduceWorker
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">WorkerInit</span><span class="token punctuation">(</span>mapf <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>KeyValue<span class="token punctuation">,</span>
	reducef <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 用于注册序列化类型</span>
	gob<span class="token punctuation">.</span><span class="token function">Register</span><span class="token punctuation">(</span>MapTask<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	gob<span class="token punctuation">.</span><span class="token function">Register</span><span class="token punctuation">(</span>ReduceTask<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	worker <span class="token operator">:=</span> <span class="token operator">&amp;</span>Worker<span class="token punctuation">{</span>
		T<span class="token punctuation">:</span> NoWorker<span class="token punctuation">,</span>
		MapWorker<span class="token punctuation">:</span> MapWorker<span class="token punctuation">{</span>
			MapFunc<span class="token punctuation">:</span> mapf<span class="token punctuation">,</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		ReduceWorker<span class="token punctuation">:</span> ReduceWorker<span class="token punctuation">{</span>
			ReduceFunc<span class="token punctuation">:</span> reducef<span class="token punctuation">,</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
	count <span class="token operator">:=</span> <span class="token number">0</span>
    <span class="token comment">// 不断的循环遍历获取任务，当20次获取不到任务时自动退出</span>
	<span class="token keyword">for</span> <span class="token punctuation">{</span>
		t<span class="token punctuation">,</span> task <span class="token operator">:=</span> <span class="token function">PullTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;get a new task,info:%+v\\n&quot;</span><span class="token punctuation">,</span> task<span class="token punctuation">)</span>
		<span class="token keyword">if</span> t <span class="token operator">==</span> TMapTask <span class="token punctuation">{</span>
			log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;will start mapTask&quot;</span><span class="token punctuation">)</span>
			worker<span class="token punctuation">.</span>T <span class="token operator">=</span> TMapWorker
			worker<span class="token punctuation">.</span>MapWorker<span class="token punctuation">.</span>MapTask <span class="token operator">=</span> task<span class="token punctuation">.</span><span class="token punctuation">(</span>MapTask<span class="token punctuation">)</span>
			worker<span class="token punctuation">.</span>MapWorker<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> t <span class="token operator">==</span> TReduceTask <span class="token punctuation">{</span>
			worker<span class="token punctuation">.</span>T <span class="token operator">=</span> TReduceWorker
			worker<span class="token punctuation">.</span>ReduceWorker<span class="token punctuation">.</span>ReduceTask <span class="token operator">=</span> task<span class="token punctuation">.</span><span class="token punctuation">(</span>ReduceTask<span class="token punctuation">)</span>
			log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;will start reduceTask&quot;</span><span class="token punctuation">)</span>
			worker<span class="token punctuation">.</span>ReduceWorker<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			count<span class="token operator">++</span>
			<span class="token keyword">if</span> count <span class="token operator">&gt;</span> <span class="token number">20</span> <span class="token punctuation">{</span>
				<span class="token keyword">break</span>
			<span class="token punctuation">}</span>
			time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;will request a new task&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>m <span class="token operator">*</span>MapWorker<span class="token punctuation">)</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	filename <span class="token operator">:=</span> m<span class="token punctuation">.</span>MapTask<span class="token punctuation">.</span>SourceFilePath
	file<span class="token punctuation">,</span> err <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">Open</span><span class="token punctuation">(</span>filename<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Fatalf</span><span class="token punctuation">(</span><span class="token string">&quot;cannot open %v&quot;</span><span class="token punctuation">,</span> filename<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	content<span class="token punctuation">,</span> err <span class="token operator">:=</span> ioutil<span class="token punctuation">.</span><span class="token function">ReadAll</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Fatalf</span><span class="token punctuation">(</span><span class="token string">&quot;cannot read %v&quot;</span><span class="token punctuation">,</span> filename<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	file<span class="token punctuation">.</span><span class="token function">Close</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	kva <span class="token operator">:=</span> m<span class="token punctuation">.</span><span class="token function">MapFunc</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token function">string</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span>
	sort<span class="token punctuation">.</span><span class="token function">Sort</span><span class="token punctuation">(</span><span class="token function">ByKey</span><span class="token punctuation">(</span>kva<span class="token punctuation">)</span><span class="token punctuation">)</span>
	intermediate <span class="token operator">:=</span> <span class="token string">&quot;mr-&quot;</span> <span class="token operator">+</span> strconv<span class="token punctuation">.</span><span class="token function">Itoa</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span>MapTask<span class="token punctuation">.</span>ID<span class="token punctuation">)</span>
	ofile<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">Create</span><span class="token punctuation">(</span>intermediate<span class="token punctuation">)</span>
	m<span class="token punctuation">.</span>MapTask<span class="token punctuation">.</span>TargetFilePath <span class="token operator">=</span> intermediate

	enc <span class="token operator">:=</span> json<span class="token punctuation">.</span><span class="token function">NewEncoder</span><span class="token punctuation">(</span>ofile<span class="token punctuation">)</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> kv <span class="token operator">:=</span> <span class="token keyword">range</span> kva <span class="token punctuation">{</span>
		enc<span class="token punctuation">.</span><span class="token function">Encode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>kv<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;success create file in %v\\n&quot;</span><span class="token punctuation">,</span> ofile<span class="token punctuation">.</span><span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	m<span class="token punctuation">.</span><span class="token function">CallbackFinishMapTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token comment">// MapWork结束时向master发送一个消息</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>m <span class="token operator">*</span>MapWorker<span class="token punctuation">)</span> <span class="token function">CallbackFinishMapTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	args <span class="token operator">:=</span> CallbackFinishTaskReq<span class="token punctuation">{</span><span class="token punctuation">}</span>
	args<span class="token punctuation">.</span>TaskId <span class="token operator">=</span> m<span class="token punctuation">.</span>MapTask<span class="token punctuation">.</span>ID
	args<span class="token punctuation">.</span>FilePath <span class="token operator">=</span> m<span class="token punctuation">.</span>MapTask<span class="token punctuation">.</span>TargetFilePath
	rsp <span class="token operator">:=</span> CallbackFinishTaskRsp<span class="token punctuation">{</span><span class="token punctuation">}</span>
	f <span class="token operator">:=</span> <span class="token function">call</span><span class="token punctuation">(</span><span class="token string">&quot;Coordinator.CallbackFinishMapTask&quot;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>args<span class="token punctuation">,</span> <span class="token operator">&amp;</span>rsp<span class="token punctuation">)</span>
	<span class="token keyword">if</span> f <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;commit a mapTask&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Fatalf</span><span class="token punctuation">(</span><span class="token string">&quot;commit a mapTask fail&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token comment">// 借鉴MapReduce的思想和官方代码</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>ReduceWorker<span class="token punctuation">)</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	bucketKey <span class="token operator">:=</span> r<span class="token punctuation">.</span>ReduceTask<span class="token punctuation">.</span>BuketKey
	buketNumber <span class="token operator">:=</span> r<span class="token punctuation">.</span>ReduceTask<span class="token punctuation">.</span>BuketNumber
	<span class="token keyword">var</span> kva <span class="token punctuation">[</span><span class="token punctuation">]</span>KeyValue
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> intermediate <span class="token operator">:=</span> <span class="token keyword">range</span> r<span class="token punctuation">.</span>ReduceTask<span class="token punctuation">.</span>FilePathList <span class="token punctuation">{</span>
		file<span class="token punctuation">,</span> err <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">Open</span><span class="token punctuation">(</span>intermediate<span class="token punctuation">)</span>
		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			log<span class="token punctuation">.</span><span class="token function">Fatalf</span><span class="token punctuation">(</span><span class="token string">&quot;cannot open %v&quot;</span><span class="token punctuation">,</span> intermediate<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		dec <span class="token operator">:=</span> json<span class="token punctuation">.</span><span class="token function">NewDecoder</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>
		<span class="token keyword">for</span> <span class="token punctuation">{</span>
			<span class="token keyword">var</span> kv KeyValue
			<span class="token keyword">if</span> err <span class="token operator">:=</span> dec<span class="token punctuation">.</span><span class="token function">Decode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>kv<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
				<span class="token keyword">break</span>
			<span class="token punctuation">}</span>
			<span class="token keyword">if</span> <span class="token function">ihash</span><span class="token punctuation">(</span>kv<span class="token punctuation">.</span>Key<span class="token punctuation">)</span><span class="token operator">%</span>buketNumber <span class="token operator">==</span> bucketKey <span class="token punctuation">{</span>
				kva <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>kva<span class="token punctuation">,</span> kv<span class="token punctuation">)</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
		file<span class="token punctuation">.</span><span class="token function">Close</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	outPutFileName <span class="token operator">:=</span> <span class="token string">&quot;mr-out-&quot;</span> <span class="token operator">+</span> strconv<span class="token punctuation">.</span><span class="token function">Itoa</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>ReduceTask<span class="token punctuation">.</span>ID<span class="token punctuation">)</span>
	f<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">Create</span><span class="token punctuation">(</span>outPutFileName<span class="token punctuation">)</span>
	i <span class="token operator">:=</span> <span class="token number">0</span>
	sort<span class="token punctuation">.</span><span class="token function">Sort</span><span class="token punctuation">(</span><span class="token function">ByKey</span><span class="token punctuation">(</span>kva<span class="token punctuation">)</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> i <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>kva<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		j <span class="token operator">:=</span> i <span class="token operator">+</span> <span class="token number">1</span>
		<span class="token keyword">for</span> j <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>kva<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> kva<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">.</span>Key <span class="token operator">==</span> kva<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Key <span class="token punctuation">{</span>
			j<span class="token operator">++</span>
		<span class="token punctuation">}</span>
		<span class="token keyword">var</span> values <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>
		<span class="token keyword">for</span> k <span class="token operator">:=</span> i<span class="token punctuation">;</span> k <span class="token operator">&lt;</span> j<span class="token punctuation">;</span> k<span class="token operator">++</span> <span class="token punctuation">{</span>
			values <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>values<span class="token punctuation">,</span> kva<span class="token punctuation">[</span>k<span class="token punctuation">]</span><span class="token punctuation">.</span>Value<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		output <span class="token operator">:=</span> r<span class="token punctuation">.</span><span class="token function">ReduceFunc</span><span class="token punctuation">(</span>kva<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Key<span class="token punctuation">,</span> values<span class="token punctuation">)</span>
		fmt<span class="token punctuation">.</span><span class="token function">Fprintf</span><span class="token punctuation">(</span>f<span class="token punctuation">,</span> <span class="token string">&quot;%v %v\\n&quot;</span><span class="token punctuation">,</span> kva<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Key<span class="token punctuation">,</span> output<span class="token punctuation">)</span>
		i <span class="token operator">=</span> j
	<span class="token punctuation">}</span>
	r<span class="token punctuation">.</span><span class="token function">CallbackFinishReduceTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token comment">// ReduceWork结束时向master发送一个消息</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>ReduceWorker<span class="token punctuation">)</span> <span class="token function">CallbackFinishReduceTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	args <span class="token operator">:=</span> CallbackFinishTaskReq<span class="token punctuation">{</span><span class="token punctuation">}</span>
	rsp <span class="token operator">:=</span> CallbackFinishTaskRsp<span class="token punctuation">{</span><span class="token punctuation">}</span>
	args<span class="token punctuation">.</span>FilePath <span class="token operator">=</span> r<span class="token punctuation">.</span>ReduceTask<span class="token punctuation">.</span>TargetFilePath
	args<span class="token punctuation">.</span>TaskId <span class="token operator">=</span> r<span class="token punctuation">.</span>ReduceTask<span class="token punctuation">.</span>ID
	f <span class="token operator">:=</span> <span class="token function">call</span><span class="token punctuation">(</span><span class="token string">&quot;Coordinator.CallbackFinishReduceTask&quot;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>args<span class="token punctuation">,</span> <span class="token operator">&amp;</span>rsp<span class="token punctuation">)</span>
	<span class="token keyword">if</span> f <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;commit a reduceTask&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Fatalf</span><span class="token punctuation">(</span><span class="token string">&quot;commit a reduceTask fail&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token function">PullTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>TaskType<span class="token punctuation">,</span> <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	args <span class="token operator">:=</span> PullTaskReq<span class="token punctuation">{</span><span class="token punctuation">}</span>
	rsp <span class="token operator">:=</span> PullTaskRsp<span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token function">call</span><span class="token punctuation">(</span><span class="token string">&quot;Coordinator.PullTask&quot;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>args<span class="token punctuation">,</span> <span class="token operator">&amp;</span>rsp<span class="token punctuation">)</span>
	<span class="token keyword">return</span> rsp<span class="token punctuation">.</span>T<span class="token punctuation">,</span> rsp<span class="token punctuation">.</span>Task
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="master" tabindex="-1"><a class="header-anchor" href="#master" aria-hidden="true">#</a> Master</h2><p>这里没有做很多的封装，比如可以搞一些任务队列，做一下生产者消费者模型。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> MapTasks <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    <span class="token comment">// 存放任务，没有去区分类型存放</span>
	MapTaskList           <span class="token punctuation">[</span><span class="token punctuation">]</span>MapTask
    <span class="token comment">// 可分配的MapTask，没有什么用，主要用来调试了</span>
	CanAllocateTaskNumber <span class="token builtin">int</span>
    <span class="token comment">// 完成的任务数，用于Done</span>
	CompleteTaskNumber    <span class="token builtin">int</span>
    <span class="token comment">// 总分配任务，由于slice存在扩容，所以不能用len来获取</span>
	AllTaskNumber         <span class="token builtin">int</span>
	<span class="token operator">*</span>sync<span class="token punctuation">.</span>RWMutex
<span class="token punctuation">}</span>

<span class="token keyword">type</span> ReduceTasks <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	BuketNumber           <span class="token builtin">int</span>
	ReduceTaskList        <span class="token punctuation">[</span><span class="token punctuation">]</span>ReduceTask
	CompleteTaskNumber    <span class="token builtin">int</span>
	CanAllocateTaskNumber <span class="token builtin">int</span>
	<span class="token operator">*</span>sync<span class="token punctuation">.</span>RWMutex
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Coordinator <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	ReduceTasks
	MapTasks
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">MakeCoordinator</span><span class="token punctuation">(</span>files <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">,</span> nReduce <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">*</span>Coordinator <span class="token punctuation">{</span>
	gob<span class="token punctuation">.</span><span class="token function">Register</span><span class="token punctuation">(</span>MapTask<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	gob<span class="token punctuation">.</span><span class="token function">Register</span><span class="token punctuation">(</span>ReduceTask<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	r <span class="token operator">:=</span> ReduceTasks<span class="token punctuation">{</span>
		BuketNumber<span class="token punctuation">:</span>           nReduce<span class="token punctuation">,</span>
		RWMutex<span class="token punctuation">:</span>               <span class="token operator">&amp;</span>sync<span class="token punctuation">.</span>RWMutex<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
		CanAllocateTaskNumber<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
		ReduceTaskList<span class="token punctuation">:</span>        <span class="token punctuation">[</span><span class="token punctuation">]</span>ReduceTask<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>

	m <span class="token operator">:=</span> MapTasks<span class="token punctuation">{</span>
		MapTaskList<span class="token punctuation">:</span>           <span class="token punctuation">[</span><span class="token punctuation">]</span>MapTask<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
		CanAllocateTaskNumber<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
		AllTaskNumber<span class="token punctuation">:</span>         <span class="token number">0</span><span class="token punctuation">,</span>
		RWMutex<span class="token punctuation">:</span>               <span class="token operator">&amp;</span>sync<span class="token punctuation">.</span>RWMutex<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
	m<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span>files<span class="token punctuation">)</span>
	c <span class="token operator">:=</span> Coordinator<span class="token punctuation">{</span>
		ReduceTasks<span class="token punctuation">:</span> r<span class="token punctuation">,</span>
		MapTasks<span class="token punctuation">:</span>    m<span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
	c<span class="token punctuation">.</span><span class="token function">server</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// 开一个协程，不断的判断是否有超时任务</span>
	<span class="token keyword">go</span> c<span class="token punctuation">.</span><span class="token function">tailCheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> <span class="token operator">&amp;</span>c
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m <span class="token operator">*</span>MapTasks<span class="token punctuation">)</span> <span class="token function">init</span><span class="token punctuation">(</span>files <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	m<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> m<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> file <span class="token operator">:=</span> <span class="token keyword">range</span> files <span class="token punctuation">{</span>
		m<span class="token punctuation">.</span>MapTaskList <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">,</span> MapTask<span class="token punctuation">{</span>
			Task<span class="token punctuation">:</span> Task<span class="token punctuation">{</span>
				T<span class="token punctuation">:</span>              TMapTask<span class="token punctuation">,</span>
				TargetFilePath<span class="token punctuation">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
				startTime<span class="token punctuation">:</span>      <span class="token number">0</span><span class="token punctuation">,</span>
				Status<span class="token punctuation">:</span>         UN_ALLOCATION<span class="token punctuation">,</span>
				ID<span class="token punctuation">:</span>             <span class="token function">len</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">)</span><span class="token punctuation">,</span>
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
			SourceFilePath<span class="token punctuation">:</span> file<span class="token punctuation">,</span>
		<span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	m<span class="token punctuation">.</span>CanAllocateTaskNumber <span class="token operator">=</span> <span class="token function">len</span><span class="token punctuation">(</span>files<span class="token punctuation">)</span>
	m<span class="token punctuation">.</span>AllTaskNumber <span class="token operator">=</span> <span class="token function">len</span><span class="token punctuation">(</span>files<span class="token punctuation">)</span>
	log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;now have %v maptask\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>files<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token comment">// 注意reduce的任务和map的任务不一样，不是刚开始就分配，而是在map任务完成后分配，见122行</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>ReduceTasks<span class="token punctuation">)</span> <span class="token function">init</span><span class="token punctuation">(</span>files <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	r<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> r<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// 按照桶的个数分配任务</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> r<span class="token punctuation">.</span>BuketNumber<span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		r<span class="token punctuation">.</span>ReduceTaskList <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">,</span> ReduceTask<span class="token punctuation">{</span>
			Task<span class="token punctuation">:</span> Task<span class="token punctuation">{</span>
				T<span class="token punctuation">:</span>              TReduceTask<span class="token punctuation">,</span>
				TargetFilePath<span class="token punctuation">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
				Status<span class="token punctuation">:</span>         UN_ALLOCATION<span class="token punctuation">,</span>
				ID<span class="token punctuation">:</span>             <span class="token function">len</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">)</span><span class="token punctuation">,</span>
				startTime<span class="token punctuation">:</span>      <span class="token number">0</span><span class="token punctuation">,</span>
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
			BuketNumber<span class="token punctuation">:</span>  r<span class="token punctuation">.</span>BuketNumber<span class="token punctuation">,</span>
			BuketKey<span class="token punctuation">:</span>     i<span class="token punctuation">,</span>
			FilePathList<span class="token punctuation">:</span> files<span class="token punctuation">,</span>
		<span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token comment">// 先查Map任务，再查Reduce任务，这里可以用一下CanAllocateTaskNumber</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">PullTask</span><span class="token punctuation">(</span>args <span class="token operator">*</span>PullTaskReq<span class="token punctuation">,</span> reply <span class="token operator">*</span>PullTaskRsp<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	mt <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">getMapTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	reply<span class="token punctuation">.</span>Task <span class="token operator">=</span> mt
	reply<span class="token punctuation">.</span>T <span class="token operator">=</span> mt<span class="token punctuation">.</span>T
	<span class="token keyword">if</span> mt<span class="token punctuation">.</span>T <span class="token operator">!=</span> TNoTask <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Allocate a MapTask , id is %v,type is %v, path is: %v\\n&quot;</span><span class="token punctuation">,</span>
			mt<span class="token punctuation">.</span>ID<span class="token punctuation">,</span> mt<span class="token punctuation">.</span>T<span class="token punctuation">,</span> mt<span class="token punctuation">.</span>SourceFilePath<span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token boolean">nil</span>
	<span class="token punctuation">}</span>
	rt <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">getReduceTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	reply<span class="token punctuation">.</span>Task <span class="token operator">=</span> rt
	reply<span class="token punctuation">.</span>T <span class="token operator">=</span> rt<span class="token punctuation">.</span>T
	<span class="token keyword">if</span> rt<span class="token punctuation">.</span>T <span class="token operator">!=</span> TNoTask <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Allocate a ReduceTaskList , id is %v,type is %v\\n&quot;</span><span class="token punctuation">,</span>
			rt<span class="token punctuation">.</span>ID<span class="token punctuation">,</span> rt<span class="token punctuation">.</span>T<span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token boolean">nil</span>
	<span class="token punctuation">}</span>
	log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;have not a task to allocate\\n&quot;</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">CallbackFinishMapTask</span><span class="token punctuation">(</span>args <span class="token operator">*</span>CallbackFinishTaskReq<span class="token punctuation">,</span> reply <span class="token operator">*</span>CallbackFinishTaskRsp<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	taskId <span class="token operator">:=</span> args<span class="token punctuation">.</span>TaskId
	filePath <span class="token operator">:=</span> args<span class="token punctuation">.</span>FilePath
	f <span class="token operator">:=</span> <span class="token boolean">false</span>
	c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	c<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">[</span>taskId<span class="token punctuation">]</span><span class="token punctuation">.</span>Status <span class="token operator">=</span> COMPLETE
	log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;a map task finish&quot;</span><span class="token punctuation">)</span>
	c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>CompleteTaskNumber<span class="token operator">++</span>
	<span class="token keyword">if</span> c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>CompleteTaskNumber <span class="token operator">==</span> c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>AllTaskNumber <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;all map task finish&quot;</span><span class="token punctuation">)</span>
		f <span class="token operator">=</span> <span class="token boolean">true</span>
	<span class="token punctuation">}</span>
	c<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">[</span>taskId<span class="token punctuation">]</span><span class="token punctuation">.</span>TargetFilePath <span class="token operator">=</span> filePath
	c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token keyword">if</span> f <span class="token punctuation">{</span>
		c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">RLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">var</span> fileList <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>
		<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> mapTask <span class="token operator">:=</span> <span class="token keyword">range</span> c<span class="token punctuation">.</span>MapTaskList <span class="token punctuation">{</span>
			fileList <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>fileList<span class="token punctuation">,</span> mapTask<span class="token punctuation">.</span>TargetFilePath<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">RUnlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span>fileList<span class="token punctuation">)</span>
		log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;start reduce tasks&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">CallbackFinishReduceTask</span><span class="token punctuation">(</span>args <span class="token operator">*</span>CallbackFinishTaskReq<span class="token punctuation">,</span> reply <span class="token operator">*</span>CallbackFinishTaskRsp<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	taskId <span class="token operator">:=</span> args<span class="token punctuation">.</span>TaskId
	filePath <span class="token operator">:=</span> args<span class="token punctuation">.</span>FilePath
	c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	c<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">[</span>taskId<span class="token punctuation">]</span><span class="token punctuation">.</span>Status <span class="token operator">=</span> COMPLETE
	c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>CompleteTaskNumber<span class="token operator">++</span>
	log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;a reduce task finish&quot;</span><span class="token punctuation">)</span>
	c<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">[</span>taskId<span class="token punctuation">]</span><span class="token punctuation">.</span>TargetFilePath <span class="token operator">=</span> filePath
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">getReduceTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> ReduceTask <span class="token punctuation">{</span>
	c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> i<span class="token punctuation">,</span> task <span class="token operator">:=</span> <span class="token keyword">range</span> c<span class="token punctuation">.</span>ReduceTaskList <span class="token punctuation">{</span>
		<span class="token keyword">if</span> task<span class="token punctuation">.</span>Status <span class="token operator">==</span> UN_ALLOCATION <span class="token operator">||</span> task<span class="token punctuation">.</span>Status <span class="token operator">==</span> TIMEOUT <span class="token punctuation">{</span>
			c<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Status <span class="token operator">=</span> ALLOCATION
			c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>CanAllocateTaskNumber<span class="token operator">--</span>
			c<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>startTime <span class="token operator">=</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Unix</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
			<span class="token keyword">return</span> task
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> ReduceTask<span class="token punctuation">{</span>Task<span class="token punctuation">:</span> Task<span class="token punctuation">{</span>T<span class="token punctuation">:</span> TNoTask<span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">getMapTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> MapTask <span class="token punctuation">{</span>
	c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> i<span class="token punctuation">,</span> task <span class="token operator">:=</span> <span class="token keyword">range</span> c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>MapTaskList <span class="token punctuation">{</span>
		<span class="token keyword">if</span> task<span class="token punctuation">.</span>Status <span class="token operator">==</span> UN_ALLOCATION <span class="token operator">||</span> task<span class="token punctuation">.</span>Status <span class="token operator">==</span> TIMEOUT <span class="token punctuation">{</span>
			c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>CanAllocateTaskNumber<span class="token operator">--</span>
			c<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Status <span class="token operator">=</span> ALLOCATION
			c<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>startTime <span class="token operator">=</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Unix</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
			<span class="token keyword">return</span> task
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> MapTask<span class="token punctuation">{</span>Task<span class="token punctuation">:</span> Task<span class="token punctuation">{</span>T<span class="token punctuation">:</span> TNoTask<span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">getCanAllocateTaskNumber</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">RLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	mts <span class="token operator">:=</span> c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>CanAllocateTaskNumber
	c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">RUnlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">RLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	rts <span class="token operator">:=</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>CanAllocateTaskNumber
	c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">RUnlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> mts<span class="token punctuation">,</span> rts
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">Done</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">bool</span> <span class="token punctuation">{</span>
	ret <span class="token operator">:=</span> <span class="token boolean">false</span>
	c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">RLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">RUnlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>CompleteTaskNumber <span class="token operator">==</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>BuketNumber <span class="token punctuation">{</span>
		ret <span class="token operator">=</span> <span class="token boolean">true</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> ret
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>Coordinator<span class="token punctuation">)</span> <span class="token function">tailCheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> <span class="token punctuation">{</span>
		time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>
		c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">for</span> i<span class="token punctuation">,</span> task <span class="token operator">:=</span> <span class="token keyword">range</span> c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>MapTaskList <span class="token punctuation">{</span>
			<span class="token keyword">if</span> task<span class="token punctuation">.</span>Status <span class="token operator">==</span> ALLOCATION <span class="token punctuation">{</span>
				t <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Since</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Unix</span><span class="token punctuation">(</span>task<span class="token punctuation">.</span>startTime<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
				<span class="token keyword">if</span> t <span class="token operator">&gt;</span> time<span class="token punctuation">.</span>Second<span class="token operator">*</span><span class="token number">10</span> <span class="token punctuation">{</span>
					c<span class="token punctuation">.</span>MapTaskList<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Status <span class="token operator">=</span> TIMEOUT
					c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span>CanAllocateTaskNumber<span class="token operator">++</span>
					log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;a map task timeout,t:%v\\n&quot;</span><span class="token punctuation">,</span> t<span class="token punctuation">)</span>
				<span class="token punctuation">}</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
		c<span class="token punctuation">.</span>MapTasks<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">for</span> i<span class="token punctuation">,</span> task <span class="token operator">:=</span> <span class="token keyword">range</span> c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>ReduceTaskList <span class="token punctuation">{</span>
			<span class="token keyword">if</span> task<span class="token punctuation">.</span>Status <span class="token operator">==</span> ALLOCATION <span class="token punctuation">{</span>
				t <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Since</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Unix</span><span class="token punctuation">(</span>task<span class="token punctuation">.</span>startTime<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
				<span class="token keyword">if</span> t <span class="token operator">&gt;</span> time<span class="token punctuation">.</span>Second<span class="token operator">*</span><span class="token number">10</span> <span class="token punctuation">{</span>
					c<span class="token punctuation">.</span>ReduceTaskList<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>Status <span class="token operator">=</span> TIMEOUT
					c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span>CanAllocateTaskNumber<span class="token operator">++</span>
					log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;a reduce task timeout&quot;</span><span class="token punctuation">)</span>
				<span class="token punctuation">}</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
		c<span class="token punctuation">.</span>ReduceTasks<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),e=[o];function c(u,i){return s(),a("div",null,e)}const k=n(p,[["render",c],["__file","MapReduce.html.vue"]]);export{k as default};
