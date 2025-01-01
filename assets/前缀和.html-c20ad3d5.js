import{_ as a,r as l,o as t,c as r,a as i,b as s,d,e as n}from"./app-20538318.js";const c={},v=n('<h2 id="一维前缀和" tabindex="-1"><a class="header-anchor" href="#一维前缀和" aria-hidden="true">#</a> 一维前缀和</h2><p>一维前缀和主要是来解决快速计算一维区间和的问题</p><h3 id="思考步骤" tabindex="-1"><a class="header-anchor" href="#思考步骤" aria-hidden="true">#</a> 思考步骤</h3><p>在需要计算大量的区间和时，如果暴力循环a数组去做每次都要花费O(n)的时间。 但是如果我们去构建一个数组s，每个元素是原数组当前位置之前元素的和。 那么在每次计算原数组的区间和a[n],a[n+1],...,a[m]时，只需计算s[m]-s[n-1]，每次的计算时间为O(1),相当于用空间来换时间。</p><h3 id="公式" tabindex="-1"><a class="header-anchor" href="#公式" aria-hidden="true">#</a> 公式</h3><ul><li>构建公式 s[i]=s[i-1]+a[i]</li><li>计算公式 s[m]-s[n-1]</li></ul><h3 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h3>',7),u={href:"https://www.acwing.com/activity/content/problem/content/829/",target:"_blank",rel:"noopener noreferrer"},m=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;

using namespace std;

const int N=1e6+10;

int n,m;
int q[N],s[N];


int main()
{
    
    cin&gt;&gt;n&gt;&gt;m;
    for(int i=1;i&lt;=n;i++) cin&gt;&gt;q[i];
    for(int i=1;i&lt;=n;i++) s[i]=s[i-1]+q[i];
    while(m--)
    {
        int a,b;
        cin&gt;&gt;a&gt;&gt;b;
        cout&lt;&lt;s[b]-s[a-1]&lt;&lt;endl;
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二维前缀和" tabindex="-1"><a class="header-anchor" href="#二维前缀和" aria-hidden="true">#</a> 二维前缀和</h2><p>二维前缀和和一维类似，只不过变成求矩阵的和</p><h3 id="公式-1" tabindex="-1"><a class="header-anchor" href="#公式-1" aria-hidden="true">#</a> 公式</h3><ul><li>构建公式 s[i][j]=s[i-1][j]+s[i][j-1]-s[i-1][j-1]+a[i][j]</li><li>使用公式 s[x2][y2]-s[x2][y1-1]-s[x1-1][y2]+s[x1-1][y1-1]</li></ul><h3 id="实现-1" tabindex="-1"><a class="header-anchor" href="#实现-1" aria-hidden="true">#</a> 实现</h3>`,6),b={href:"https://www.acwing.com/activity/content/problem/content/830/",target:"_blank",rel:"noopener noreferrer"},o=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
using namespace std;

const int N = 1e3+10;
int n, m,q;
int a[N][N], s[N][N];


int main()
{
	
	cin&gt;&gt;n&gt;&gt;m&gt;&gt;q;
	for(int i=1;i&lt;=n;i++)
	    for(int j=1;j&lt;=m;j++) 
	    {
	        cin&gt;&gt;a[i][j];
                s[i][j]=s[i-1][j]+s[i][j-1]-s[i-1][j-1]+a[i][j];
	    }
	        
    while(q--)
    {
        int x1,x2,y1,y2;
        cin&gt;&gt;x1&gt;&gt;y1&gt;&gt;x2&gt;&gt;y2;
        cout&lt;&lt;s[x2][y2]-s[x2][y1-1]-s[x1-1][y2]+s[x1-1][y1-1]&lt;&lt;endl;
        
    }
	return 0;
		
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function h(g,_){const e=l("ExternalLinkIcon");return t(),r("div",null,[v,i("p",null,[i("a",u,[s("具体题目和讲解"),d(e)])]),m,i("p",null,[i("a",b,[s("具体题目和讲解"),d(e)])]),o])}const p=a(c,[["render",h],["__file","前缀和.html.vue"]]);export{p as default};
