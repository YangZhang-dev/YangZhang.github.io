---
title: DFS、BFS

order: 1
author: zzys
date: 2022-10-03
category:
- 笔记
tag:
- 算法
- DFS
- BFS
- 算法
---

深度优先遍历简称DFS，是一种树或图的遍历方式，他会优先向下遍历，直到走到末尾，然后回溯到上一个节点

## 实现

dfs可以用递归进行实现，dfs的一般模板为

```
void  DFS（结点类型 current）  // 从结点current出发递归地深度优先搜索
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
```
例：[排列数字](https://www.acwing.com/activity/content/problem/content/905/)


```c++
#include <iostream>

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
        for(int i=0;i<n;i++) cout<<path[i]<<" ";
        cout<<endl;
        return;
    }
    // 手动模拟递归搜索树
    for(int i=1;i<=n;i++)
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
    cin>>n;
    dfs(0);
    return 0;
}
```
## 题目

[n-皇后问题](https://www.acwing.com/activity/content/problem/content/906/)


```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;


// 每一行只要能放就放，能往下走就往下走，放完了看下一行，有两种情况
//1. 直到看完所有行输出
//2. for循环遍历完一层的所有的列都不满足,那么就返回到上一层，继续上一层的for循环看下面的列
//每一次回溯都要将上一侧放的Q还原为".",因为那个Q的所有子情况已经被我们全部看过且都不满足

const int N=10;
int n;
char a[N][N];
// 列，对角线，反对角线
bool col[N],dg[N],udg[N];

//u代表的是行数
void dfs(int u){
    if(u==n){//由于从0开始，所以到n截至
        for(int i=0;i<n;i++) cout<<a[i]<<endl;
        cout<<endl;
        return;
    }
    for(int i=0;i<n;i++){//枚举列数
        if(!col[i]&&!dg[i+u]&&!udg[i-u+n]){//如果当前放的格子同一列，同一对角线和反对角线都满足，才能放Q
            a[u][i]='Q';//放置皇后          根据y=x+b和y=-x+b，由于同一对角线和反对角线截距相同，所以用它来当条件
            col[i]=dg[i+u]=udg[i-u+n]=true;//标记
            dfs(u+1);//枚举下一行
            a[u][i]='.';
            col[i]=dg[i+u]=udg[i-u+n]=false;//记住最后两行还原现场
        }
    }
}


int main(){
    cin>>n;
    for(int i=0;i<n;i++)
       for(int j=0;j<n;j++) a[i][j]='.';//先将所有赋值为.
    dfs(0);
    return 0;
}

```

# BFS
广度优先遍历简称BFS，也是一种树或图的遍历方式，所谓广度优先搜索，就是从图中的某个顶点出发，寻找紧邻的、尚未访问的顶点，找到多少就访问多少，然后分别从找到的这些顶点出发，继续寻找紧邻的、尚未访问的顶点。


## 实现
```
void  BFS（）
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
```
[走迷宫](https://www.acwing.com/activity/content/problem/content/907/)

```c++
#include <bits/stdc++.h>

using namespace std;
typedef pair <int,int> PII;
const int N=1e2+10;
int n,m;
// g记录地图，d记录距离
int g[N][N],d[N][N];
void bfs()
{
    queue<PII> a;
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
        for(int i=0;i<4;i++)
        {
            int x=one.first+dx[i],y=one.second+dy[i];
            if(x>=0&&x<n&&y>=0&&y<m&&d[x][y]==0&&g[x][y]==0)
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
    cin>>n>>m;
    for(int i=0;i<n;i++)
        for(int j=0;j<m;j++)
            cin>>g[i][j];
    bfs();
    cout<<d[n-1][m-1];
    return 0;
}
```