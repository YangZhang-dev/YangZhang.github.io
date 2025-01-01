import{_ as a,r,o as s,c,a as e,b as i,d as l,e as n}from"./app-20538318.js";const t={},o=n('<p>二分一般分为整数二分和实数二分，整数二分相对较为麻烦，要考虑边界问题</p><h2 id="整数二分" tabindex="-1"><a class="header-anchor" href="#整数二分" aria-hidden="true">#</a> 整数二分</h2><p>二分就是一个有限序列存在一个性质可以将这个序列分成左右两个序列，这样不断进行缩小目标范围，最终确定位置的一个过程。 一般使用的性质就是有序性，但是二分不一定有序，有序一般都二分</p><h3 id="步骤" tabindex="-1"><a class="header-anchor" href="#步骤" aria-hidden="true">#</a> 步骤</h3><ol><li>定义左右边界</li><li>在一个循环体中，定义mid为区间中点</li><li>如果说左边满足性质，则将右边界更新为mid，反之亦然</li><li>最后更新的l和r是一样的</li></ol><p>注意：<mark>二分时极易出现死循环的状态，并且有时会出现要二分区间的题目，所以下面提供两个模板(以有序序列为例)</mark></p><h3 id="模板" tabindex="-1"><a class="header-anchor" href="#模板" aria-hidden="true">#</a> 模板</h3>',7),v={href:"https://www.acwing.com/activity/content/problem/content/823/",target:"_blank",rel:"noopener noreferrer"},m=n(`<p>寻找左边界</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int l=0,r=n-1;
while(l&lt;r)
{
  int mid=l+r&gt;&gt;1;
  if(m[mid]&gt;=x) r=mid;
  else l=mid+1;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>寻找右边界</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int l=0,r=n-1;
while(l&lt;r)
{
  int mid=l+r+1&gt;&gt;1;
  if(m[mid]&lt;=x) l=mid;
  else r=mid-1;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实数二分" tabindex="-1"><a class="header-anchor" href="#实数二分" aria-hidden="true">#</a> 实数二分</h2>`,5),u={href:"https://www.acwing.com/activity/content/problem/content/824/",target:"_blank",rel:"noopener noreferrer"},h=n(`<h3 id="模板-1" tabindex="-1"><a class="header-anchor" href="#模板-1" aria-hidden="true">#</a> 模板</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>double n;
cin&gt;&gt;n;
double l=-100,r=100;
while(r-l&gt;1e-8)              //精度根据题意来定,要求六位就定到1e-8
{
  double mid=(l+r)/2;
  if(mid*mid*mid&gt;=n) r=mid;
  else l=mid;
}
printf(&quot;%.6f&quot;,l);
return 0;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function b(p,_){const d=r("ExternalLinkIcon");return s(),c("div",null,[o,e("p",null,[e("a",v,[i("题目和讲解"),l(d)])]),m,e("p",null,[i("实数二分相对简单，没有边界问题，这里以实数的三次方根为例 "),e("a",u,[i("题目和讲解"),l(d)])]),h])}const f=a(t,[["render",b],["__file","二分问题.html.vue"]]);export{f as default};
