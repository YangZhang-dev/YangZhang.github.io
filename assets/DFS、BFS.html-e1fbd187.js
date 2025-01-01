import{_ as l,r as v,o as a,c as r,a as n,b as i,d as s,e}from"./app-20538318.js";const c={},u=e(`<p>深度优先遍历简称DFS，是一种树或图的遍历方式，他会优先向下遍历，直到走到末尾，然后回溯到上一个节点</p><h2 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h2><p>dfs可以用递归进行实现，dfs的一般模板为</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>void  DFS（结点类型 current）  // 从结点current出发递归地深度优先搜索
    {
        置visited[current]=true；   // 表示结点current已被处理
        if  （current结点是目标状态）
        { 
             置搜索成功标志flag= false;
             return ;
         }
         while  （current 还可以扩展）
         {
              由current结点扩展出新结点new；
              if （! visited[new]） DFS（new）； // 对未处理的结点new递归调用DFS
         }
         置visited[current]=flase；   // 表示结点current以后可能被处理
      }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),t={href:"https://www.acwing.com/activity/content/problem/content/905/",target:"_blank",rel:"noopener noreferrer"},m=e(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;

using namespace std;

const int N=10;
int path[N];
bool st[N];
int n;

// 入参是判断数字放到到第几位了
void dfs(int u)
{
    // 递归到最后一位
    if(u==n)
    {
        for(int i=0;i&lt;n;i++) cout&lt;&lt;path[i]&lt;&lt;&quot; &quot;;
        cout&lt;&lt;endl;
        return;
    }
    // 手动模拟递归搜索树
    for(int i=1;i&lt;=n;i++)
        if(!st[i])
        {
            path[u]=i;
            st[i]=true;
            dfs(u+1);
            // 将标识还原
            st[i]=false;
        }
}
int main()  
{
    cin&gt;&gt;n;
    dfs(0);
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="题目" tabindex="-1"><a class="header-anchor" href="#题目" aria-hidden="true">#</a> 题目</h2>`,2),b={href:"https://www.acwing.com/activity/content/problem/content/906/",target:"_blank",rel:"noopener noreferrer"},o=e(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
using namespace std;
typedef long long ll;


// 每一行只要能放就放，能往下走就往下走，放完了看下一行，有两种情况
//1. 直到看完所有行输出
//2. for循环遍历完一层的所有的列都不满足,那么就返回到上一层，继续上一层的for循环看下面的列
//每一次回溯都要将上一侧放的Q还原为&quot;.&quot;,因为那个Q的所有子情况已经被我们全部看过且都不满足

const int N=10;
int n;
char a[N][N];
// 列，对角线，反对角线
bool col[N],dg[N],udg[N];

//u代表的是行数
void dfs(int u){
    if(u==n){//由于从0开始，所以到n截至
        for(int i=0;i&lt;n;i++) cout&lt;&lt;a[i]&lt;&lt;endl;
        cout&lt;&lt;endl;
        return;
    }
    for(int i=0;i&lt;n;i++){//枚举列数
        if(!col[i]&amp;&amp;!dg[i+u]&amp;&amp;!udg[i-u+n]){//如果当前放的格子同一列，同一对角线和反对角线都满足，才能放Q
            a[u][i]=&#39;Q&#39;;//放置皇后          根据y=x+b和y=-x+b，由于同一对角线和反对角线截距相同，所以用它来当条件
            col[i]=dg[i+u]=udg[i-u+n]=true;//标记
            dfs(u+1);//枚举下一行
            a[u][i]=&#39;.&#39;;
            col[i]=dg[i+u]=udg[i-u+n]=false;//记住最后两行还原现场
        }
    }
}


int main(){
    cin&gt;&gt;n;
    for(int i=0;i&lt;n;i++)
       for(int j=0;j&lt;n;j++) a[i][j]=&#39;.&#39;;//先将所有赋值为.
    dfs(0);
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="bfs" tabindex="-1"><a class="header-anchor" href="#bfs" aria-hidden="true">#</a> BFS</h1><p>广度优先遍历简称BFS，也是一种树或图的遍历方式，所谓广度优先搜索，就是从图中的某个顶点出发，寻找紧邻的、尚未访问的顶点，找到多少就访问多少，然后分别从找到的这些顶点出发，继续寻找紧邻的、尚未访问的顶点。</p><h2 id="实现-1" tabindex="-1"><a class="header-anchor" href="#实现-1" aria-hidden="true">#</a> 实现</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>void  BFS（）
{
    队列初始化；
    初始结点入队；
    while （队列非空）
    {  
          队头元素出队，赋给current；
          while  （current 还可以扩展）
          {
              由结点current扩展出新结点new；
              if  （new 重复于已有的结点状态） continue;
              new结点入队；
              if  (new结点是目标状态)

              {
                    置flag= true;    break; 
               }
          }
      }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),g={href:"https://www.acwing.com/activity/content/problem/content/907/",target:"_blank",rel:"noopener noreferrer"},f=e(`<div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;

using namespace std;
typedef pair &lt;int,int&gt; PII;
const int N=1e2+10;
int n,m;
// g记录地图，d记录距离
int g[N][N],d[N][N];
void bfs()
{
    queue&lt;PII&gt; a;
    a.push({0,0});
    int dx[4]={-1,1,0,0};
    int dy[4]={0,0,1,-1};
    memset(d,0,sizeof d);
    d[0][0]=0;
    while(a.size())
    {
        auto one=a.front();
        a.pop();
        // 每次都取出对头元素，向四周寻找满足条件的点
        for(int i=0;i&lt;4;i++)
        {
            int x=one.first+dx[i],y=one.second+dy[i];
            if(x&gt;=0&amp;&amp;x&lt;n&amp;&amp;y&gt;=0&amp;&amp;y&lt;m&amp;&amp;d[x][y]==0&amp;&amp;g[x][y]==0)
            {
                // 记录距离
                d[x][y]=1+d[one.first][one.second];
                // 将点入队
                a.push({x,y});
            }
        }
    }
}

int main()
{   
    cin&gt;&gt;n&gt;&gt;m;
    for(int i=0;i&lt;n;i++)
        for(int j=0;j&lt;m;j++)
            cin&gt;&gt;g[i][j];
    bfs();
    cout&lt;&lt;d[n-1][m-1];
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function p(h,x){const d=v("ExternalLinkIcon");return a(),r("div",null,[u,n("p",null,[i("例："),n("a",t,[i("排列数字"),s(d)])]),m,n("p",null,[n("a",b,[i("n-皇后问题"),s(d)])]),o,n("p",null,[n("a",g,[i("走迷宫"),s(d)])]),f])}const w=l(c,[["render",p],["__file","DFS、BFS.html.vue"]]);export{w as default};
