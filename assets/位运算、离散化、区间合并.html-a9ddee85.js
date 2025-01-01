import{_ as d,r as a,o as r,c as v,a as i,b as n,d as l,e as s}from"./app-20538318.js";const c={},t=s(`<h2 id="位运算" tabindex="-1"><a class="header-anchor" href="#位运算" aria-hidden="true">#</a> 位运算</h2><p>计算机中的数在内存中都是以二进制形式进行存储的，用位运算就是直接对整数在内存中的二进制位进行操作，因此其执行效率非常高，在程序中尽量使用位运算进行操作，这会大大提高程序的性能。</p><h3 id="位运算的常见技巧" tabindex="-1"><a class="header-anchor" href="#位运算的常见技巧" aria-hidden="true">#</a> 位运算的常见技巧</h3><ol><li>位运算实现乘除</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int a=2;
a&gt;&gt;1; --&gt;1
a&lt;&lt;1; --&gt;4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>交换两数</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>void swap(int &amp;a, int &amp;b) 
{
  a ^= b;
  b ^= a;
  a ^= b;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3.判断i位是一还是零</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>(x&gt;&gt;i)&amp;1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>4.lowbit操作,返回最后一位1</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int lowbit(int x)
{
  return x&amp;-x;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="离散化" tabindex="-1"><a class="header-anchor" href="#离散化" aria-hidden="true">#</a> 离散化</h2>`,12),u={href:"https://zhuanlan.zhihu.com/p/112497527",target:"_blank",rel:"noopener noreferrer"},m=i("p",null,"这里是整数保序的离散化，一般来说是给定的区间范围大，但是个数较少，我们可以将这一些数重新映射到一个新的较小区间中，方便我们进行具体的操作",-1),b=i("h3",{id:"思考步骤",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#思考步骤","aria-hidden":"true"},"#"),n(" 思考步骤")],-1),o=i("ol",null,[i("li",null,"首先我们应该对于要进行离散化的数据进行排序去重"),i("li",null,"计算离散化后的值-->使用二分"),i("li",null,"注意离散化后区间的范围大小")],-1),h=i("h3",{id:"具体实现",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#具体实现","aria-hidden":"true"},"#"),n(" 具体实现")],-1),g={href:"https://www.acwing.com/activity/content/problem/content/836/",target:"_blank",rel:"noopener noreferrer"},p=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

const int N=3e5+10;

typedef pair&lt;int, int&gt; PII;

int n,m;
//前缀和
int a[N], s[N];
// 记录添加操作，和询问操作
vector&lt;PII&gt; add,ask;
// 记录所有坐标
vector&lt;int&gt; all;

// 为每一个坐标进行离散化
int find(int x)
{
    int l=0,r=all.size()-1;
    while(l&lt;r)
    {
        int mid=l+r&gt;&gt;1;
        if(all[mid]&gt;=x) r=mid;
        else l=mid+1;
    }
    return l+1;
}

int main()
{
    cin&gt;&gt;n&gt;&gt;m;    
    
    // 处理插入操作
    for(int i=0;i&lt;n;i++)
    {
        int x,c;
        cin&gt;&gt;x&gt;&gt;c;
        add.push_back({x,c});
        all.push_back(x);
        
    }
    // 处理查询操作
    for(int i=0;i&lt;m;i++)
    {
        int l,r;
        cin&gt;&gt;l&gt;&gt;r;
        ask.push_back({l,r});
        all.push_back(l);
        all.push_back(r);
        
    }
    //进行排序去重
    sort(all.begin(),all.end());
    all.erase(unique(all.begin(),all.end()),all.end());
    
    // 离散化
    for(auto i:add)
    {
        int x=find(i.first);
        a[x]+=i.second;
    }
    
    // 构建前缀和数组
    for (int i = 1; i &lt;= all.size(); i ++ ) s[i] = s[i - 1] + a[i];
    for(auto i:ask)
    {
        int l=find(i.first),r=find(i.second);
        cout &lt;&lt; s[r] - s[l - 1] &lt;&lt; endl;
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="区间合并" tabindex="-1"><a class="header-anchor" href="#区间合并" aria-hidden="true">#</a> 区间合并</h2><p>区间合并就是给定数个区间，将可以合并的区间进行合并，问剩下几个区间</p><h3 id="思考过程" tabindex="-1"><a class="header-anchor" href="#思考过程" aria-hidden="true">#</a> 思考过程</h3><ol><li>首先我们对区间按照左端点进行排序</li><li>这样的话，两个区间之间只会存在三种情况</li><li>一种是前后两个区间没有任何交集，那么就是一个结果，其次是后一个区间被前一个区间所包围，可以直接跳过，最后一种是有交集但没有覆盖，那么就取后面区间的右端</li></ol><h3 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h3>`,6),_={href:"https://www.acwing.com/activity/content/problem/content/837/",target:"_blank",rel:"noopener noreferrer"},f=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

typedef pair&lt;int,int&gt; PII;

const int N=100010;
vector&lt;PII&gt; seg,res;
int n;

void merge()
{
    int st=-2e9,ed=-2e9; //初始化-2e9的目的是能顺利的将第一个区间加入res中

    sort(seg.begin(),seg.end());
    
    for(auto i:seg)
        if(i.first&gt;ed)
        {
            if(st!=-2e9) res.push_back({st,ed});
            st=i.first,ed=i.second;
        }   
        else ed=max(ed,i.second);
    if(st!=-2e9) res.push_back({st,ed});
}

int main()
{
    cin&gt;&gt;n;
    for(int i=0;i&lt;n;i++)
    {
        int l,r;
        cin&gt;&gt;l&gt;&gt;r;
        seg.push_back({l,r});
    }
    merge();
    cout&lt;&lt;res.size();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function x(k,w){const e=a("ExternalLinkIcon");return r(),v("div",null,[t,i("p",null,[n("  离散化，就是当我们只关心数据的大小关系时，用排名代替原数据进行处理的一种预处理方法。离散化本质上是一种哈希，它在保持原序列大小关系的前提下把其映射成正整数。当原数据很大或含有负数、小数时，难以表示为数组下标，一些算法和数据结构（如BIT）无法运作，这时我们就可以考虑将其离散化。 --摘选自:"),i("a",u,[n("算法学习笔记(19): 离散化"),l(e)])]),m,b,o,h,i("p",null,[i("a",g,[n("题目和讲解"),l(e)])]),p,i("p",null,[i("a",_,[n("具体题目和讲解"),l(e)])]),f])}const N=d(c,[["render",x],["__file","位运算、离散化、区间合并.html.vue"]]);export{N as default};
