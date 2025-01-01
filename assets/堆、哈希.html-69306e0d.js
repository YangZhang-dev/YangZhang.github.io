import{_ as d,r as a,o as v,c as r,a as i,b as l,d as s,e as n}from"./app-20538318.js";const c={},u=n(`<h2 id="堆" tabindex="-1"><a class="header-anchor" href="#堆" aria-hidden="true">#</a> 堆</h2><p>堆是一颗完全二叉树，小根堆的每一个节点的值都小于他的子节点的值</p><h3 id="存储" tabindex="-1"><a class="header-anchor" href="#存储" aria-hidden="true">#</a> 存储</h3><p>可以使用一维数组来存储堆，注意下标从一开始</p><p><img src="http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ecdd3bf22bb1bf0db2c30565e21e083f.png" alt="DEZ52PA7L8TZ1\`9QL2EA.png" loading="lazy"></p><p>这里就有两种基础操作：</p><ol><li>down() 当一个数变大时，down(k)是将这个节点向下沉</li><li>up() 当一个数变小时，up(k)是将这个节点向上浮</li></ol><h3 id="操作" tabindex="-1"><a class="header-anchor" href="#操作" aria-hidden="true">#</a> 操作</h3><p>通过数组模拟小根堆可以实现的操作：</p><ol><li>插入一个数</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>heap(++size)=x;
up(size);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>求集合中的最小值</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>heap[1];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3"><li>删除最小值</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>heap[1]=heap[size--];
down(1);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>删除任意元素</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>heap[k]=heap[size--];
// 这两种操作只会进行一个
down(k);
up(k);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>修改任意元素</li></ol><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>heap[k]=x;
down(k);
up(k);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>STL优先队列支持前三种操作</p><h3 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h3>`,21),t={href:"https://www.acwing.com/activity/content/problem/content/888/",target:"_blank",rel:"noopener noreferrer"},m=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;algorithm&gt;
using namespace std;

const int N=1e5+10;

int h[N],s;

// 这里没有用到
void up(int x)
{
    while(x/2&amp;&amp;h[x/2]&gt;h[x]) 
    {
        swap(h[x],h[x/2]);
        x/=2;
    }
}


void down(int x)
{
    int u=x;
    if(x*2&lt;=s&amp;&amp;h[u]&gt;h[x*2]) u=x*2;
    if((x*2+1)&lt;=s&amp;&amp;h[u]&gt;h[x*2+1]) u=x*2+1;
    if(u!=x)
    {
        swap(h[x],h[u]);
        down(x);
    }
}

int main()
{
    int m,n;
    cin&gt;&gt;m&gt;&gt;n;
    s=m;
    for(int i=1;i&lt;=m;i++) cin&gt;&gt;h[i];
    for(int i=m/2;i&gt;0;i--) down(i);
    while(n--)
    {
        cout&lt;&lt;h[1]&lt;&lt;&quot; &quot;;
        h[1]=h[s--];
        down(1);
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="哈希表" tabindex="-1"><a class="header-anchor" href="#哈希表" aria-hidden="true">#</a> 哈希表</h2><p>假定由1e5个数，分布在-1e9到1e9的区间中，这样是很难操作的，想要把他每一个数映射到一个0-1e5的区间中，这时就要用到哈希 最容易想到的方法就是x%1e5，但是这样肯定会有冲突产生，比如1e5+1和2e5+1，所以需要特殊的存储结构来尽可能的减少冲突</p>`,3),b={href:"https://www.acwing.com/activity/content/problem/content/890/",target:"_blank",rel:"noopener noreferrer"},o=n(`<h3 id="开放寻址法" tabindex="-1"><a class="header-anchor" href="#开放寻址法" aria-hidden="true">#</a> 开放寻址法</h3><p>只需要开一个二到三倍的一维数组，每次哈希后，判断当前位置是否已经被占用，如果是就向后继续看，看到末尾再回头看继续看</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
using namespace std;


// 开放寻址法数组大小开2至3倍
const int N=200003,null=0x3f3f3f3f;

int h[N];


int find(int x)
{
    int k=(x%N+N)%N;
    while(h[k]!=null&amp;&amp;h[k]!=x)
    {
        k++;
        if(k==N) k=0;
    }
    return k;
}

int main()
{
    memset(h, null, sizeof h);
    int n;
    cin&gt;&gt;n;
    
    while(n--)
    {
        char op;
        int x;
        cin&gt;&gt;op&gt;&gt;x;
        int k=find(x);
        if(op==&#39;I&#39;) h[k]=x;
        else
        {
            if(h[k]!=null) cout&lt;&lt;&quot;Yes&quot;&lt;&lt;endl;
            else cout&lt;&lt;&quot;No&quot;&lt;&lt;endl;
        }
    }
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="拉链法" tabindex="-1"><a class="header-anchor" href="#拉链法" aria-hidden="true">#</a> 拉链法</h3><p>开一个一维数组，将每一个元素都当成链表的头指针，即</p><p><img src="http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/61eac60a113aef196bcb445fa9589544.png" alt="_LMR3TV1A9HS7~3G.png" loading="lazy"></p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
using namespace std;


// 一般取模的数是质数并且远离2的n次幂，冲突的概率会降低
const int N=100003;
int h[N],e[N],ne[N],idx;


void insert(int x)
{
    // 这样可以保证负数的结果也可以落在0-1e5区间内
    int k=((x%N)+N)%N;
    e[idx]=x;
    ne[idx]=h[k];
    h[k]=idx++;
}

bool find(int x)
{
    int k=((x%N)+N)%N;
    for(int i=h[k];i!=-1;i=ne[i])
        if(e[i]==x) return true;
    return false;
}

int main()
{
    int n;
    cin&gt;&gt;n;
    // 初始化整个指针数组为-1
    memset(h, -1, sizeof h);
    while(n--)
    {
        char op;
        int x;
        cin&gt;&gt;op&gt;&gt;x;
        if(op==&#39;I&#39;)
        {
            insert(x);
        }
        else
        {
            if(find(x)) cout&lt;&lt;&quot;Yes&quot;&lt;&lt;endl;
            else cout&lt;&lt;&quot;No&quot;&lt;&lt;endl;
        }
    }
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="字符串哈希" tabindex="-1"><a class="header-anchor" href="#字符串哈希" aria-hidden="true">#</a> 字符串哈希</h2><p>关于字符串的操作，还可以使用哈希来进行比较</p><p>假设有一个字符串只有小写字母&quot;abc&quot;，可以使用它的ASCII码值或从1开始编号，得123，由减少哈希冲突的经验我们取这个数为131进制,即(123)<sub>131</sub></p><p>我们将这个转换为10进制，数字有可能会非常大，所以会进行一次哈希，这里取N为2<sup>64</sup>,因为这样我们可以很方便的将结果定义为 unsigned long long，我们就不用再去自己取余了，这样我们就得到了一个字符串的哈希值</p>`,11),h={href:"https://www.acwing.com/activity/content/problem/content/891/",target:"_blank",rel:"noopener noreferrer"},p=n(`<p>此题使用字符串哈希和前缀和</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;                         //字符串前缀哈希
using namespace std;
typedef unsigned long long ull;//用ull省去取模的步骤

const int N=100010,P=131;//经验：进制p取131或13331

ull h[N],p[N];
char a[N];

ull get(int l,int r){
    // 由于将字符串变成了数字，有了维权的影响处于高位的abc和低位的abc哈希值是不同的，所以要用p数组记录位权，才能正常比较
    return h[r]-h[l-1]*p[r-l+1];          //h是哈希前缀和数组
}

int main(){
    int m,n;
    cin&gt;&gt;n&gt;&gt;m;
    for(int i=1;i&lt;=n;i++) cin&gt;&gt;a[i];       //注意要从1开始
    p[0]=1;                                 //注意p【0】要赋值为一
    for(int i=1;i&lt;=n;i++){
        h[i]=h[i-1]*P+a[i];          //求哈希前缀和数组，a【i】用的是ascii码表
        p[i]=p[i-1]*P;                       //记录位权大小
    }
    while(m--){
        int l1,l2,r1,r2;
        cin&gt;&gt;l1&gt;&gt;r1&gt;&gt;l2&gt;&gt;r2;
        if(get(l1,r1)==get(l2,r2)) cout&lt;&lt;&quot;Yes&quot;&lt;&lt;endl;
        else cout&lt;&lt;&quot;No&quot;&lt;&lt;endl;
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function g(x,f){const e=a("ExternalLinkIcon");return v(),r("div",null,[u,i("p",null,[i("a",t,[l("堆排序"),s(e)])]),m,i("p",null,[i("a",b,[l("模拟散列表"),s(e)])]),o,i("p",null,[i("a",h,[l("字符串哈希"),s(e)])]),p])}const k=d(c,[["render",g],["__file","堆、哈希.html.vue"]]);export{k as default};
