import{_ as s,r as v,o as a,c,a as n,b as l,d,e as i}from"./app-20538318.js";const r={},t=i(`<p>并查集是一种高级的数据结构，它能够很好的解决</p><ol><li>将两个元素合并</li><li>询问两个元素是否在一个集合内</li></ol><p>同时可以额外维护很多信息</p><h2 id="基本原理" tabindex="-1"><a class="header-anchor" href="#基本原理" aria-hidden="true">#</a> 基本原理</h2><p>每个集合用一颗树来表示，树根的标号就是集合的编号，每个节点存储其父节点的编号，使用p[x]存储父节点</p><h2 id="问题" tabindex="-1"><a class="header-anchor" href="#问题" aria-hidden="true">#</a> 问题</h2><ol><li>如何判断树根</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>p[x]==x;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2"><li>如何求x的集合编号</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>while(p[x]!=x) x=p[x];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3"><li>如何合并两个集合</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>// 将x集合根节点的父元素置为y集合的根元素
p[x]=y
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="优化" tabindex="-1"><a class="header-anchor" href="#优化" aria-hidden="true">#</a> 优化</h2><p>在求x的集合编号时，每次都要遍历到根节点，时间和树的深度成正比 可以在第一次遍历之后，将这条路径上的元素的父节点都直接指向根节点，这样并查集的时间复杂度就近乎O(1)了</p><h2 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h2>`,15),u={href:"https://www.acwing.com/activity/content/problem/content/885/",target:"_blank",rel:"noopener noreferrer"},m=i(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define ll long long
using namespace std;

const int N=1e6;
int p[N];

int find(int x){
    // 这里使用到了路径压缩
    if(p[x]!=x) p[x]=find(p[x]);
    return p[x];
}

int main() {
    int n,m;
    cin&gt;&gt;n&gt;&gt;m;
    // 将集合中每个点都初始化为根节点
    for(int i=1;i&lt;=n;i++) p[i]=i;
    while(m--){
        char s;
        int a,b;
        cin&gt;&gt;s;
        cin&gt;&gt;a&gt;&gt;b;
        if(s==&#39;M&#39;){
            p[find(a)]=find(b);
        }
        else {
            if(find(a)==find(b)) cout&lt;&lt;&quot;Yes&quot;&lt;&lt;endl;
            else cout&lt;&lt;&quot;No&quot;&lt;&lt;endl;
        }
    }
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h2>`,2),b={href:"https://www.acwing.com/activity/content/problem/content/886/",target:"_blank",rel:"noopener noreferrer"},o=i(`<ol><li>此题核心是用并查集维护一个cnt数组，存放集合中元素的数量</li><li>如果两个集合合并，就将被合并集合的根元素的cnt加到合并集合的根元素cnt上</li><li>这样我们就能维护一个cnt数组，记录每一个集合元素的个数</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define ll long long

using namespace std;
const int N=1e6;

int p[N],cnt[N];                 


int find(int x)
{
    if(p[x]!=x) p[x]=find(p[x]);
    return p[x];
}

int main() 
{
    int n,m;
    cin&gt;&gt;n&gt;&gt;m;
    for(int i=0;i&lt;n;i++)
    {
        p[i]=i;
        // 每个连通块刚开始只有自己，所以初始化为一
        cnt[i]=1;
    }
    while(m--)
    {
        string s;
        int a,b;
        cin&gt;&gt;s;
        if(s==&quot;C&quot;)
        {
            cin&gt;&gt;a&gt;&gt;b;;
            a=find(a),b=find(b);
            if(a!=b) 
            {
                p[a]=b;
		 //cnt对于祖宗节点才有用，每当合并两个集合，需要对应合并cnt
                cnt[b]+=cnt[a];         
            }
        }
        else if (s==&quot;Q1&quot;)
        {
            cin&gt;&gt;a&gt;&gt;b;
            a=find(a),b=find(b);
            if(a==b) cout&lt;&lt;&quot;Yes&quot;&lt;&lt;endl;
            else cout&lt;&lt;&quot;No&quot;&lt;&lt;endl;
        }
        else
        {
            cin&gt;&gt;a;
            a=find(a);
            cout&lt;&lt;cnt[a]&lt;&lt;endl;
        }
    }
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),p={href:"https://www.acwing.com/activity/content/problem/content/887/",target:"_blank",rel:"noopener noreferrer"},g=i(`<p>维护一个并查集，并且记录每个节点到根节点的距离，比较两个动物的关系时，只需要让距离余3，余数是1的吃余数是0的，依次类推</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
using namespace std;
const int N=50010;
int n,k;
int p[N],d[N];


int find(int x)
{
    if(x!=p[x])
    {
        // 在路径压缩中，维护d数组，保存元素到根节点的距离
        int u=find(p[x]);
        d[x]+=d[p[x]];
        p[x]=u;
    }
    return p[x];
}

int main()
{
    cin&gt;&gt;n&gt;&gt;k;
    // 并查集的初始化不可忽略，d数组中每个节点到自己的距离为0，不需要初始化
    for (int i = 0; i &lt; n; i ++ ) p[i] = i;
    int res=0;
    while(k--)
    {
        int t,x,y;
        cin&gt;&gt;t&gt;&gt;x&gt;&gt;y;
        if(x&gt;n||y&gt;n) res++;
        else
        {
            int px=find(x),py=find(y);
            // 如果祖宗节点相同，那么说明两个元素在同一个集合内，那么判断他们取余3的数字即可判断
            // 如果不同，就需要将两个集合合并，重新计算距离
            if(t==1)
            {
                if(px==py&amp;&amp;(d[x]-d[y])%3) res++;
                else if(px!=py) // 此处条件不能删
                {
                    p[px]=py;
                    d[px]=d[y]-d[x];
                }
            }
            else 
            {
                if(px==py&amp;&amp;(d[x]-d[y]-1)%3) res++;
                else if(px!=py)
                {
                    p[px]=py;
                    d[px]=d[y]-d[x]+1;
                }
            }
        }
    }
        
    cout&lt;&lt;res;
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function x(h,f){const e=v("ExternalLinkIcon");return a(),c("div",null,[t,n("p",null,[n("a",u,[l("合并集合"),d(e)])]),m,n("p",null,[n("a",b,[l("连通块中点的数量"),d(e)])]),o,n("p",null,[n("a",p,[l("食物链"),d(e)])]),g])}const y=s(r,[["render",x],["__file","并查集.html.vue"]]);export{y as default};
