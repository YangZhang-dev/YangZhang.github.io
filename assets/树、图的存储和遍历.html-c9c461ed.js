import{_ as l,r as v,o as a,c as r,a as i,b as d,d as s,e as n}from"./app-20538318.js";const c={},t=n(`<h2 id="_1-树和图的存储" tabindex="-1"><a class="header-anchor" href="#_1-树和图的存储" aria-hidden="true">#</a> 1. 树和图的存储</h2><p>首先树是一种无环连通图，然后对于无向图来说，我们只需要建立两条对应的边，即可转化为有向图</p><p>这里讨论有向图的存储</p><h3 id="_1-1-邻接矩阵" tabindex="-1"><a class="header-anchor" href="#_1-1-邻接矩阵" aria-hidden="true">#</a> 1.1 邻接矩阵</h3><p>开二维数组，<code>g[i][j]</code> 存储<code>i</code>点到<code>j</code>点的权重，不能存储重复边</p><p>浪费空间，适合存储稠密图</p><h3 id="_1-2-邻接表" tabindex="-1"><a class="header-anchor" href="#_1-2-邻接表" aria-hidden="true">#</a> 1.2 邻接表</h3><p>开n个单链表，每个单链表存储出边，一般采用这种方式</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;csring&gt;
#include &lt;algorithm&gt;

using namespace std;

const int N = 1e5, M = N * 2;

// h是链表串，e是链表节点存储的值，ne是链表节点的下一个的下标，idx是当前可以使用的节点
int h[N], e[M], ne[M], idx;

// 此处用到的是头插法
void add(int a, int b)
{
   e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}

int main()
{
   // 初始化为-1，表示到达不了
   memset(h, -1, sizeof h);
   return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-树和图的dfs" tabindex="-1"><a class="header-anchor" href="#_2-树和图的dfs" aria-hidden="true">#</a> 2. 树和图的DFS</h2><p>利用DFS遍历图，可以完成一些操作，例如求树的重心</p><p>树的重心是指去掉某一个点后剩余联通块的数量大小的最大值的最小值</p><p>可以发现，去掉某一个点后剩下的连通块的最大值就是在他的所有子树，和去掉所有子树大小和+1求最大值</p><p>可以利用DFS回溯时返回每一个子树的大小，再进行操作。</p>`,14),u={href:"https://www.acwing.com/activity/content/problem/content/909/",target:"_blank",rel:"noopener noreferrer"},m=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
#include &lt;algorithm&gt;

using namespace std;

const int N = 1e5 + 10, M = N * 2;

int h[N], e[M], ne[M], idx, ans=N;
bool st[N];
int n;
void add(int a, int b)
{
    e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}

int dfs(int u)
{
    st[u] = true;
    // 初始化为1， 默认把自己算进去
    int sum = 1;
    int res = 0;
    for(int i = h[u]; i != -1; i = ne[i])
    {
        int j = e[i];
        int cnt = 0;
        if(!st[j]) 
        {
            int a = dfs(j);
            //  求所有子树中的最大值
            res = max(res, a);
            sum += a;
        } 
    }
    // 将子树最大值，和其余的点构成的联通块求最大值
    res = max(res, n - sum);
    // 答案取最小值
    ans = min(res, ans);
    return sum;
}

int main()
{
    memset(h, -1, sizeof h);
    cin&gt;&gt;n;
    for(int i = 0; i&lt;n-1; i++)
    {
        int a, b;
        cin&gt;&gt;a&gt;&gt;b;
        add(a,b),add(b,a);
    }
    dfs(1);
    cout&lt;&lt;ans;
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-树和图的bfs" tabindex="-1"><a class="header-anchor" href="#_3-树和图的bfs" aria-hidden="true">#</a> 3. 树和图的BFS</h2><h3 id="_3-1-最短路" tabindex="-1"><a class="header-anchor" href="#_3-1-最短路" aria-hidden="true">#</a> 3.1 最短路</h3><p>利用BFS对图进行层次遍历，可以用来求边权为1的最短路问题（可以有重边和自环）</p>`,4),b={href:"https://www.acwing.com/activity/content/problem/content/910/",target:"_blank",rel:"noopener noreferrer"},o=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
using namespace std;

const int N = 1e5+10, M = N * 2;
int h[N], e[M], ne[M], idx;
int n, m;
// d用来存贮距离，q来模拟队列
int q[M], hh, tt, d[N];

void add(int a, int b)
{
    e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}

int bfs()
{
    memset(d,-1,sizeof d);
    
    // 从第一个点开始BFS，也就是从第一个点为起点
    q[0] = 1;
    // 第一个点到自己的距离为0
    d[1] = 0;
    
    while(hh &lt;= tt)
    {
        int t = q[hh ++];
        
        for(int i = h[t]; i != -1; i = ne[i])
        {
            int j = e[i];
            if(d[j] == -1)
            {
                q[++ tt] = j;
                d[j] = d[t] + 1;
            }
        }
    }
    return d[n];
}

int main()
{
    memset(h,-1,sizeof h);
    
    cin &gt;&gt; n &gt;&gt; m;
    
    for(int i = 0; i &lt; m; i ++)
    {
        int a, b;
        cin &gt;&gt; a &gt;&gt; b;
        add(a,b);
    }
    cout&lt;&lt;bfs();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-拓扑排序" tabindex="-1"><a class="header-anchor" href="#_3-2-拓扑排序" aria-hidden="true">#</a> 3.2 拓扑排序</h3><p>拓扑排序只存在于有向无环图中，即在序列中只存在从前向后指的边</p><p>我们先将入度为0的点记录下来，因为一定不会有点指向它们，然后利用BFS进行遍历入队，同时将该点的入度减一，再判断如果该点的入度为0了就将它入队，最后队列中的顺序就是拓扑排序</p>`,4),h={href:"https://www.acwing.com/activity/content/problem/content/911/",target:"_blank",rel:"noopener noreferrer"},g=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//无向图没有拓扑序列
//只要有一个环就没有拓扑排序
//有向无环图（拓扑图）一定存在拓扑序列而且不唯一
#include &lt;bits/stdc++.h&gt;
using namespace std;
typedef long long LL;
typedef pair&lt;int,int&gt; PII;
const int N=1e6;
int n,m;
int h[N],e[N],ne[N],idx,d[N],q[N];//d存的是入度为零的点

void add(int a,int b){
    e[idx]=b,ne[idx]=h[a],h[a]=idx++;
}

int bfs(){
    int hh=0,tt=-1;//如果q队列初始要插入一个值，那么对头tt就初始化为零
    for(int i=1;i&lt;=n;i++){//将所有入度为零的点入队
        if(!d[i]) q[++tt]=i;
    }
    while(hh&lt;=tt){
        int t=q[hh++];
        for(int i=h[t];i!=-1;i=ne[i]){
            int j=e[i];
            d[j]--;
            if(d[j]==0)//入度为零那么这个点被转化为突破口
            	q[++tt]=j;
        }
    }
    // 如果队列中的元素个数等于节点个数，表示所有元素都入队，那么就找到了一个拓扑排序
    return n==tt+1;
}

int main(){
    ios::sync_with_stdio(false);
    cin&gt;&gt;n&gt;&gt;m;
    memset(h,-1,sizeof h);
    for(int i=1;i&lt;=m;i++){
        int a,b;
        cin&gt;&gt;a&gt;&gt;b;
        add(a,b);
        d[b]++;
    }
    if(bfs()){
        for(int i=0;i&lt;n;i++) cout&lt;&lt;q[i]&lt;&lt;&quot; &quot;;
    }
    else cout&lt;&lt;-1;
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function p(_,f){const e=v("ExternalLinkIcon");return a(),r("div",null,[t,i("p",null,[i("a",u,[d("树的重心"),s(e)])]),m,i("p",null,[i("a",b,[d("图中点的层次"),s(e)])]),o,i("p",null,[i("a",h,[d("拓扑排序"),s(e)])]),g])}const N=l(c,[["render",p],["__file","树、图的存储和遍历.html.vue"]]);export{N as default};
