import{_ as l,r as v,o as a,c,a as i,b as d,d as s,e as n}from"./app-20538318.js";const r={},t=n(`<p>链表创建有两种方式，一种是：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct Node
{
  int num;
  Node* next;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种动态创建链表在new新节点的方式很慢</p><p>另一种就是用数组模拟链表</p><h2 id="单链表" tabindex="-1"><a class="header-anchor" href="#单链表" aria-hidden="true">#</a> 单链表</h2><p>在单链表中，用的最多的时邻接表，常常用它来存储树和图</p><p>一般使用e数组存储节点的值，ne数组存储下一个位置的指针</p><p><img src="http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/33b136d4cc485b398722f33a53eef64c.png" alt="image.png" loading="lazy"></p><h3 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h3>`,9),u={href:"https://www.acwing.com/activity/content/problem/content/863/",target:"_blank",rel:"noopener noreferrer"},m=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
using namespace std;

const int N=1e5+10;

// head中存的是头节点的下标，idx中存的是当前可以用哪个点
int head=-1,idx=0;

int e[N],ne[N];//ne是指向下一个节点

void add_head(int x){          //一般用的都是头插法
    e[idx]=x;
    ne[idx]=head;
    head=idx++;
}

void move(int k){
    ne[k]=ne[ne[k]];
}

void insert(int k,int x){
    e[idx]=x;
    ne[idx]=ne[k];
    ne[k]=idx++;
}

int main(){
    int m;
    cin&gt;&gt;m;
    
    while(m--){
        char a;
        int x,p;
        cin&gt;&gt;a;
        if(a==&#39;H&#39;){
            cin&gt;&gt;x;
            add_head(x);
        }
        else if(a==&#39;D&#39;){
            cin&gt;&gt;x;
            if (!x) head = ne[head];
            move(x-1);
        }
        else{
            cin&gt;&gt;x&gt;&gt;p;
            insert(x-1,p);
        }
    }
    for(int i=head;i!=-1;i=ne[i]){
        cout&lt;&lt;e[i]&lt;&lt;&quot; &quot;;
    }
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="双链表" tabindex="-1"><a class="header-anchor" href="#双链表" aria-hidden="true">#</a> 双链表</h2><p>用于优化某些问题，双链表即引入了左指针，基本原理和单链表一样</p><h3 id="实现-1" tabindex="-1"><a class="header-anchor" href="#实现-1" aria-hidden="true">#</a> 实现</h3>`,4),b={href:"https://www.acwing.com/activity/content/problem/content/864/",target:"_blank",rel:"noopener noreferrer"},o=n(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
using namespace std;

const int N=1e6+10;

int idx,m;

int l[N],r[N],e[N];

void add(int k,int x){//函数本身是在k点右边插入一个数
    e[idx]=x;//先将数值存入
    l[idx]=k;//四条边模拟链接，顺序不能变
    r[idx]=r[k];
    l[r[k]]=idx;
    r[k]=idx++;
}

void move(int k){//删除就是使当前点的两边跳过这个点直接产生联系
    
    l[r[k]]=l[k];
    r[l[k]]=r[k];
} 

int main(){
    cin&gt;&gt;m;
    
    r[0]=1;//e【0】为头节点，e【1】为尾节点，l是指向左边元素的指针，r指向右边,idx是目前用到的下标。初始化为空表
    l[1]=0;
    idx=2;
    
    while(m--){
        string a;
        cin&gt;&gt;a;
        if(a==&quot;L&quot;){
          int x;
          cin&gt;&gt;x;
          add(0,x);
        }
        else if(a==&quot;R&quot;){
            int x;
            cin&gt;&gt;x;
            add(l[1],x);//倒数第二个点的右边
            
        }
        else if(a==&quot;D&quot;){
            int k;
            cin&gt;&gt;k;
            move(k+1);
        }
        else if(a==&quot;IL&quot;){
            int k,x;
            cin&gt;&gt;k&gt;&gt;x;
            add(l[k+1],x);//在该点左边的点向右边插入一个点
        }
        else{
            int k,x;
            cin&gt;&gt;k&gt;&gt;x;
            add(k+1,x);//因为我们是从0开始计数所以减一但是有两个结点被占用所以加二，则为加一
        }
    }
    for(int i=r[0];i!=1;i=r[i]) cout&lt;&lt;e[i]&lt;&lt;&quot; &quot;;
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function g(x,h){const e=v("ExternalLinkIcon");return a(),c("div",null,[t,i("p",null,[i("a",u,[d("具体题目和讲解"),s(e)])]),m,i("p",null,[i("a",b,[d("具体的题目和讲解"),s(e)])]),o])}const _=l(r,[["render",g],["__file","单链表和双链表的数组实现.html.vue"]]);export{_ as default};
