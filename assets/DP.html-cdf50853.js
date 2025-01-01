import{_ as i,o as n,c as e,e as d}from"./app-20538318.js";const s={},l=d(`<h2 id="区间dp" tabindex="-1"><a class="header-anchor" href="#区间dp" aria-hidden="true">#</a> 区间DP</h2><p>所谓区间DP，即每一个dp值维护一个区间的状态值。</p><h3 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h3><p>设有 N 堆石子排成一排，其编号为 1,2,3,…,N。</p><p>每堆石子有一定的质量，可以用一个整数来描述，现在要将这 N 堆石子合并成为一堆。</p><p>每次只能合并相邻的两堆，合并的代价为这两堆石子的质量之和，合并后与这两堆石子相邻的石子将和新堆相邻，合并时由于选择的顺序不同，合并的总代价也不相同。</p><p>例如有 44 堆石子分别为 <code>1 3 5 2</code>， 我们可以先合并 1、21、2 堆，代价为 44，得到 <code>4 5 2</code>， 又合并 1、21、2 堆，代价为 99，得到 <code>9 2</code> ，再合并得到 1111，总代价为 4+9+11=24；</p><p>如果第二步是先合并 2、3 堆，则代价为 7，得到 <code>4 7</code>，最后一次合并代价为 11，总代价为 4+7+11=22。</p><p>问题是：找出一种合理的方法，使总的代价最小，输出最小代价。</p><p><strong>输入格式</strong></p><p>第一行一个数 N 表示石子的堆数 N。</p><p>第二行 N 个数，表示每堆石子的质量(均不超过 1000)。</p><p><strong>输出格式</strong></p><p>输出一个整数，表示最小代价。</p><p><strong>数据范围</strong></p><p>1≤N≤300</p><p><strong>输入样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>4
1 3 5 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输出样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>22
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="思考" tabindex="-1"><a class="header-anchor" href="#思考" aria-hidden="true">#</a> 思考</h3><p>因为题目要求只能合并相邻两堆，所以最后一步一定是两个连续的石堆合并，而每一个石堆又可以细分为连续的四个石堆，这样递归下去我们就可以发现可以使用DP来维护这个状态。</p><p>先看状态划分，我们规定<code>dp[i][j]</code>是将第i堆到第j堆石子合并的方案的代价集合。集合的属性是min。</p><p>再看状态的计算，对于一个由第1堆到第3堆石子合并的石堆[i,j]，我们可以将它分为<code>[1,1] + [2,3]、[1,2],[3,3]</code>。即我们可以按照划分线来进行状态的转移，每次的状态就是按照不同的划分线划分的状态的最小值。同时，求一段连续区间的和，这里也要用到前缀和。</p><p>最后是状态的初始化，当长度是一时，合并石子并没有代价，所以要将<code>dp[i][i]</code>初始化为0，由于求最小值，所以其余初始化为比较大的数。</p><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
using namespace std;

const int N = 3e2 + 10;

int n;
int dp[N][N];
int s[N];

int main()
{
    cin &gt;&gt; n;
    for(int i = 1; i &lt;= n; i++) cin &gt;&gt; s[i];
    
    for(int i = 1; i &lt;= n; i++) s[i] += s[i - 1];
    
    memset(dp, 0x3f, sizeof dp);
    for (int i = 1; i &lt;= n; i ++ )  
        dp[i][i] = 0;
        
    for(int len = 2; len &lt;= n; len ++)
        for(int i = 1; i + len - 1 &lt;= n; i++)
        {
            int l = i, r = i + len - 1;
            for(int k = l; k &lt; r; k++)
                dp[l][r] = min(dp[l][r], dp[l][k] + dp[k + 1][r] + s[r] - s[l - 1]);
        }

    cout &lt;&lt; dp[1][n];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模板" tabindex="-1"><a class="header-anchor" href="#模板" aria-hidden="true">#</a> 模板</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for (int len = 1; len &lt;= n; len++) {         // 区间长度
    for (int i = 1; i + len - 1 &lt;= n; i++) { // 枚举起点
        int j = i + len - 1;                 // 区间终点
        if (len == 1) {
            dp[i][j] = 初始值
            continue;
        }

        for (int k = i; k &lt; j; k++) {        // 枚举分割点，构造状态转移方程
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + w[i][j]);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29),a=[l];function r(c,v){return n(),e("div",null,a)}const u=i(s,[["render",r],["__file","DP.html.vue"]]);export{u as default};
