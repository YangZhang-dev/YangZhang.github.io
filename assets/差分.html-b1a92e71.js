import{_ as a,r as l,o as r,c,a as i,b as s,d,e as n}from"./app-20538318.js";const v={},t=n(`<h2 id="一维差分" tabindex="-1"><a class="header-anchor" href="#一维差分" aria-hidden="true">#</a> 一维差分</h2><p>一维差分主要解决的是需要在一维区间内进行大量的加减常数</p><h3 id="思考步骤" tabindex="-1"><a class="header-anchor" href="#思考步骤" aria-hidden="true">#</a> 思考步骤</h3><p>给定一个数组s，当需要在一个区间内进行加减常数时，暴力循环明显时O(n)的时间复杂度。 如果我们构建一个数组a，使得原数组s是a的前缀和数组，那么a也就是s的差分数组 我们可以发现，当需要s在[l,r]加c时，我们只需要对于a[l]+c,a[r+1]-c，即可在O(1)内完成操作，最后再求一下前缀和就是答案</p><h3 id="公式" tabindex="-1"><a class="header-anchor" href="#公式" aria-hidden="true">#</a> 公式</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>void insert(int l,int r,int c)
{
  a[l]+=c;
  a[r+1]-=c;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同时，差分数组的初始化也可以使用这个公式，只需传入(i,i,s[i])即可</p><h3 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h3>`,8),u={href:"https://www.acwing.com/activity/content/problem/content/831/",target:"_blank",rel:"noopener noreferrer"},m=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;

using namespace std;

const int N=1e6+10;

int a[N],s[N];


void insert(int l,int r,int c)
{
    a[l]+=c;
    a[r+1]-=c;
}

int main()
{
    int n,m;
    cin&gt;&gt;n&gt;&gt;m;
    for(int i=1;i&lt;=n;i++) 
    {
        cin&gt;&gt;s[i];
        insert(i,i,s[i]);
        
    }

    for(int i=1;i&lt;=m;i++)
    {
        int l,r,c;
        cin&gt;&gt;l&gt;&gt;r&gt;&gt;c;
        insert(l,r,c);
    }
    for(int i=1;i&lt;=n;i++)
    {
        
        a[i]+=a[i-1];
        cout&lt;&lt;a[i]&lt;&lt;&quot; &quot;;
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二维差分" tabindex="-1"><a class="header-anchor" href="#二维差分" aria-hidden="true">#</a> 二维差分</h2><p>和一维差分相同，不过提升到了二维</p><h3 id="公式-1" tabindex="-1"><a class="header-anchor" href="#公式-1" aria-hidden="true">#</a> 公式</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>void insert(int x1,int y1,int x2,int y2,int c){
    a[x1][y1]+=c;
    a[x1][y2+1]-=c;
    a[x2+1][y1]-=c;
    a[x2+1][y2+1]+=c;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现-1" tabindex="-1"><a class="header-anchor" href="#实现-1" aria-hidden="true">#</a> 实现</h3>`,6),b={href:"https://www.acwing.com/activity/content/problem/content/832/",target:"_blank",rel:"noopener noreferrer"},o=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
using namespace std;
const int N=1010;
int a[N][N],s[N][N];
void insert(int x1,int y1,int x2,int y2,int c){
    a[x1][y1]+=c;
    a[x1][y2+1]-=c;
    a[x2+1][y1]-=c;
    a[x2+1][y2+1]+=c;
}
int main(){
    int m,n,q;
    scanf(&quot;%d%d%d&quot;,&amp;n,&amp;m,&amp;q);
    for(int i=1;i&lt;=n;i++){
        for(int j=1;j&lt;=m;j++){
            scanf(&quot;%d&quot;,&amp;s[i][j]);
            insert(i,j,i,j,s[i][j]);
        }
    }
    while(q--){
        int x1,x2,y1,y2,c;
        scanf(&quot;%d%d%d%d%d&quot;,&amp;x1,&amp;y1,&amp;x2,&amp;y2,&amp;c);
        insert(x1,y1,x2,y2,c);
    }
     for(int i=1;i&lt;=n;i++){
        for(int j=1;j&lt;=m;j++){
            s[i][j]=s[i-1][j]+s[i][j-1]-s[i-1][j-1]+a[i][j];
            printf(&quot;%d &quot;,s[i][j]);
        }
        cout&lt;&lt;endl;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function h(p,g){const e=l("ExternalLinkIcon");return r(),c("div",null,[t,i("p",null,[i("a",u,[s("具体实现和讲解"),d(e)])]),m,i("p",null,[i("a",b,[s("具体题目和讲解"),d(e)])]),o])}const f=a(v,[["render",h],["__file","差分.html.vue"]]);export{f as default};
