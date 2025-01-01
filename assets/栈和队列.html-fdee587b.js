import{_ as d,r as a,o as v,c as t,a as n,b as i,d as l,e as s}from"./app-20538318.js";const c={},r=n("h2",{id:"栈",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#栈","aria-hidden":"true"},"#"),i(" 栈")],-1),u=n("p",null,"栈的特点是先进先出，是一种基础的数据结构，可以用来解决一些特定的问题",-1),m=n("h3",{id:"实现",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#实现","aria-hidden":"true"},"#"),i(" 实现")],-1),b=n("p",null,"可以调用stl库的stack，也可以使用数组和一个变量tt来模拟，tt用来记录栈顶",-1),o={href:"https://www.acwing.com/activity/content/problem/content/865/",target:"_blank",rel:"noopener noreferrer"},p=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
using namespace std;
#define ll long long

const int N=1e6+10;

ll x;
int m,n;
int b[N];

void push(ll x){
    b[++n]=x;
}

void pop(){
    n--;
}
bool empty(){
    if(n&gt;0) return true;
    else return false;
}
int query(){
    return b[n];
}
int main(){
    cin&gt;&gt;m;
    while(m--){
        string a;
        cin&gt;&gt;a;
        if(a==&quot;push&quot;){
            int x;
            cin&gt;&gt;x;
            push(x);
        }
        else if(a==&quot;pop&quot;){
            pop();
        }
        else if(a==&quot;empty&quot;){
            bool ans=empty();
            if(!ans) cout&lt;&lt;&quot;YES&quot;&lt;&lt;endl;
            else cout&lt;&lt;&quot;NO&quot;&lt;&lt;endl;
        }
        else{
            int ans=query();
            cout&lt;&lt;ans&lt;&lt;endl;
        }
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h3>`,2),h={href:"https://www.acwing.com/activity/content/problem/content/3648/",target:"_blank",rel:"noopener noreferrer"},g=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;stack&gt;
#include &lt;unordered_map&gt;
#include &lt;cstring&gt;
#include &lt;algorithm&gt;
using namespace std;

// 存放计算的数字
stack&lt;int&gt; num;
// 存放运算符和括号
stack&lt;char&gt; op;

void eval()
{
    // 注意取值顺序，由于栈的特性要先取b后取a，再减法和除法会有影响
    auto b = num.top(); num.pop();
    auto a = num.top(); num.pop();
    auto c = op.top(); op.pop();
    int x;
    if (c == &#39;+&#39;) x = a + b;
    else if (c == &#39;-&#39;) x = a - b;
    else if (c == &#39;*&#39;) x = a * b;
    else x = a / b;
    num.push(x);
    
}

int main()
{
    string s;
    cin&gt;&gt;s;
    // 定义运算符的优先级
    unordered_map&lt;char,int&gt; pr={{&#39;+&#39;,1},{&#39;-&#39;,1},{&#39;*&#39;,2},{&#39;/&#39;,2}};
    for(int i=0;i&lt;s.size();i++)
    {
        auto c=s[i];
        // 取得整个数字，存入栈
        if(isdigit(c))
        {
            int x=0,j=i;
            while(j&lt;s.size()&amp;&amp;isdigit(s[j]))
                x=x*10+s[j++]-&#39;0&#39;;
            i=j-1;
            num.push(x);
        }
        // 左括号直接存入
        else if(c==&#39;(&#39;) op.push(c);
        else if(c==&#39;)&#39;)
        {
            // 将括号内的运算全部算出
            while(op.top()!=&#39;(&#39;) eval();
            op.pop();
        }
        else
        {
            // 如果当前的符号栈内的运算符优先级大于当前的运算符，则代表栈顶符号的子树已经全部计算完毕
            while(op.size() &amp;&amp; op.top() != &#39;(&#39; &amp;&amp; pr[op.top()] &gt;= pr[c]) eval();
            op.push(c);
        }
    }
    //计算剩余的数字
    while (op.size()) eval();
    cout &lt;&lt; num.top() &lt;&lt; endl;
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="单调栈" tabindex="-1"><a class="header-anchor" href="#单调栈" aria-hidden="true">#</a> 单调栈</h2><p>单调栈最常用的用法是求某一个序列左边第一个比它小的元素之类的题，只需要维护一个单调栈，在每次扫描到一个数时判断它和栈顶元素的大小，如果小于栈顶元素那么我们可以就可以将栈顶pop，继续向下判断，直到找到比他小的元素，之后将它压入栈，这样就在扫描的过程中可以保证栈的单调性</p>`,3),f={href:"https://www.acwing.com/activity/content/problem/content/867/",target:"_blank",rel:"noopener noreferrer"},_=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;                                
using namespace std;
stack&lt;int&gt; m;

int main() {
    int n;
    cin&gt;&gt;n;
    while(n--)
    {
        int x;
        cin&gt;&gt;x;
        while(m.size()&amp;&amp;m.top()&gt;=x) m.pop();
        if(m.size()) cout&lt;&lt;m.top()&lt;&lt;&quot; &quot;;
        else cout&lt;&lt;&quot;-1&quot;&lt;&lt;&quot; &quot;;
        m.push(x);
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="队列" tabindex="-1"><a class="header-anchor" href="#队列" aria-hidden="true">#</a> 队列</h2><p>队列和栈类似，只不过是先进先出</p><h3 id="实现-1" tabindex="-1"><a class="header-anchor" href="#实现-1" aria-hidden="true">#</a> 实现</h3><p>使用两个变量模拟队头和队尾</p>`,5),q={href:"https://www.acwing.com/activity/content/problem/content/866/",target:"_blank",rel:"noopener noreferrer"},x=s(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;                        //先进先出
using namespace std;

const int N=1e6+10;

int a[N];
int first,last=-1;

int main(){
    string b;
    int m;
    cin&gt;&gt;m;
    while(m--){
    cin&gt;&gt;b;
    if(b==&quot;pop&quot;){
        first++;
    }
    else if(b==&quot;push&quot;){
        int x;
        cin&gt;&gt;x;
        a[++last]=x;
    }
    else if(b==&quot;empty&quot;){
        if(last-first&lt;0) cout&lt;&lt;&quot;YES&quot;&lt;&lt;endl;
        else cout&lt;&lt;&quot;NO&quot;&lt;&lt;endl;
    }
    else {
        cout&lt;&lt;a[first]&lt;&lt;endl;
    }
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="题目-1" tabindex="-1"><a class="header-anchor" href="#题目-1" aria-hidden="true">#</a> 题目</h3>`,2),w={href:"https://www.acwing.com/activity/content/problem/content/868/",target:"_blank",rel:"noopener noreferrer"},k=s(`<p>通过每次的扫描元素和队尾元素的比较，来保证队列的单调性，使得在O(1)的复杂度内完成一次查询操作</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;                
#define ll long long

using namespace std;
const int N=1000010;

int a[N],q[N];//q是队列，存放a数组的下标



int main() {
    int n,k;
    cin&gt;&gt;n&gt;&gt;k;                        //k是题目给的窗口大小
    for(int i=0;i&lt;n;i++) cin&gt;&gt;a[i];
    int h=0,t=-1;                  //头h，，，t尾
    for (int i = 0; i &lt;n; i ++ ){
        //h&lt;=t是队列不为空的条件，i-k+1是窗口的左端应该位于的坐标，如果说大于q【h】，那么队列左端就应该更新
        if(h&lt;=t&amp;&amp;i-k+1&gt;q[h]) h++;
        //如果队列中的元素大于待增加的元素，那么就循环弹出直到队列为空或小于待增加元素，保证队列的单调性
        while(h&lt;=t&amp;&amp;a[q[t]]&gt;=a[i]) t--;
        q[++t]=i;                      //加入新元素
        if(i&gt;=k-1) cout&lt;&lt;a[q[h]]&lt;&lt;&quot; &quot;;//判断条件是是指应该等到窗口内元素大于3个是在输出
    }
    cout&lt;&lt;endl;
    h=0,t=-1;//下面的只是一个&lt;,&gt;号的改变
    for (int i = 0; i &lt;n; i ++ ){
        if(h&lt;=t&amp;&amp;i-k+1&gt;q[h]) h++;
        while(h&lt;=t&amp;&amp;a[q[t]]&lt;=a[i]) t--;
        q[++t]=i;
        if(i&gt;=k-1) cout&lt;&lt;a[q[h]]&lt;&lt;&quot; &quot;;
    }

    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function N(y,z){const e=a("ExternalLinkIcon");return v(),t("div",null,[r,u,m,b,n("p",null,[n("a",o,[i("数组模拟栈"),l(e)])]),p,n("p",null,[n("a",h,[i("表达式求值"),l(e)]),i(" 此题思路式通过栈模拟中缀表达式树，一个栈存放操作符，一个栈存放数字")]),g,n("p",null,[n("a",f,[i("题目和讲解"),l(e)])]),_,n("p",null,[n("a",q,[i("数组模拟队列"),l(e)])]),x,n("p",null,[n("a",w,[i("滑动窗口"),l(e)])]),k])}const E=d(c,[["render",N],["__file","栈和队列.html.vue"]]);export{E as default};
