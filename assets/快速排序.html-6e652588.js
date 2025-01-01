import{_ as d,r,o as t,c as a,a as n,b as i,d as l,e as s}from"./app-20538318.js";const c={},o=n("h2",{id:"时间复杂度",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#时间复杂度","aria-hidden":"true"},"#"),i(" 时间复杂度")],-1),v=n("thead",null,[n("tr",null,[n("th",null,"最好时间复杂度"),n("th",null,"最坏时间复杂度")])],-1),u=n("tr",null,[n("td",null,"O(nlogn)"),n("td",null,"O(n²)")],-1),m=n("tr",null,[n("td",null,"当每一次划分的point使得一边是1，一边是n-1时，就是最坏情况"),n("td")],-1),h={href:"https://www.cnblogs.com/pugang/archive/2012/07/02/2573075.html",target:"_blank",rel:"noopener noreferrer"},b=n("td",null,null,-1),_=s('<h1 id="主要步骤" tabindex="-1"><a class="header-anchor" href="#主要步骤" aria-hidden="true">#</a> 主要步骤</h1><ol><li>寻找x，划分边界，x是可以随意取的</li><li><mark>调整区间，使得左边都小于&lt;=x,右边都&gt;=x</mark></li><li>递归处理左右两边</li></ol><p><strong>注意</strong>： 调整后的区间交界点不一定等于x，因为左右两个区间还是乱序，x的位置是不确定的</p><h2 id="实现方式" tabindex="-1"><a class="header-anchor" href="#实现方式" aria-hidden="true">#</a> 实现方式</h2><h3 id="暴力" tabindex="-1"><a class="header-anchor" href="#暴力" aria-hidden="true">#</a> 暴力</h3><p>开两个数组，遍历数据，小于等于x的放在a数组中，大于x放在b数组中，最后合并到一起</p><h3 id="双指针" tabindex="-1"><a class="header-anchor" href="#双指针" aria-hidden="true">#</a> 双指针</h3>',7),x={href:"https://www.acwing.com/activity/content/problem/content/819/",target:"_blank",rel:"noopener noreferrer"},p=n("li",null,"首先因为我们的循环体内是先会进行一次++，所以定义两个指针i，j为l-1和r+1.",-1),f=n("li",null,"对于i来说就是要从左向右找到第一个大于等于x的数停下来，j就是要从右向左找到第一个小于于等于x的数停下来，然后交换两个数，这样可以全程保证i左边的一定小于x，j右边的一定大于x",-1),g={href:"https://www.acwing.com/solution/content/16777/",target:"_blank",rel:"noopener noreferrer"},w=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
using namespace std;

const int N=1e6+10;

int m[N];
int n;

void quick_sort(int m[],int l,int r)
{
    if(l==r) return;
    int i=l-1,j=r+1;
    int x=m[(l+r)/2];
    
    while(i&lt;j)
    {
        while(m[++i]&lt;x);
        while(m[--j]&gt;x);
        if(i&lt;j) swap(m[i],m[j]);
    }
    quick_sort(m,l,j);
    quick_sort(m,j+1,r);
    
}

int main()
{
    cin&gt;&gt;n;
    for(int i=0;i&lt;n;i++)
    {
        scanf(&quot;%d&quot;,&amp;m[i]);
    }
    
    quick_sort(m,0,n-1);
    for(int i=0;i&lt;n;i++)
    {
        printf(&quot;%d &quot;,m[i]);
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function k(j,q){const e=r("ExternalLinkIcon");return t(),a("div",null,[o,n("table",null,[v,n("tbody",null,[u,m,n("tr",null,[n("td",null,[n("a",h,[i("快速排序的时间复杂度分析"),l(e)])]),b])])]),_,n("p",null,[n("a",x,[i("题目和讲解"),l(e)])]),n("ol",null,[p,f,n("li",null,[i("递归处理左右 "),n("a",g,[i("快速排序算法的证明与边界分析"),l(e)])])]),w])}const V=d(c,[["render",k],["__file","快速排序.html.vue"]]);export{V as default};
