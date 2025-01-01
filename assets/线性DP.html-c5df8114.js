import{_ as i,o as n,c as e,e as d}from"./app-20538318.js";const s={},l=d(`<h2 id="线性dp" tabindex="-1"><a class="header-anchor" href="#线性dp" aria-hidden="true">#</a> 线性DP</h2><p>类似于背包问题，即状态的转换是以线性递推的形式进行的。分析问题的方式同样是闫式DP的方法。下面是几道例题。</p><h3 id="数字三角形" tabindex="-1"><a class="header-anchor" href="#数字三角形" aria-hidden="true">#</a> 数字三角形</h3><h4 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h4><p>给定一个如下图所示的数字三角形，从顶部出发，在每一结点可以选择移动至其左下方的结点或移动至其右下方的结点，一直走到底层，要求找出一条路径，使路径上的数字的和最大。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>        7
      3   8
    8   1   0
  2   7   4   4
4   5   2   6   5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输入格式</strong></p><p>第一行包含整数 n，表示数字三角形的层数。</p><p>接下来 n行，每行包含若干整数，其中第 i 行表示数字三角形第 i层包含的整数。</p><p><strong>输出格式</strong></p><p>输出一个整数，表示最大的路径数字和。</p><p><strong>数据范围</strong></p><p>1≤n≤500 −10000≤三角形中的整数≤10000</p><p><strong>输入样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>5
7
3 8
8 1 0 
2 7 4 4
4 5 2 6 5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输出样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>30
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="思考" tabindex="-1"><a class="header-anchor" href="#思考" aria-hidden="true">#</a> 思考</h4><p>首先考虑状态的表示，<code>dp[i][j]</code>表示走到第i行j列元素的所有走法长度的集合，集合的属性是最大值。</p><p>然后考虑集合的划分，这里考虑由上向下走，下向上走的思路也是一样的。每一个<code>dp[i][j]</code>都可以由上方的<code>dp[i - 1][j - 1]</code>或<code>dp[i - 1][j]</code>走一步得到，也就是<code>dp[i][j] = max(dp[i - 1][j - 1], dp[i - 1][j]) + d[i][j]</code>。</p><p>其次我们需要考虑状态的初始化，首先<code>dp[1][1] = d[1][1]</code>，因为第一步是确定的。然后我们可以发现边权是有负数的，所以我们需要将状态初始化为一个比较小的数，注意由于左右边界没有状态，但是在状态转移中可能会取到，所以初始化时左右需要多初始化一列。</p><p>最后遍历最下面一行取最大值。</p><h4 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h4><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
typedef long long LL;

using namespace  std;
const int N = 5e2 + 10;
const int INF = 1e9;
int n,m;
int dp[N][N], d[N][N];

int main()
{
    cin &gt;&gt; n;
    for(int i = 1; i &lt;= n; i++) 
        for(int j = 1; j &lt;= i; j++)
            cin &gt;&gt; d[i][j];
    // 路径中存在负数，初始化为一个较小的数
    for (int i = 0; i &lt;= n; i ++ )
        for (int j = 0; j &lt;= i + 1; j ++ )
            dp[i][j] = -INF;
            
    dp[1][1] = d[1][1];
    
    for(int i = 2; i &lt;= n; i++)
    {
        for(int j = 1; j &lt;= i; j++)
        {
            dp[i][j] = max(dp[i - 1][j - 1], dp[i - 1][j]) + d[i][j];
        }
    }
    int res = -INF;
    for(int i = 1; i &lt;= n; i++) res = max(dp[n][i], res);
    cout &lt;&lt; res;
    return 0;
}

// 状态表示
// 走到第i行j列的路径集合，max
// 状态计算
// dp[i][j]
// dp[i - 1][j - 1] + d[i][j]
// dp[i - 1][j] + d[i][j]
// 状态初始化
// dp[1][1] = d[1][1]

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="最长上升子序列" tabindex="-1"><a class="header-anchor" href="#最长上升子序列" aria-hidden="true">#</a> 最长上升子序列</h3><h4 id="题目-1" tabindex="-1"><a class="header-anchor" href="#题目-1" aria-hidden="true">#</a> 题目</h4><p>给定一个长度为 N 的数列，求数值严格单调递增的子序列的长度最长是多少。</p><p><strong>输入格式</strong></p><p>第一行包含整数 N。</p><p>第二行包含 N个整数，表示完整序列。</p><p><strong>输出格式</strong></p><p>输出一个整数，表示最大长度。</p><p><strong>数据范围</strong></p><p>1≤N≤1000， −109≤数列中的数≤109</p><p><strong>输入样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>7
3 1 2 1 8 5 6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输出样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="思考-1" tabindex="-1"><a class="header-anchor" href="#思考-1" aria-hidden="true">#</a> 思考</h4><p>首先是状态的表示， <code>dp[i]</code>表示包含第i个数的最长上升子序列长度，集合的属性是最大值。</p><p>然后是状态的计算也就是集合的划分，因为子序列没有要求连续，所以每一个i前面的元素都有可能和i组成上升子序列，所以需要两层循环，<code>dp[i] = dp[j] + 1</code>，条件是<code>s[i] &gt; s[j]</code>。</p><p>最后是状态的初始化，每一个元素自身构成了一个长度为一的上升子序列，所以dp数组所有元素初始化为一。</p><h4 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h4><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;

using namespace std;

const int N = 1e3 + 10;
int n;
int dp[N];
int s[N];
int main()
{
    cin &gt;&gt; n;
    for(int i = 1; i &lt;= n; i++) cin &gt;&gt; s[i];
    for(int i = 1; i &lt;= n; i++)
    {
        dp[i] = 1;
        for(int j = 1; j &lt; i; j++)
        {
            if(s[i] &gt; s[j]) dp[i] = max(dp[i], dp[j] + 1);
        }
    }
    int res = 0;
    for(int i = 1; i &lt;= n; i++) res = max(res, dp[i]);
    cout &lt;&lt; res;
    return 0;
}
// 状态划分
// dp[i] 包含第i个数的最长上升子序列
// 集合属性
// max
// 状态计算
// s[i] &gt; s[j] =&gt; dp[i] = dp[j] + 1
// 状态初始化
// dp[i] = 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="优化" tabindex="-1"><a class="header-anchor" href="#优化" aria-hidden="true">#</a> 优化</h4><p>当数据量大了，上面的代码就无法通过，下面通过规律加二分将复杂度降低到<code>nlogn</code>。</p><p>对于以下数列：<code>3 1 4 5</code>，我们可以发现对于长度为2的上升子序列<code>3 4</code>和<code>1 4</code>，我们完全可以不存<code>3 4</code>，因为如果3可以构成上升子序列，那么1也一定可以构成。我们可以开一个数组q用来存放不同长度下，结尾最小的最长上升子序列的结尾值。</p><p>同时，有这样一个规律，对于q数组，它一定是严格单调递增的，证明如下：</p><p>设q是已经经过处理的数组，它的每个元素都是结尾最小的最长上升子序列的结尾值，q[i]为长度为i的结尾最小的最长上升子序列，如果有<code>q[i] &gt;= q[i + 1]</code>，则以<code>q[i + 1]</code>为结尾的上升子序列，它的前i个数字构成的上升子序列的结尾值就一定小于等于q[i]，那么就和假设相悖，证明完毕。</p><p>这样我们就有一个严格单调递增的序列，可以遍历元素，通过二分不断的去维护q数组，直到遍历完成，q数组的长度就是能达到的最大值。</p><p>下面是代码：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
#include &lt;algorithm&gt;

using namespace std;

const int N = 1e5 + 10;

int n;
int a[N], q[N];
int main()
{
    cin &gt;&gt; n;
    for(int i = 1; i &lt;= n; i++) cin &gt;&gt; a[i];
    
    int len = 0;
    for(int i = 1; i &lt;= n; i++)
    {
        int l = 0, r = len;
        while(l &lt; r)
        {
            int mid = l + r + 1 &gt;&gt; 1;
            if(q[mid] &lt; a[i]) l = mid;
            else r = mid - 1;
        }
        len = max(len, r + 1);
        q[r + 1] = a[i];
    }
    cout &lt;&lt; len;
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="最长公共子序列" tabindex="-1"><a class="header-anchor" href="#最长公共子序列" aria-hidden="true">#</a> 最长公共子序列</h3><h4 id="题目-2" tabindex="-1"><a class="header-anchor" href="#题目-2" aria-hidden="true">#</a> 题目</h4><p>给定两个长度分别为 N 和 M 的字符串 A和 B，求既是 A 的子序列又是 B 的子序列的字符串长度最长是多少。</p><p><strong>输入格式</strong></p><p>第一行包含两个整数 N 和 M。</p><p>第二行包含一个长度为 N 的字符串，表示字符串 A。</p><p>第三行包含一个长度为 M 的字符串，表示字符串 B。</p><p>字符串均由小写字母构成。</p><p><strong>输出格式</strong></p><p>输出一个整数，表示最大长度。</p><p><strong>数据范围</strong></p><p>1≤N,M≤1000</p><p><strong>输入样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>4 5
acbd
abedc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输出样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="思考-2" tabindex="-1"><a class="header-anchor" href="#思考-2" aria-hidden="true">#</a> 思考</h4><p>状态划分，<code>dp[i][j]</code>用来表示 a字符串的前i个字符和b字符串的前j个字符的公共子串长度的集合，注意是前i个字符，不一定包含第i个字符。集合的属性是最大值。</p><p>状态计算，看上去可以将集合划分为<code>dp[i - 1][j - 1] + 1、dp[i - 1][j - 1]、dp[i - 1][j]、dp[i][j - 1]</code>，表示对于a的第i个字符和b的第j个字符，第一种情况：在<code>a[i] == b[j]</code>的条件下都选，第二种情况：都不选，后面两种是选择其中一个。</p><p>但是，对于<code>dp[i - 1][j]</code>，它的实际含义是a字符串的前i-1个字符和b字符串的前j个字符的公共子串长度的集合，它不等同于只包含第j个字符的集合。多出来的那一部分实际上是<code>dp[i - 1][j - 1]</code>的一部分，但是好在集合的属性是求最大值，所以不影响。其实我们可以看出<code>dp[i - 1][j]、dp[i][j - 1]</code>多出的部分恰好组成了<code>dp[i - 1][j - 1]</code>，所以<code>d[]i - 1][j - 1]</code>可以不用去写。</p><h4 id="代码-2" tabindex="-1"><a class="header-anchor" href="#代码-2" aria-hidden="true">#</a> 代码</h4><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;

using namespace std;

const int N = 1e3 + 10;
int n, m;
char a[N], b[N];
int dp[N][N];
int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    for(int i = 1; i &lt;= n; i++) cin &gt;&gt; a[i];
    for(int i = 1; i &lt;= m; i++) cin &gt;&gt; b[i];
    
   for(int i = 1; i &lt;= n; i++)
        for(int j = 1; j &lt;= m; j++)
        {
            dp[i][j] = max(dp[i][j - 1], dp[i - 1][j]);
            if(a[i] == b[j]) dp[i][j] = max(dp[i][j], dp[i - 1][j - 1] + 1);
        }
    cout &lt;&lt; dp[n][m];
    return 0;
}
// 状态划分
// dp[i][j] a字符串的前i个字符和b字符串的前j个字符的公共子串的集合
// 集合的属性
// 最大值
// 状态的计算
// dp[i][j]
// max(dp[i - 1][j], dp[i][j - 1])
// a[i] == b[j] =&gt; dp[i - 1][j - 1] + 1
// 状态的初始化
// 无
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编辑距离" tabindex="-1"><a class="header-anchor" href="#编辑距离" aria-hidden="true">#</a> 编辑距离</h3><h4 id="题目-3" tabindex="-1"><a class="header-anchor" href="#题目-3" aria-hidden="true">#</a> 题目</h4><p>给定 n 个长度不超过 1010 的字符串以及 m 次询问，每次询问给出一个字符串和一个操作次数上限。</p><p>对于每次询问，请你求出给定的 n 个字符串中有多少个字符串可以在上限操作次数内经过操作变成询问给出的字符串。</p><p>每个对字符串进行的单个字符的插入、删除或替换算作一次操作。</p><p><strong>输入格式</strong></p><p>第一行包含两个整数 n 和 m。</p><p>接下来 n 行，每行包含一个字符串，表示给定的字符串。</p><p>再接下来 m 行，每行包含一个字符串和一个整数，表示一次询问。</p><p>字符串中只包含小写字母，且长度均不超过 1010。</p><p><strong>输出格式</strong></p><p>输出共 m 行，每行输出一个整数作为结果，表示一次询问中满足条件的字符串个数。</p><p><strong>数据范围</strong></p><p>1≤n,m≤1000</p><p><strong>输入样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>3 2
abc
acd
bcd
ab 1
acbd 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>输出样例</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1
3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="思考-3" tabindex="-1"><a class="header-anchor" href="#思考-3" aria-hidden="true">#</a> 思考</h4><p>对于每两个字符串之间，可以使用线性DP的方式解题。</p><p>对于状态划分，<code>dp[i][j]</code>表示由a字串转换为b字串所需步骤的集合。集合的属性是最小值。</p><p>对于状态的划分，我们可以发现<code>dp[i][j]</code>可以由<code>dp[i - 1][j] + 1、dp[i][j - 1] + 1、dp[i - 1][i - 1]、dp[i - 1][j - 1] + 1</code>，分别代表对a进行增加一个操作，对a进行删除一个的操作，第i个字符和第j个字符相等，所以不需要操作，第i个字符和第j个字符不相等，进行替换操作。</p><p>状态的初始化，对于<code>dp[i][0]和dp[0][i]</code>，分别是删除i个字符和增加i个字符。</p><h4 id="代码-3" tabindex="-1"><a class="header-anchor" href="#代码-3" aria-hidden="true">#</a> 代码</h4><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;cstring&gt;
#include &lt;algorithm&gt;

using namespace std;

const int N = 1e3 + 10;
int n, m;
int dp[N][N];
char strs[N][N];


int work(char a[], char b[])
{
    int la = strlen(a + 1), lb = strlen(b + 1);
    for(int i = 0; i &lt;= la; i ++) dp[i][0] = i;
    for(int i = 0; i &lt;= lb; i ++) dp[0][i] = i;
    
    for(int i = 1; i &lt;= la; i ++)
    {
        for(int j = 1; j &lt;= lb; j ++)
        {
            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + 1;
            dp[i][j] = min(dp[i][j], dp[i - 1][j - 1] + (a[i] != b[j]));
        }
    }
    return dp[la][lb];
}

int main()
{
    cin &gt;&gt; n &gt;&gt; m;
    for(int i = 0; i &lt; n; i++) cin &gt;&gt; (strs[i] + 1);
    
    while (m -- )
    {
        char d[N];
        int limit;
        int res = 0;
        cin &gt;&gt; (d + 1) &gt;&gt; limit;
        for(int i = 0; i &lt; n; i++)
            if(work(strs[i], d) &lt;= limit) 
                res ++;
        cout &lt;&lt; res &lt;&lt; endl;
    }
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,99),a=[l];function r(v,c){return n(),e("div",null,a)}const u=i(s,[["render",r],["__file","线性DP.html.vue"]]);export{u as default};
