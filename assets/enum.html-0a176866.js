import{_ as a,r as e,o as t,c as p,a as n,b as c,d as l,e as o}from"./app-20538318.js";const i={},u=n("p",null,"刚学习Java时，一直不知道Enum的底层是什么原理，今天就一探究竟。",-1),d={href:"https://www.yuque.com/bravo1988/java/pkloou",target:"_blank",rel:"noopener noreferrer"},k=o(`<h2 id="自定义枚举" tabindex="-1"><a class="header-anchor" href="#自定义枚举" aria-hidden="true">#</a> 自定义枚举</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Getter</span>
<span class="token keyword">class</span> <span class="token class-name">MyEnum</span> <span class="token punctuation">{</span>
    <span class="token comment">// static 代表是类变量，final防止外界更改引用。</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">MyEnum</span> <span class="token constant">ONE</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">MyEnum</span> <span class="token constant">TOW</span> <span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">MyEnum</span> <span class="token constant">THREE</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">MyEnum</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token constant">VALUES</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token constant">ONE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyEnum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token string">&quot;one&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token constant">TOW</span> <span class="token operator">=</span>  <span class="token keyword">new</span> <span class="token class-name">MyEnum</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token string">&quot;tow&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token constant">THREE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyEnum</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token string">&quot;three&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token constant">VALUES</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyEnum</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token constant">ONE</span><span class="token punctuation">,</span><span class="token constant">THREE</span><span class="token punctuation">,</span><span class="token constant">THREE</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// private 防止外界更改类变量的内部值。</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Integer</span> code<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> desc<span class="token punctuation">;</span>
    
    <span class="token comment">// 只有私有构造，无法创建对象，单例模式</span>
    <span class="token keyword">private</span> <span class="token class-name">MyEnum</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> code<span class="token punctuation">,</span><span class="token class-name">String</span> desc<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>code <span class="token operator">=</span> code<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>desc <span class="token operator">=</span> desc<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 根据code获取desc</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">MyEnum</span> <span class="token function">of</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> code<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">MyEnum</span> value <span class="token operator">:</span> <span class="token constant">VALUES</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>value<span class="token punctuation">.</span><span class="token function">getCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> value<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token string">&quot;Invalid Enum code:&quot;</span> <span class="token operator">+</span> code<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 根据desc获取code</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getDescByCode</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> code<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">MyEnum</span> value <span class="token operator">:</span> <span class="token constant">VALUES</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>value<span class="token punctuation">.</span><span class="token function">getCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> value<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token string">&quot;Invalid Enum code:&quot;</span> <span class="token operator">+</span> code<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">print</span><span class="token punctuation">(</span><span class="token class-name">MyEnum</span><span class="token punctuation">.</span><span class="token constant">TOW</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 以下三行无法通过编译</span>
        <span class="token class-name">MyEnum</span><span class="token punctuation">.</span><span class="token constant">THREE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyEnum</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 类变量时final，无法更改引用</span>
        <span class="token class-name">MyEnum</span><span class="token punctuation">.</span><span class="token constant">ONE</span><span class="token punctuation">.</span>code <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>  <span class="token comment">// 实例属性code为private，无法更改值</span>
        <span class="token function">print</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MyEnum</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 构造函数为private，无法创建新的对象</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">print</span><span class="token punctuation">(</span><span class="token class-name">MyEnum</span> myEnum<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过上面的代码，就已经实现了一个简易版的Enum，其中不难发现，对于MyEnum类，内部限定了一些固定的对象，也就是在调用print方法时，我们只能够传入内部给好的类，这和JDK的Enum已经十分相似了。</p><h2 id="enum底层" tabindex="-1"><a class="header-anchor" href="#enum底层" aria-hidden="true">#</a> Enum底层</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token keyword">enum</span> <span class="token class-name">RealEnum</span> <span class="token punctuation">{</span>
    <span class="token function">ONE</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token string">&quot;one&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token function">TOW</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token string">&quot;tow&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> code<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> desc<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来看看短短几行的Enum类在底层是什么样子的：</p><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Test.java

package com.zzys.enums;


final class RealEnum extends Enum
{

    public static RealEnum[] values()
    {
        return (RealEnum[])$VALUES.clone();
    }

    public static RealEnum valueOf(String name)
    {
        return (RealEnum)Enum.valueOf(com/zzys/enums/RealEnum, name);
    }

    private RealEnum(String s, int i, Integer code, String desc)
    {
    	// 多了两个字段，传给了Enum类
        super(s, i);
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode()
    {
        return code;
    }

    public String getDesc()
    {
        return desc;
    }

    public static final RealEnum ONE;
    public static final RealEnum TOW;
    private Integer code;
    private String desc;
    private static final RealEnum $VALUES[];

    static 
    {
    	// 比我们多了两个字段
        ONE = new RealEnum(&quot;ONE&quot;, 0, Integer.valueOf(1), &quot;one&quot;);
        TOW = new RealEnum(&quot;TOW&quot;, 1, Integer.valueOf(2), &quot;tow&quot;);
        $VALUES = (new RealEnum[] {
            ONE, TOW
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以发现，基本和我们的简易Enum一模一样，除了它多出来了两个成员变量，很明显，第一个是我们的枚举名字，第二个是枚举序号。那么为什么要传这两个参数呢？</p><p>我们知道，下面的写法也是正确的：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token keyword">enum</span> <span class="token class-name">RealEnum</span> <span class="token punctuation">{</span>
    <span class="token constant">ONE</span><span class="token punctuation">,</span>
    <span class="token constant">TOW</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们知道创建枚举的原因就是为了创建一个特征性的类，并且能够保存多维度的信息。如果没有多出来的两个参数，在上面的情况中，我们存取是正常的，但是没有了特征描述，失去了枚举的意义。</p>`,11);function r(v,m){const s=e("ExternalLinkIcon");return t(),p("div",null,[u,n("p",null,[n("a",d,[c("设计山寨枚举"),l(s)])]),k])}const y=a(i,[["render",r],["__file","enum.html.vue"]]);export{y as default};
