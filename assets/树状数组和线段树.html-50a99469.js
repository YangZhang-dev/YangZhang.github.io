import{_ as i,o as n,c as e,e as l}from"./app-20538318.js";const s={},d=l(`<h2 id="树状数组" tabindex="-1"><a class="header-anchor" href="#树状数组" aria-hidden="true">#</a> 树状数组</h2><img src="http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/树状数组思维导图.png" style="zoom:50%;"><p>树状数组是使用一个一维数组，维护一个多叉树，支持在线修改的求前缀和的数据结构。</p><p>下图是树状数组的构成图：</p><p><img src="http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/树状数组.jpg" alt="" loading="lazy"></p><p>目前还不会树状数组的原理，只会使用 : )</p><h3 id="模板题" tabindex="-1"><a class="header-anchor" href="#模板题" aria-hidden="true">#</a> 模板题</h3><p>给定 n个数组成的一个数列，规定有两种操作，一是修改某个元素，二是求子数列 [a,b] 的连续和。</p><p><strong>输入格式</strong></p><p>第一行包含两个整数 n 和 m，分别表示数的个数和操作次数。</p><p>第二行包含 n个整数，表示完整数列。</p><p>接下来 m行，每行包含三个整数 k,a,b,（k=0，表示求子数列[a,b]的和；k=1，表示第 a个数加 b）。</p><p>数列从 11 开始计数。</p><p><strong>输出格式</strong></p><p>输出若干行数字，表示 k=0 时，对应的子数列 [a,b] 的连续和。</p><p><strong>数据范围</strong></p><p>1≤n≤100000, 1≤m≤100000， 1≤a≤b≤n, 数据保证在任何时候，数列中所有元素之和均在 int 范围内。</p><p><strong>输入样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>10 5
1 2 3 4 5 6 7 8 9 10
1 1 5
0 1 3
0 4 8
1 7 5
0 4 8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输出样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>11
30
35
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;stdio.h&gt;
#include &lt;iostream&gt;
using namespace std;
const int N = 100010;
int n, m;
int a[N], tr[N];

int lowbit(int x)
{
    return x &amp; -x;
}

void add(int p, int x)
{
    for(int i = p; i &lt;= n; i += lowbit(i)) tr[i] += x;
}

int query(int x)
{
    int res = 0;
    for(int i = x; i &gt;= 1; i -= lowbit(i)) res += tr[i];
    return res;
}

int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    for(int i = 1; i &lt;= n; i++) scanf(&quot;%d&quot;, &amp;a[i]);
    for(int i = 1; i &lt;= n; i++) add(i, a[i]);

    while(m--)
    {
        int k, x, y;
        cin &gt;&gt; k &gt;&gt; x &gt;&gt; y;
        if(k == 0) cout &lt;&lt; query(y) - query(x - 1) &lt;&lt; endl;
        else add(x, y);
    }

    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="线段树" tabindex="-1"><a class="header-anchor" href="#线段树" aria-hidden="true">#</a> 线段树</h2><p>线段树的用处比树状数组要广，它可以用来维护一段区间内的信息，像最大值，区间和等等。正如它的名字，他是由一个一个的线段构成的树，下图是一个例子：</p><p><img src="http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/线段树.jpg" alt="" loading="lazy"></p><h3 id="构建" tabindex="-1"><a class="header-anchor" href="#构建" aria-hidden="true">#</a> 构建</h3><p>通常使用结构体来存放节点，使用类似于堆存储的方式存储树的结构。</p><p>对于构建过程有以下步骤：</p><p>从根节点开始：</p><ol><li>判断当前构建节点左右端点是否相等，相等就直接赋值，否则继续</li><li>计算中间值，递归的构建左右子区间</li><li>回溯时进行pushup操作</li></ol><h3 id="pushup" tabindex="-1"><a class="header-anchor" href="#pushup" aria-hidden="true">#</a> pushup</h3><p>pushup操作被定义为维护（更新）当前节点的信息，当节点中维护的是最大值时：<code>tr[u].maxv = tr[u &lt;&lt; 1].maxv, tr[u &lt;&lt; 1 | 1].maxv</code>。</p><h3 id="查询" tabindex="-1"><a class="header-anchor" href="#查询" aria-hidden="true">#</a> 查询</h3><p>假设我们要求2到5的区间和，求法如下：</p><p>从根节点开始，</p><ol><li>判断当前节点是否被所询问区间覆盖，覆盖就直接返回，如果没有覆盖继续</li><li>判断所询问区间和中点的关系，根据关系条件递归的询问两个子区间</li><li>如果递归到了叶子节点，就直接返回。</li></ol><h3 id="修改" tabindex="-1"><a class="header-anchor" href="#修改" aria-hidden="true">#</a> 修改</h3><p>修改有以下步骤：</p><p>从根节点开始：</p><ol><li>判断当前节点是否是要修改的节点是的话直接修改并返回，不是就继续</li><li>判断所询问位置和中点的关系，根据关系条件递归的修改两个子区间值</li><li>回溯的时候进行pushup操作</li></ol><p><strong>题目和上面的相同，下面是代码</strong></p><h3 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
using namespace std;
const int N = 100010;
struct
{
    int l, r;
    int sum;
}tr[N * 4];
int n, m;
int w[N];

void pushup(int u)
{
    tr[u].sum = tr[u &lt;&lt; 1].sum + tr[u &lt;&lt; 1 | 1].sum;
}
void build(int u, int l, int r)
{
    if(l == r) tr[u] = {l, r, w[r]};
    else
    {
        tr[u] = {l, r};
        int mid = l + r &gt;&gt; 1;
        build(u &lt;&lt; 1, l, mid), build(u &lt;&lt; 1 | 1, mid + 1, r);
        pushup(u);
    }
}

int query(int u, int l, int r)
{
    if (tr[u].l &gt;= l &amp;&amp; tr[u].r &lt;= r) return tr[u].sum;
    int mid = tr[u].l + tr[u].r &gt;&gt; 1;
    int sum = 0;
    if (l &lt;= mid) sum = query(u &lt;&lt; 1, l, r);
    if (r &gt; mid) sum += query(u &lt;&lt; 1 | 1, l, r);
    return sum;
}

void modify(int u, int x, int v)
{
    if(tr[u].l == tr[u].r) tr[u].sum += v;
    else
    {
        int mid = tr[u].l + tr[u].r &gt;&gt; 1;
        if(x &lt;= mid) modify(u &lt;&lt; 1, x, v);
        else modify(u &lt;&lt; 1 | 1, x, v);
        pushup(u);
    }
}

int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    for(int i = 1; i &lt;= n; i ++) cin &gt;&gt; w[i];
    build(1, 1, n);
    while(m --)
    {
        int k, a, b;
        cin &gt;&gt; k &gt;&gt; a &gt;&gt; b;
        if(k == 0) cout &lt;&lt; query(1, a, b) &lt;&lt; endl;
        else modify(1, a, b);
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,44),a=[d];function r(v,t){return n(),e("div",null,a)}const c=i(s,[["render",r],["__file","树状数组和线段树.html.vue"]]);export{c as default};
