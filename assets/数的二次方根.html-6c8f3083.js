import{_ as d,r as l,o as s,c as r,a as e,b as i,d as a,e as c}from"./app-20538318.js";const t={},o={href:"https://leetcode.cn/problems/sqrtx/description/",target:"_blank",rel:"noopener noreferrer"},v=c(`<h2 id="二分" tabindex="-1"><a class="header-anchor" href="#二分" aria-hidden="true">#</a> 二分</h2><p>第一种做法就是简单的小数二分，按照记忆中的模板测试一下：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int mySqrt(int x) {
    double l = 1, r = x / 2;
    while(r - l &gt; 1e-8) {
        double mid = l + (r - l) / 2;
        if(mid &lt; x / mid) l = mid;
        else r = mid;
    }
    printf(&quot;%.6lf&quot;, l);
    return l;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现竟然错了一个4，奇怪的是打印的是<code>2.000000</code>，返回的却是<code>1</code>。</p><p>这里卡了我很久，后面将<code>.6f</code>改为<code>.8f</code>后发现打印的是<code>1.99999999</code>，即原来的打印是经过四舍五入的，让我以为是2.0，但实际上把小数去掉后确实应该是1。于是我在最后返回时加入了循环的精度。并且要对0特判一下就过了。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int mySqrt(int x) {
    if(x == 0) return 0;
    double l = 1, r = x / 2;
    while(r - l &gt; 1e-8) {
        double mid = l + (r - l) / 2;
        if(mid &lt; x / mid) l = mid;
        else r = mid;
    }
    printf(&quot;%.16lf&quot;, l + 1e-8);
    return l + 1e-8;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="牛顿迭代法" tabindex="-1"><a class="header-anchor" href="#牛顿迭代法" aria-hidden="true">#</a> 牛顿迭代法</h2><p>利用导数，不断的逼近正确答案，具体的见图：</p><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/31f08807e5283adc5fc604ea32e7d7c6.png" alt="IMG_0041(20240109-094920)" loading="lazy"></p><p><code>x&#39;</code>就是我们每一次逼近的结果。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int mySqrt(int x) {
    double old = x + 1.0;
    double better;
    while(1) {
        better = (old + x / old) / 2;
        if(abs(better - old) &lt; 0.1) break;
        old = better;    
    }
    return better;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>old起始一定要加<code>1.0</code>，对于x = 1来说<code>better = (old + x / old) / 2;</code>只会给better赋值为1。而对于 <code>x == 2</code>来说，会发生除零错误。</p>`,12);function u(m,b){const n=l("ExternalLinkIcon");return s(),r("div",null,[e("p",null,[i("这道题是一道简单题，但是在写的过程中发现了一些知识的盲点以及新颖的做法，所以记录一下："),e("a",o,[i("x 的平方根"),a(n)])]),v])}const x=d(t,[["render",u],["__file","数的二次方根.html.vue"]]);export{x as default};
