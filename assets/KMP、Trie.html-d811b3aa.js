import{_ as d,r as v,o as a,c as t,a as n,b as i,d as s,e as l}from"./app-20538318.js";const r={},c=n("h2",{id:"kmp",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#kmp","aria-hidden":"true"},"#"),i(" KMP")],-1),u=n("p",null,"KMP是用来匹配字串的一种算法，它的核心是构建一个next数组，记录当前位置的最长相等前后缀的长度",-1),m=n("h3",{id:"实现",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#实现","aria-hidden":"true"},"#"),i(" 实现")],-1),b={href:"https://www.acwing.com/activity/content/problem/content/869/",target:"_blank",rel:"noopener noreferrer"},o=l(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt; // 寻找字串最长相等前后缀
using namespace std;
void getNext(vector&lt;int&gt;&amp; next, string s2) {
	int j = 0;
	next[0] = 0;
	for(int i=1;i&lt;s2.size();i++)
	{
	    while(j&gt;0&amp;&amp;s2[i]!=s2[j]) j=next[j-1];
	    if(s2[i]==s2[j]) j++;
	    next[i]=j;
	}
}
int main() {
	string s1, s2;
	int n,m;
	cin &gt;&gt;n&gt;&gt; s2 &gt;&gt; m&gt;&gt;s1;
	int j = 0;
	vector&lt;int&gt; next(s2.size());
	getNext(next, s2);
	for(int i=0;i&lt;s1.size();i++)
	{
	    while(j&gt;0&amp;&amp;s1[i]!=s2[j]) j=next[j-1];
	    if(s1[i]==s2[j]) j++;
	    if(j==s2.size())  cout&lt;&lt;i-j+1&lt;&lt;&quot; &quot;;
	}
	
	return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="trie" tabindex="-1"><a class="header-anchor" href="#trie" aria-hidden="true">#</a> Trie</h2><p>字典树是一种高效的存储和查询字符串的数据结构，它的根节点是空的，每个节点只保存一个元素，并且存有单词出现的频率，这里使用数组模拟</p><h3 id="实现-1" tabindex="-1"><a class="header-anchor" href="#实现-1" aria-hidden="true">#</a> 实现</h3>`,4),g={href:"https://www.acwing.com/activity/content/problem/content/883/",target:"_blank",rel:"noopener noreferrer"},h=l(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define ll long long
using namespace std;

const int N=1e5+10;
//trie字典树的根节点是空的
int q[N][26],cnt[N];//q数组的第二维大小是一个节点最多能有几个分叉

int idx;
void insert(string s)
{
    int p=0;
    for(int i=0;i&lt;s.size();i++)
    {
        int u=s[i]-&#39;a&#39;;//先确定走哪一条路
        if(!q[p][u]) q[p][u]=++idx;//如果没有这条路，就新建一条
        p=q[p][u];         //有点话就直接过去
    }
    cnt[p]++;//每一次到一个字符串末尾就让此处cnt++,记录单词个数
}

int query(string s)
{
    int p=0;
    for(int i=0;i&lt;s.size();i++)
    {
        int u=s[i]-&#39;a&#39;;
        if(!q[p][u]) return 0;
        p=q[p][u];
    }
    return cnt[p];
}

int main() 
{
    int n;
    cin&gt;&gt;n;
    while(n--)
    {
        char a;
        string b;
        cin&gt;&gt;a&gt;&gt;b;
        if(a==&#39;I&#39;)  insert(b);
        else
        {
            int cnt=query(b);
            cout&lt;&lt;cnt&lt;&lt;endl;
        }
    }

    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h3>`,2),p={href:"https://www.acwing.com/activity/content/problem/content/884/",target:"_blank",rel:"noopener noreferrer"},f=l(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define ll long long

using namespace std;
const int N=1e5+10;
const int M=3e6+10;
int a[N],s[M][2];
int idx;

void insert(int x){
    int q=0;
    for(int i=30;~i;i--){  //~i 可以看成i&gt;=0，
        int u=x&gt;&gt;i&amp;1;  //从高位到低位遍历取值
        if(!s[q][u]) s[q][u]=++idx;
        q=s[q][u];
    }
}

int query(int x){
    int q=0,ans=0;
    for(int i=30;~i;i--){
        int u=x&gt;&gt;i&amp;1;
        if(s[q][!u]){
            ans+=1&lt;&lt;i;  //对于相反的位，异或值为1，加入答案中
            q=s[q][!u];
        }
        else q=s[q][u];
    }
    return ans;
}

int main() {
    int n;
    cin&gt;&gt;n;
    for(int i=0;i&lt;n;i++) {
        cin&gt;&gt;a[i];
        insert(a[i]);
    }
    int ans=0;
    for(int i=0;i&lt;n;i++){
         ans=max(ans,query(a[i]));  //对于每一个数我们都进行计算
    }
    cout&lt;&lt;ans;

    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function _(x,q){const e=v("ExternalLinkIcon");return a(),t("div",null,[c,u,m,n("p",null,[n("a",b,[i("KMP字符串"),s(e)])]),o,n("p",null,[n("a",g,[i("字串的统计"),s(e)])]),h,n("p",null,[n("a",p,[i("最大异或对"),s(e)]),i(" 给定n个数，求任意两个数异或的最大值，如果暴力两重循环会TLE 考虑使用字典树存储每个数的二进制形式，对于每一个数字，查询字典树，对于其每一个二进制位查询是否存在非值（如果是二进制位1，那么字典树存在0可使结果最大化），存在的话加入答案中，不存在则跳到低位，由高位到低位查询一边，得到当前数字异或的最大值，取所有数字结果的最大值即为答案")]),f])}const w=d(r,[["render",_],["__file","KMP、Trie.html.vue"]]);export{w as default};
