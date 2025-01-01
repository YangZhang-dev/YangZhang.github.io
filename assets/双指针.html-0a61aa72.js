import{_ as d,r as a,o as r,c,a as n,b as i,d as l,e}from"./app-20538318.js";const t={},v=e(`<p>双指针就是再遍历数组的时候选取两个指针，以相同方向（快慢指针），不同方向（碰撞指针）进行扫描，同时进行具体操作，有时会有两个指针遍历两个区间的情况</p><h2 id="思考" tabindex="-1"><a class="header-anchor" href="#思考" aria-hidden="true">#</a> 思考</h2><p>双指针算法较为灵活，在不同的题目中会有不同的用法，主要是通过写题来理解</p><h2 id="模板" tabindex="-1"><a class="header-anchor" href="#模板" aria-hidden="true">#</a> 模板</h2><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i=0,j=0;i&lt;m;i++)
{
  while(j&lt;n&amp;&amp;chick(j)) j++;
  //具体操作
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个只是一个很片面的模板，具体还是要看题</p><h2 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h2>`,7),m={href:"https://www.acwing.com/activity/content/problem/content/833/",target:"_blank",rel:"noopener noreferrer"},u=e(`<p>那么我们首先可以先初始化一个s数组用来判断字符是否出现过，然后使用快慢指针，i指针是快指针，向前遍历的过程中，在s数组中对应位置加一，如果发现s对应位置x大于1，那么j指针开始向前遍历，直到s[x]变为一，然后和之前的结果求最大值</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;

using namespace std;

const int N=1e5+10;

int n,res;
int m[N],s[N];

int main()
{
    cin&gt;&gt;n;
    for(int i=0;i&lt;n;i++) cin&gt;&gt;m[i];
    
    for(int i=0,j=0;i&lt;n;i++) 
    {
        s[m[i]]++;
        while(s[m[i]]&gt;1) s[m[j++]]--;
        res=max(res,i-j+1);
        
    }
    cout&lt;&lt;res;
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o={href:"https://www.acwing.com/activity/content/problem/content/834/",target:"_blank",rel:"noopener noreferrer"},b=e(`<p>这道题很明显使用双指针，由于递增，一个，从i前开始，一个j从后开始，如果大于目标值，那么j一定要--</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
using namespace std;

const int N=1e5+10;

int n,m,x;
long long a[N],b[N];
int main()
{
    cin&gt;&gt;n&gt;&gt;m&gt;&gt;x;
    for(int i=0;i&lt;n;i++) cin&gt;&gt;a[i];
    for(int i=0;i&lt;m;i++) cin&gt;&gt;b[i];
    for(int i=0,j=m-1;i&lt;n;i++)
    {
        while(j&gt;=0&amp;&amp;a[i]+b[j]&gt;x) j--;
        
        if(a[i]+b[j]==x)
        {
            cout&lt;&lt;i&lt;&lt;&quot; &quot;&lt;&lt;j;
            break;
        }
    }
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function g(h,p){const s=a("ExternalLinkIcon");return r(),c("div",null,[v,n("p",null,[n("a",m,[i("最长连续不重复子序列"),l(s)]),i(" 这道题是给定一个序列，求这个序列中的子序列，在序列中的位置可以不连续")]),u,n("p",null,[n("a",o,[i("数组元素的目标和"),l(s)]),i(" 这道题是给定两个递增数组和一个目标值，找出两个数组和为目标值的元素，保证一定有唯一解")]),b])}const f=d(t,[["render",g],["__file","双指针.html.vue"]]);export{f as default};
