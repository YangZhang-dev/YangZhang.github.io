---
title: KMP、Trie

order: 1
author: zzys
date: 2022-09-30
category:
- 笔记
tag:
- 算法
- KMP
- Trie
- 算法
---
## KMP
KMP是用来匹配字串的一种算法，它的核心是构建一个next数组，记录当前位置的最长相等前后缀的长度

### 实现
[KMP字符串](https://www.acwing.com/activity/content/problem/content/869/)

```c++
#include<bits/stdc++.h> // 寻找字串最长相等前后缀
using namespace std;
void getNext(vector<int>& next, string s2) {
	int j = 0;
	next[0] = 0;
	for(int i=1;i<s2.size();i++)
	{
	    while(j>0&&s2[i]!=s2[j]) j=next[j-1];
	    if(s2[i]==s2[j]) j++;
	    next[i]=j;
	}
}
int main() {
	string s1, s2;
	int n,m;
	cin >>n>> s2 >> m>>s1;
	int j = 0;
	vector<int> next(s2.size());
	getNext(next, s2);
	for(int i=0;i<s1.size();i++)
	{
	    while(j>0&&s1[i]!=s2[j]) j=next[j-1];
	    if(s1[i]==s2[j]) j++;
	    if(j==s2.size())  cout<<i-j+1<<" ";
	}
	
	return 0;
}
```



## Trie

字典树是一种高效的存储和查询字符串的数据结构，它的根节点是空的，每个节点只保存一个元素，并且存有单词出现的频率，这里使用数组模拟


### 实现
[字串的统计](https://www.acwing.com/activity/content/problem/content/883/)

```c++
#include <bits/stdc++.h>
#define ll long long
using namespace std;

const int N=1e5+10;
//trie字典树的根节点是空的
int q[N][26],cnt[N];//q数组的第二维大小是一个节点最多能有几个分叉

int idx;
void insert(string s)
{
    int p=0;
    for(int i=0;i<s.size();i++)
    {
        int u=s[i]-'a';//先确定走哪一条路
        if(!q[p][u]) q[p][u]=++idx;//如果没有这条路，就新建一条
        p=q[p][u];         //有点话就直接过去
    }
    cnt[p]++;//每一次到一个字符串末尾就让此处cnt++,记录单词个数
}

int query(string s)
{
    int p=0;
    for(int i=0;i<s.size();i++)
    {
        int u=s[i]-'a';
        if(!q[p][u]) return 0;
        p=q[p][u];
    }
    return cnt[p];
}

int main() 
{
    int n;
    cin>>n;
    while(n--)
    {
        char a;
        string b;
        cin>>a>>b;
        if(a=='I')  insert(b);
        else
        {
            int cnt=query(b);
            cout<<cnt<<endl;
        }
    }

    return 0;
}

```
### 题目
[最大异或对](https://www.acwing.com/activity/content/problem/content/884/)
给定n个数，求任意两个数异或的最大值，如果暴力两重循环会TLE
考虑使用字典树存储每个数的二进制形式，对于每一个数字，查询字典树，对于其每一个二进制位查询是否存在非值（如果是二进制位1，那么字典树存在0可使结果最大化），存在的话加入答案中，不存在则跳到低位，由高位到低位查询一边，得到当前数字异或的最大值，取所有数字结果的最大值即为答案


```c++
#include <bits/stdc++.h>
#define ll long long

using namespace std;
const int N=1e5+10;
const int M=3e6+10;
int a[N],s[M][2];
int idx;

void insert(int x){
    int q=0;
    for(int i=30;~i;i--){  //~i 可以看成i>=0，
        int u=x>>i&1;  //从高位到低位遍历取值
        if(!s[q][u]) s[q][u]=++idx;
        q=s[q][u];
    }
}

int query(int x){
    int q=0,ans=0;
    for(int i=30;~i;i--){
        int u=x>>i&1;
        if(s[q][!u]){
            ans+=1<<i;  //对于相反的位，异或值为1，加入答案中
            q=s[q][!u];
        }
        else q=s[q][u];
    }
    return ans;
}

int main() {
    int n;
    cin>>n;
    for(int i=0;i<n;i++) {
        cin>>a[i];
        insert(a[i]);
    }
    int ans=0;
    for(int i=0;i<n;i++){
         ans=max(ans,query(a[i]));  //对于每一个数我们都进行计算
    }
    cout<<ans;

    return 0;
}

```

