import{_ as i,o as n,c as e,e as d}from"./app-20538318.js";const l={},s=d(`<p>本章讲解dp中的经典题目背包问题。dp问题更像是数学问题，关键在于找到状态转移方程。</p><h2 id="_01背包" tabindex="-1"><a class="header-anchor" href="#_01背包" aria-hidden="true">#</a> 01背包</h2><p>01背包是指给定n个物品，给出它们的体积和价值，在容量为m的背包下，能放下的最大价值是多少？</p><h3 id="朴素" tabindex="-1"><a class="header-anchor" href="#朴素" aria-hidden="true">#</a> 朴素</h3><p>这里我们使用闫式dp法，有以下图解：</p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/01背包.png" style="zoom:50%;"><p>对于集合的划分，有以下图：</p><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/01-1.png" alt="" loading="lazy"></p><p>我们在计算<code>dp[i][j]</code>时，可以先计算<code>dp[i - 1][j]</code>，即先计算只选前<code>i - 1</code>个物品，容量大小为j的情况，再和<code>dp[i][j]</code>取最大值，而<code>dp[i - 1][j]</code>又可以进一步向更小的范围减小，直到缩小到我们可以直接得到答案的范围。</p><p>目前的问题就是如何计算<code>dp[i][j]</code>，有以下曲线救国的方法，直接求不好求，我们同样可以转换到<code>i - 1</code>层，有以下等式：<code>dp[i][j] = dp[i - 1][j - v[i]] + w[i]</code>。这里v存放的是体积，w存放的是价值。</p><p>所以综合看来有以下状态转移方程：<code>dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - v[i]] + w[i])</code>。</p><p>那么就有以下代码：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
#define per(i,r,l) for (int i = (r); i &gt; (l); -- i)
typedef long long LL;

using namespace  std;
const int N = 1e3 + 10;
int n,m;
int dp[N][N];
int v[N], w[N];
int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    rep(i,1,n) cin &gt;&gt; v[i] &gt;&gt; w[i];
    
    rep(i,1,n)
        rep(j,1,m)
        {
            dp[i][j] = dp[i - 1][j];
            if(j &gt;= v[i]) dp[i][j] = max(dp[i][j], dp[i - 1][j - v[i]] + w[i]); 
        }
    cout &lt;&lt; dp[n][m];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优化" tabindex="-1"><a class="header-anchor" href="#优化" aria-hidden="true">#</a> 优化</h3><p>dp问题通常可以优化，优化的方式通常是状态转移方程的等价变形，降低dp的维数。在本题中，可以发现</p><ol><li><code>dp[i]</code>层的状态只从<code>dp[i - 1]</code>层中获取</li><li>用于更新<code>dp[i][j]</code>的第二维状态，是永远小于j的。</li></ol><p>那么就可以使用滚动数组来进行优化，同时注意这里需要对第二层循环进行倒序遍历，因为我们知道我们用于更新<code>dp[i][j]</code>的状态是小于j的，如果我们先更新了较小的j，那么较大的j所使用的状态就已经被污染，不再是<code>dp[i - 1][j]</code>而是<code>dp[i][j]</code>。</p><p>以下是优化为一维dp后的代码</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
#define per(i,r,l) for (int i = (r); i &gt;= (l); -- i)
typedef long long LL;

using namespace  std;
const int N = 1e3 + 10;
int n,m;
int dp[N];
int v[N], w[N];
int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    rep(i,1,n) cin &gt;&gt; v[i] &gt;&gt; w[i];
    
    rep(i,1,n)
        per(j,m,v[i])
            dp[j] = max(dp[j], dp[j - v[i]] + w[i]); 
            
    cout &lt;&lt; dp[m];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/0c96e26820f6cf0afec2e14e3b88ede5.png" alt="" loading="lazy"></p><h2 id="完全背包" tabindex="-1"><a class="header-anchor" href="#完全背包" aria-hidden="true">#</a> 完全背包</h2><p>在01背包问题的基础上，每一个物品可以无限制的选择。</p><h3 id="朴素-1" tabindex="-1"><a class="header-anchor" href="#朴素-1" aria-hidden="true">#</a> 朴素</h3><p>同样使用闫式dp法，dp分析图和01背包相同。集合划分如下：</p><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/完全背包集合划分.png" alt="" loading="lazy"></p><p>我们将集合划分为不选第i个物品，选1个第i个物品，....，选k个第i个物品。</p><p>有转移方程：<code> dp[i][j] = max(dp[i][j], dp[i - 1][j - k * v[i]] + k * w[i])</code>，注意不选第i个物品即k等于0的情况，所以不需要单独讨论。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)

using namespace  std;

const int N = 1e3 + 10;
int n, m;
int v[N], w[N];
int dp[N][N];

int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    rep(i, 1, n) cin &gt;&gt; v[i] &gt;&gt; w[i];
    
    rep(i, 1, n)
        rep(j, 0, m)
            for(int k = 0; k * v[i] &lt;= j; k++)
                dp[i][j] = max(dp[i][j], dp[i - 1][j - k * v[i]] + k * w[i]);
                
    cout &lt;&lt; dp[n][m];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优化-1" tabindex="-1"><a class="header-anchor" href="#优化-1" aria-hidden="true">#</a> 优化</h3><p>可以考虑如下式子：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>dp[i][j]=max(dp[i-1][j],dp[i-1][j-v]+w,dp[i-1][j-2v]+2w,dp[i-1][j-2v]+3w,...)
dp[i][j-v]=max(         dp[i-1][j-v]),dp[i-1][j-2v]+w,dp[i-1][j-2v]+2w...)
---&gt;
dp[i][j]=max(dp[i-1][j],dp[i][j-v]+w);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简化后的式子可以减少的重复状态的计算，直接使用同一层前面的状态来更新当前状态。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
using namespace  std;
typedef pair&lt;int, int&gt; PII;
const int N = 1e3 + 10;
int n, m;
int v[N], w[N];
int dp[N][N];

int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    rep(i, 1, n) cin &gt;&gt; v[i] &gt;&gt; w[i];
    
    rep(i, 1, n)
        rep(j, 0, m)
        {
            dp[i][j] = dp[i - 1][j];
            if(v[i] &lt;= j) dp[i][j]=max(dp[i][j],dp[i][j - v[i]] + w[i]);
        }
                
    cout &lt;&lt; dp[n][m];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后会发现当前情况仅仅使用了<code>i-1和i</code>层的状态，又可以使用滚动数组进行优化，不同的是，我们在更新时，使用的是本层的状态，也就是<code>dp[i][j]</code>使用的是<code>dp[i][j - v]</code>的状态，所以要先更新前面的状态再更新当前状态。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
#define per(i,r,l) for (int i = (r); i &gt;= (l); -- i)
typedef long long LL;
typedef unsigned long long ULL;
using namespace  std;
typedef pair&lt;int, int&gt; PII;
const int N = 1e3 + 10;
int n, m;
int v[N], w[N];
int dp[N];

int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    rep(i, 1, n) cin &gt;&gt; v[i] &gt;&gt; w[i];
    
    rep(i, 1, n)
        rep(j,v[i],m)
             dp[j]=max(dp[j],dp[j - v[i]] + w[i]);
             
    cout &lt;&lt; dp[m];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多重背包" tabindex="-1"><a class="header-anchor" href="#多重背包" aria-hidden="true">#</a> 多重背包</h2><p>在完全背包的基础上，将每个物品的个数做了限制。</p><h3 id="朴素-2" tabindex="-1"><a class="header-anchor" href="#朴素-2" aria-hidden="true">#</a> 朴素</h3><p>可以直接使用朴素版完全背包的代码，在枚举个数时加上限制</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
#define per(i,r,l) for (int i = (r); i &gt;= (l); -- i)
typedef long long LL;
typedef unsigned long long ULL;
using namespace  std;

typedef pair&lt;int, int&gt; PII;

const int N = 1e3 + 10;
int v[N], w[N], s[N];
int dp[N][N];

int main()
{
    int n, m;
    cin &gt;&gt; n &gt;&gt; m;
    rep(i, 1, n) cin &gt;&gt; v[i] &gt;&gt; w[i] &gt;&gt; s[i];
    
    
    rep(i, 1, n)
        rep(j, 0, m)
            for(int k = 0; k * v[i] &lt;= j &amp;&amp; k &lt;= s[i]; k++)
                dp[i][j] = max(dp[i][j],dp[i - 1][j - v[i] * k] + k * w[i]);
            
    cout &lt;&lt; dp[n][m];
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优化-2" tabindex="-1"><a class="header-anchor" href="#优化-2" aria-hidden="true">#</a> 优化</h3><p>注意，在这道题中，我们不能使用完全背包的优化方式，因为它给了每个物品的个数限制，所以上个等式会有以下改变</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>dp[i][j]=max(dp[i-1][j],dp[i-1][j-v]+w,...,dp[i-1][j-s*v]+s*w)
dp[i][j-v]=max(         dp[i-1][j-v]) ,...,dp[i-1][j-s*v]+(s-1)*w,dp[i-1][j-(s+1)*v]+s*w)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以发现第二个式子，最后多出一项，我们无法获取两个式子之间最大值的关系，所以这个方法不可行。</p><p>这里考虑使用二进制优化，举个例子：对于给定的物品i，有它的数量20，那么我们可以使用二进制来表示总体的数量，将20转换为<code>1+2+4+8+5</code>，我们可以通过这五个数的任意搭配来组成1-20的任意选法。最后分好组后，使用01背包问题，进行选择即可。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
#define per(i,r,l) for (int i = (r); i &gt;= (l); -- i)
typedef long long LL;
typedef unsigned long long ULL;
using namespace  std;

typedef pair&lt;int, int&gt; PII;

const int N = 1e5 + 10;
int v[N],w[N];
int dp[N];
int main()
{
    int n, m;
    cin &gt;&gt; n &gt;&gt; m;
    int cnt = 0;
    rep(i, 1, n)
    {
        int k = 1;
        int a, b, s;
        cin &gt;&gt; a &gt;&gt; b &gt;&gt; s;
        
        while(k &lt;= s)
        {
            cnt ++;
            v[cnt] = k * a;
            w[cnt] = k * b;
            s -= k;
            k *= 2;
        }
        if(s &gt; 0)
        {
            cnt ++;
            v[cnt] = a * s;
            w[cnt] = b * s;
        }
    }
    
    n = cnt;
    
    rep(i, 1, n)
        per(j, m, v[i])
            dp[j] = max(dp[j], dp[j - v[i]] + w[i]);
            
    cout &lt;&lt; dp[m];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="分组背包" tabindex="-1"><a class="header-anchor" href="#分组背包" aria-hidden="true">#</a> 分组背包</h2><p>在01背包的基础上，给定几个组别，每个组别内东西的选择是互斥的。</p><p>这个问题和多重背包问题相似，只不过多重背包问题的集合划分是根据选几个来分，而这道题是根据在一组内选哪个来分。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define rep(i,l,r) for (int i = (l); i &lt;= (r); ++ i)
#define per(i,r,l) for (int i = (r); i &gt;= (l); -- i)
typedef long long LL;
typedef unsigned long long ULL;
using namespace  std;

typedef pair&lt;int, int&gt; PII;

const int N=110;
int dp[N],w[N][N],v[N][N],s[N];

int main(){
    int m,n;
    cin &gt;&gt; n &gt;&gt; m;
    
    
    rep(i, 1, n)
    {
        cin &gt;&gt; s[i];
        rep(j, 1, s[i])
            cin &gt;&gt; v[i][j] &gt;&gt; w[i][j];
    }
    
    rep(i, 1, n)
        per(j, m, 0)
            rep(k, 1, s[i])
                if (v[i][k] &lt;= j)
                    dp[j] = max(dp[j], dp[j - v[i][k]] + w[i][k]);
    

    cout &lt;&lt; dp[m];
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,50),v=[s];function a(c,r){return n(),e("div",null,v)}const m=i(l,[["render",a],["__file","背包问题.html.vue"]]);export{m as default};
