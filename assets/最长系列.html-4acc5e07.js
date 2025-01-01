import{_ as s,r as a,o as l,c as r,a as i,b as n,d,e as c}from"./app-20538318.js";const t={},u=i("p",null,"首先子数组是连续的，子序列是不一定连续的。",-1),v=i("p",null,"一个序列代表是求一个序列的最长子数组或子序列，而两个序列指的是求两个序列的最长公共子数组或子序列。",-1),m=i("p",null,"同时，在这四种情况中，长度为1也是一个递增子序列。",-1),o=i("thead",null,[i("tr",null,[i("th"),i("th",null,"一个序列"),i("th",null,"两个序列")])],-1),b=i("td",null,"子数组",-1),h={href:"https://leetcode.cn/problems/longest-continuous-increasing-subsequence/description/",target:"_blank",rel:"noopener noreferrer"},p={href:"https://leetcode.cn/problems/maximum-length-of-repeated-subarray/description/",target:"_blank",rel:"noopener noreferrer"},g=i("td",null,"子序列",-1),f={href:"https://leetcode.cn/problems/longest-increasing-subsequence/description/",target:"_blank",rel:"noopener noreferrer"},x={href:"https://leetcode.cn/problems/longest-common-subsequence/description/",target:"_blank",rel:"noopener noreferrer"},j=c(`<p>在解题时，我们通常将一个序列问题的dp数组的<code>i j</code>定义为下标，而两个序列问题的dp数组的<code>i j</code>定义为长度。</p><h2 id="最长连续递增序列" tabindex="-1"><a class="header-anchor" href="#最长连续递增序列" aria-hidden="true">#</a> 最长连续递增序列</h2><h3 id="dp定义" tabindex="-1"><a class="header-anchor" href="#dp定义" aria-hidden="true">#</a> dp定义</h3><p><code>dp[i]</code>代表下标为i的前面的序列的最长递增序列。</p><h3 id="转移方程" tabindex="-1"><a class="header-anchor" href="#转移方程" aria-hidden="true">#</a> 转移方程</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>if(nums[i] &gt; nums[i - 1]) dp[i] = max(dp[i], dp[i - 1]);
else dp[i] = 1;	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果前后相等，那么最长递增子序列长度加一，如果不相等，那么最长递增子序列的长度就要变为一。</p><p>注意第二步实际可以省略，可以在初始化时全部初始化为1。</p><h3 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i = 0; i &lt; nums.size(); i ++) {
    dp[i] = 1;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每一个元素单独都是一个连续递增序列。</p><h3 id="遍历" tabindex="-1"><a class="header-anchor" href="#遍历" aria-hidden="true">#</a> 遍历</h3><p>很明显，计算i时需要i-1的数据，所以需要正序遍历。同时起点是1，因为需要和i-1比较。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i = 1;i &lt; nums.size(); i ++) {
    if(nums[i] &gt; nums[i - 1]) dp[i] = max(dp[i], dp[i - 1] + 1);
    reuslt = max(reuslt, dp[i]);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意最长连续递增序列不一定以最后一个元素结尾，所以我们需要定义result，来确定dp中的最大值。</p><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int dp[10010];
int findLengthOfLCIS(vector&lt;int&gt;&amp; nums) {
    for(int i = 0; i &lt; nums.size(); i ++) {
        dp[i] = 1;
    }
    int reuslt = 1;
    for(int i = 1;i &lt; nums.size(); i ++) {
        if(nums[i] &gt; nums[i - 1]) dp[i] = max(dp[i], dp[i - 1] + 1);
        else dp[i] = 1;
        reuslt = max(reuslt, dp[i]);
    }
    return reuslt;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="其它解法" tabindex="-1"><a class="header-anchor" href="#其它解法" aria-hidden="true">#</a> 其它解法</h3><p>本题可以不用dp，直接记录起点终点也可以。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int findLengthOfLCIS(vector&lt;int&gt;&amp; nums) {
    int start = 0;
    int end = 0;
    int result = 1;
    for(int i = 1; i &lt; nums.size(); i ++) {
        if(nums[i] &gt; nums[i - 1]) {
            end ++;
        }else{
            start = i;
            end = i;
        }
        result = max(result, end - start + 1);
    }
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最长递增子序列" tabindex="-1"><a class="header-anchor" href="#最长递增子序列" aria-hidden="true">#</a> 最长递增子序列</h2><h3 id="dp定义-1" tabindex="-1"><a class="header-anchor" href="#dp定义-1" aria-hidden="true">#</a> dp定义</h3><p><code>dp[i]</code>代表前i个字符组成的序列的最长递增子序列。</p><h3 id="转移方程-1" tabindex="-1"><a class="header-anchor" href="#转移方程-1" aria-hidden="true">#</a> 转移方程</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>if(nums[i] &gt; nums[j]) dp[i] = max(dp[i], dp[j] + 1)
else {}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的<code>j</code>实际上就是<code>(i - 1) (i -2) ... (i - i) </code>的集合，因为不一定要连续，所以不是只由前一个的状态推导而来。</p><h3 id="初始化-1" tabindex="-1"><a class="header-anchor" href="#初始化-1" aria-hidden="true">#</a> 初始化</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i = 0; i &lt; nums.size(); i ++) {
    dp[i] = 1;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每一个元素单独都是一个连续递增序列。</p><h3 id="遍历-1" tabindex="-1"><a class="header-anchor" href="#遍历-1" aria-hidden="true">#</a> 遍历</h3><p>在这里就需要两重循环，内部循环是用来遍历一个状态的所有前导状态。</p><p>在计算状态时需要前面的状态，所以正序遍历。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i = 1; i &lt; nums.size(); i ++) {
    for(int j = 0; j &lt; i; j ++) {
        if(nums[i] &gt; nums[j]) dp[i] = max(dp[i], dp[j] + 1);
    }
    result = max(result, dp[i]);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int dp[2510];
int lengthOfLIS(vector&lt;int&gt;&amp; nums) {
    for(int i = 0; i &lt; nums.size(); i ++) dp[i] = 1;
    int result = 1;
    for(int i = 1; i &lt; nums.size(); i ++) {
        for(int j = 0; j &lt; i; j ++) {
            if(nums[i] &gt; nums[j]) dp[i] = max(dp[i], dp[j] + 1);
        }
        result = max(result, dp[i]);
    }
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="其他解法" tabindex="-1"><a class="header-anchor" href="#其他解法" aria-hidden="true">#</a> 其他解法</h3><p>维护一个tail子数组，保证tail数组的单调性，在维护tail数组的过程中，tail数组能够到达的最大长度就是该序列的最长子序列。注意，tail数组中的元素并非满足子序列的定义。</p><p>我们在遍历nums过程中，维护tail数组，规则如下：</p><ul><li>对nums[i]在tail中二分，获取到位置x</li><li>使用nums[i]覆盖tail[x]</li><li>如果x的大小等于当前维护的长度，那么就将长度加一（因为最大下标 == 长度-1）</li></ul><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>// 获取第一个比target大的数
// 如果元素不存在，那么我们就获取到的是比它大的元素的下标
// 	这样最大可能的保证了tail能取到更大的长度的可能
int bs_left(vector&lt;int&gt;&amp; nums, int target, int start, int end) {
    int i = start,j = end;
    while(i &lt; j) {
        int mid = i + j &gt;&gt; 1;
        if(nums[mid] &gt;= target) j = mid;
        else i = mid + 1;
    }
    return i;
}  
int lengthOfLIS(vector&lt;int&gt;&amp; nums) {
    vector&lt;int&gt; tail(nums.size());
    int len = 0;
    for(int i = 0; i &lt; nums.size(); i ++) {
        int x = bs_left(tail, nums[i], 0, len);
        // 可以重复就计算右边界
        // int x = bs_right(tail, nums[i], 0, len);
        tail[x] = nums[i];
        if(len == x) len ++;
    }
    return len;
}   
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最长重复子数组" tabindex="-1"><a class="header-anchor" href="#最长重复子数组" aria-hidden="true">#</a> 最长重复子数组</h2><p>本题是给定两个序列，求两个序列的最长公共子数组，子数组必须是连续的。</p><h3 id="dp定义-2" tabindex="-1"><a class="header-anchor" href="#dp定义-2" aria-hidden="true">#</a> dp定义</h3><p><code>dp[i][j]</code>代表<code>nums1[:i]</code>和<code>nums2[:j]</code>的最长重复子数组，<code>i j</code>代表长度。</p><h3 id="转移方程-2" tabindex="-1"><a class="header-anchor" href="#转移方程-2" aria-hidden="true">#</a> 转移方程</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>if(nums1[i - 1] == nums2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
else dp[i][j] = 0;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>同样第二步可以忽略。</p><h3 id="初始化-2" tabindex="-1"><a class="header-anchor" href="#初始化-2" aria-hidden="true">#</a> 初始化</h3><p>当两个序列，任意一个序列的长度为0时，它们的最长重复子数组长度一定是零，我们将dp定义为全局变量，省去初始化。</p><h3 id="遍历-2" tabindex="-1"><a class="header-anchor" href="#遍历-2" aria-hidden="true">#</a> 遍历</h3><p>两个循环都要从1开始。</p><p>同时result需要每次都去更新。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i = 1; i &lt;= nums1.size(); i ++) {
    for(int j = 1; j &lt;= nums2.size(); j ++) {
        if(nums1[i - 1] == nums2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = 0;
        result = max(result, dp[i - 1][j - 1] + (nums1[i - 1] == nums2[j - 1]));
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码-2" tabindex="-1"><a class="header-anchor" href="#代码-2" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int dp[1010][1010];

int findLength(vector&lt;int&gt;&amp; nums1, vector&lt;int&gt;&amp; nums2) {
    int result = 0;
    for(int i = 1; i &lt;= nums1.size(); i ++) {
        for(int j = 1; j &lt;= nums2.size(); j ++) {
            if(nums1[i - 1] == nums2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            result = max(result, dp[i][j]);
        }
    }
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优化" tabindex="-1"><a class="header-anchor" href="#优化" aria-hidden="true">#</a> 优化</h3><p>可以优化为一维，首先要注意遍历顺序要倒序，其次当条件不满足时，必须手动将dp[j]清零，不然会有脏数据。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int dp[1010];
int findLength(vector&lt;int&gt;&amp; nums1, vector&lt;int&gt;&amp; nums2) {
    int result = 0;
    for(int i = 1; i &lt;= nums1.size(); i ++) {

        for(int j = nums2.size(); j &gt;= 1; j --) {
            if(nums1[i - 1] == nums2[j - 1]) dp[j] =  dp[j - 1] + 1;
            else dp[j] = 0;
            result = max(result, dp[j]);
        }
    }
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最长公共子序列" tabindex="-1"><a class="header-anchor" href="#最长公共子序列" aria-hidden="true">#</a> 最长公共子序列</h2><p>相较于上一题，子序列不一定是连续的。</p><h3 id="dp定义-3" tabindex="-1"><a class="header-anchor" href="#dp定义-3" aria-hidden="true">#</a> dp定义</h3><p><code>dp[i][j]</code>代表<code>nums1[:i]</code>和<code>nums2[:j]</code>的最长重复子序列，<code>i j</code>代表长度。</p><h3 id="转移方程-3" tabindex="-1"><a class="header-anchor" href="#转移方程-3" aria-hidden="true">#</a> 转移方程</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>if(nums1[i - 1] == nums[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第一步和上一题相同，关键是第二步。</p><p>由于子序列的缘故，当<code>i - 1 != j - 1</code>时，我们不能单纯的认为当前的<code>dp[i][j]</code>就为0，因为<code>dp[i - 1][j - 1]</code>只是它的其中一个前导状态，它还有<code>dp[i][j -1]</code>和<code>dp[i -1][j]</code>这两个前导状态。</p><h3 id="初始化-3" tabindex="-1"><a class="header-anchor" href="#初始化-3" aria-hidden="true">#</a> 初始化</h3><p>当两个序列，任意一个序列的长度为0时，它们的最长重复子数组长度一定是零，我们将dp定义为全局变量，省去初始化。</p><h3 id="遍历-3" tabindex="-1"><a class="header-anchor" href="#遍历-3" aria-hidden="true">#</a> 遍历</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>for(int i = 1; i &lt;= text1.size(); i ++) {
    for(int j = 1; j &lt;= text2.size(); j ++) {
        if(text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="代码-3" tabindex="-1"><a class="header-anchor" href="#代码-3" aria-hidden="true">#</a> 代码</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int dp[1010][1010];
int longestCommonSubsequence(string text1, string text2) {
    for(int i = 1; i &lt;= text1.size(); i ++) {
        for(int j = 1; j &lt;= text2.size(); j ++) {
            if(text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[text1.size()][text2.size()];
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,72);function _(z,L){const e=a("ExternalLinkIcon");return l(),r("div",null,[u,v,m,i("table",null,[o,i("tbody",null,[i("tr",null,[b,i("td",null,[i("a",h,[n("最长连续递增序列"),d(e)])]),i("td",null,[i("a",p,[n("最长重复子数组"),d(e)])])]),i("tr",null,[g,i("td",null,[i("a",f,[n("最长递增子序列"),d(e)])]),i("td",null,[i("a",x,[n("最长公共子序列"),d(e)])])])])]),j])}const I=s(t,[["render",_],["__file","最长系列.html.vue"]]);export{I as default};
