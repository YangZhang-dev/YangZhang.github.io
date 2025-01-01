import{_ as n,o as e,c as a,e as s}from"./app-20538318.js";const i={},c=s(`<h2 id="双文件简单编译" tabindex="-1"><a class="header-anchor" href="#双文件简单编译" aria-hidden="true">#</a> 双文件简单编译</h2><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">all</span><span class="token punctuation">:</span> f

<span class="token comment"># 链接</span>
<span class="token target symbol">f</span><span class="token punctuation">:</span> f1.o f2.o
	gcc f1.o f2.o -o f
<span class="token comment"># 对于f1.o gcc会自动编译</span>
<span class="token comment"># 而由于f2.o 我们需要指定头文件路径，故手动声明</span>
<span class="token target symbol">f2.o</span><span class="token punctuation">:</span>
	gcc -c f2.c -I./tt 
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
	rm -f f f1.o f2.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="复杂编译" tabindex="-1"><a class="header-anchor" href="#复杂编译" aria-hidden="true">#</a> 复杂编译</h2><p>.PHONY修饰的目标就是只有规则没有依赖，每次都执行。</p>`,4),l=[c];function t(o,d){return e(),a("div",null,l)}const m=n(i,[["render",t],["__file","Makefile.html.vue"]]);export{m as default};
