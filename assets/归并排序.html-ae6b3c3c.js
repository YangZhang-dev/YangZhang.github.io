import{_ as s,r as d,o as r,c as t,a as n,b as i,d as l,e as a}from"./app-20538318.js";const c={},v=n("h2",{id:"时间复杂度",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#时间复杂度","aria-hidden":"true"},"#"),i(" 时间复杂度")],-1),m=n("table",null,[n("thead",null,[n("tr",null,[n("th",null,"最坏时间复杂度"),n("th",null,"最好时间复杂度")])]),n("tbody",null,[n("tr",null,[n("td",null,"O(nlogn)"),n("td",null,"O(nlogn)")])])],-1),u={href:"https://zhuanlan.zhihu.com/p/341225128",target:"_blank",rel:"noopener noreferrer"},o=n("h2",{id:"主要步骤",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#主要步骤","aria-hidden":"true"},"#"),i(" 主要步骤")],-1),b=n("ol",null,[n("li",null,"归并排序是分治算法，第一步就是要划分区间"),n("li",null,"递归的处理子问题"),n("li",null,"合并子问题。由于在第二步会形成两个分别有序的子区间，所以这里使用双指针算法，并使用一个中间数组来进行子区间的合并")],-1),h=n("h2",{id:"实现",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#实现","aria-hidden":"true"},"#"),i(" 实现")],-1),_={href:"https://www.acwing.com/activity/content/problem/content/821/",target:"_blank",rel:"noopener noreferrer"},p={href:"https://www.acwing.com/solution/content/16778/",target:"_blank",rel:"noopener noreferrer"},f=a(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>
#include &lt;bits/stdc++.h&gt;

using namespace std;

const int N=1e6+10;

int m[N],tmp[N];



void merge_sort(int m[],int l,int r)
{
    if(l&gt;=r) return;
    int mid=l+r&gt;&gt;1;
    
    merge_sort(m,l,mid);
    merge_sort(m,mid+1,r);
    
    int i=l,j=r-1,k=0;
    while(i&lt;=mid&amp;&amp;j&lt;=r)
    {
        if(m[i]&lt;=m[j]) tmp[k++]=m[i++];
        else tmp[k++]=m[j++];
    }
    while(i&lt;=mid) tmp[k++]=m[i++];
    while(j&lt;=r) tmp[k++]=m[j++];
    
    for(int i=l,j=0;i&lt;=r;i++,j++) m[i]=tmp[j];

}


int main()
{
    int n=0;
    cin&gt;&gt;n;
    for(int i=0;i&lt;n;i++)
    {
        scanf(&quot;%d&quot;,&amp;m[i]);
    }
    
    merge_sort(m,0,n-1);
    
    for(int i=0;i&lt;n;i++)
    {
        printf(&quot;%d &quot;,m[i]);
    }
    
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function g(k,w){const e=d("ExternalLinkIcon");return r(),t("div",null,[v,m,n("p",null,[i("归并排序并不依赖于数组的起始状态，所以最好，最坏时间复杂度都是一样的，并且归并排序时稳定的，而快速排序是不稳定的 "),n("a",u,[i("归并排序时间复杂度分析"),l(e)])]),o,b,h,n("p",null,[n("a",_,[i("题目以及讲解"),l(e)]),i(" 在合并子问题的步骤中，第一个循环是将主体部分进行合并到中间数组中，然后看子区间有没有剩下的，再补充进去，然后是覆盖原数组，注意i要从l开始到r停止，因为当前处理的是m数组的一个从l到r的子区间")]),n("p",null,[n("a",p,[i("归并排序的证明与边界分析"),l(e)])]),f])}const j=s(c,[["render",g],["__file","归并排序.html.vue"]]);export{j as default};
