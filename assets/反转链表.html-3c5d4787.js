import{_ as d,r as l,o as t,c as v,a as e,b as n,d as s,e as a}from"./app-20538318.js";const r={},c={href:"https://leetcode.cn/problems/reverse-linked-list/description/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://leetcode.cn/problems/reverse-linked-list-ii/description/",target:"_blank",rel:"noopener noreferrer"},m={href:"https://leetcode.cn/problems/reverse-nodes-in-k-group/description/",target:"_blank",rel:"noopener noreferrer"},b=a(`<p>从翻转一个单链表，到指定部分反转，再到K个一组的一组一组反转，渐进式的增加难度。</p><h2 id="反转链表" tabindex="-1"><a class="header-anchor" href="#反转链表" aria-hidden="true">#</a> 反转链表</h2><p>对于链表的反转，其实类似于数组的逆序，数组的逆序很简单，使用前后碰撞指针就可以了。</p><p>而链表由于其特殊性，需要对于指针进行操作，对于<code>a-&gt;b-&gt;c-&gt;d</code>这一链表，我们想要的结果就是<code>a&lt;-b&lt;-c&lt;-d</code>，针对到每个节点，我们只需让其的next指针指向上一个节点，那么我们在这里就需要使用前后快慢指针记录前后节点。</p><p>当实际操作时会发现，对于<code>a</code>节点，它是没有前一个节点的，同时反转后它的next应该是NULL，所以慢指针应该初始化为NULL，快指针初始化为head。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode():val(0),next(nullptr){}
    ListNode(int v): val(v),next(nullptr){}
    void print() {
        ListNode* p = this;
        while(p) {
            cout &lt;&lt; p-&gt;val &lt;&lt; &quot; &quot;;
            p = p-&gt;next;
        }
        cout &lt;&lt; endl;
    }
};

ListNode* reverse(ListNode* cur) {
    ListNode* last = nullptr;
    ListNode* fast = cur;
    while(fast) {
        ListNode* tmp = fast-&gt;next;
        fast-&gt;next = last;
        last = fast;
        fast = tmp;
    }
    return last;
}

int main() {
    ListNode* head = new ListNode();
    ListNode* p = head;
    int n;
    cin &gt;&gt; n;
    while(n --) {
        int v;
        cin &gt;&gt; v;
        p-&gt;next = new ListNode(v);
        p = p-&gt;next;
    }
    head = head-&gt;next;
    head-&gt;print();
    reverse(head)-&gt;print();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/d1257df9b2562c0f4675ade62934cabd.gif" alt="imageonline-co-gifimage" loading="lazy"></p><h2 id="反转链表ii" tabindex="-1"><a class="header-anchor" href="#反转链表ii" aria-hidden="true">#</a> 反转链表Ⅱ</h2><p>反转链表Ⅱ相较于反转链表，就是多了一个区域限制。</p><p>我们可以首先将指针移动到指定起始地点，但我们还不能直接reverse，因为这样会使得后面所有的节点都被反转，所以我们需要计算反转的个数，按个数反转</p><p>那么在其中就要涉及到三个指针</p><ul><li>pre，指向的是待反转区域的上一个节点</li><li>last：反转之前指向NULL，反转之后是反转区域的头节点</li><li>fast：反转之前是反转区域的头节点，反转之后是反转区域的下一个节点</li></ul><p>假设有一个链表为 <code>1-&gt;2-&gt;3-&gt;4-&gt;5 </code>，我们需要对234区域反转，那么刚反转后的中间状态如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>                  l f
      null&lt;-2&lt;-3&lt;-4 5-&gt;null
            ^
            |
            1
            p
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和上文描述的一致。</p><p>接着，我们需要将现在的三个链表连在一起。</p><p>我们先看第一段1和第二段234的连接。根据结果知道，1后面应该连接的是4，所以我们应该<code>pre-&gt;next = last</code>。</p><p>再看第二段234和第三段<code>5-&gt;null</code>的连接，应该将5连在2的后面，所以就是<code>pre-&gt;next-&gt;next = fast</code>。但是注意，这时的<code>pre-&gt;next</code>已经被上一个操作改变，所以我们需要将两次操作调换位置，先连接第二段和第三段。</p><p>结果就是<code>1-&gt;4-&gt;3-&gt;2-&gt;5</code>。</p><p>最后还有一种特殊情况需要处理，当我们的区域从第一个开始时，我们会没有pre，所以需要建立一个虚拟空结点。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;

using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(): val(0), next(nullptr){}
    ListNode(int v): val(v), next(nullptr){}
    void print() {
        ListNode* p = this;
        while(p) {
            cout &lt;&lt; p-&gt;val &lt;&lt; &quot; &quot;;
            p = p-&gt;next;
        }
        cout &lt;&lt; endl;
    }
};

int main() {
    int n;
    cin &gt;&gt; n;
    ListNode* head = new ListNode();
    ListNode* p = head;
    while(n --) {
        int v;
        cin &gt;&gt; v;
        p-&gt;next = new ListNode(v);
        p = p-&gt;next;
    }
    int left, right;
    cin &gt;&gt; left &gt;&gt; right;
    ListNode* pre = head;
    for(int i = 0; i &lt; left - 1; i ++) pre = pre-&gt;next;
    ListNode* fast = pre-&gt;next;
    ListNode* last = nullptr;
    for(int i = 0; i &lt; right - left + 1; i ++) {
        ListNode* tmp = fast-&gt;next;
        fast-&gt;next = last;
        last = fast;
        fast = tmp;
    }
    pre-&gt;next-&gt;next = fast;
    pre-&gt;next = last;
    head-&gt;next-&gt;print();
    return 0;
}
// 输入
// 5
// 1 2 3 4 5
// 2 4
// 输出
// 1 4 3 2 5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="k个一组反转链表" tabindex="-1"><a class="header-anchor" href="#k个一组反转链表" aria-hidden="true">#</a> K个一组反转链表</h2><p>这道题目相较于第二道更进一步，划分区域k，从头开始一组一组反转，最后不足的不需要反转。</p><p>这道题我们可以使用一个不同的方法，在第二题中，我们是按照个数来反转链表，我们在这到题中可以设置一个end指针，将其遍历到当前需要处理的区间尾部，断开当前区间和后面的链表的连接，这样我们就可以直接复用反转链表的代码了。</p><p>注意这里也需要虚拟头节点，在初始化时就已经定义好了。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;
struct ListNode {
    ListNode* next;
    int val;
    ListNode(int val = 0): val(val), next(nullptr){}
    void print() {
        ListNode* p = this;
        while(p) {
            cout &lt;&lt; p-&gt;val &lt;&lt; &quot; &quot;;
            p = p-&gt;next;
        }
        cout &lt;&lt; endl;
    }
};
ListNode* reverse(ListNode* head) {
    ListNode* fast = head;
    ListNode* last = nullptr;
    while(fast) {
        ListNode* tmp = fast-&gt;next;
        fast-&gt;next = last;
        last = fast;
        fast = tmp;
    }
    return last;
}
//   p s e n
// 1 2 3 4 5
void work(ListNode* head, int k) {
    ListNode* pre = head;
    ListNode* end = head;
    while (end-&gt;next) {
        for(int i = 0;i &lt; k &amp;&amp; end; i ++) end = end-&gt;next;
        if(end == nullptr) break;
        ListNode* start = pre-&gt;next;
        ListNode* nxt = end-&gt;next;
        end-&gt;next = nullptr;
        pre-&gt;next = reverse(start);
        start-&gt;next = nxt;
        pre = start;
        end = start;
    }
    head-&gt;next-&gt;print();
}

int main() {
    int n;
    cin &gt;&gt; n;
    ListNode* head = new ListNode();
    ListNode* p = head;
    while(n --) {
        int v;
        cin &gt;&gt; v;
        p-&gt;next = new ListNode(v);
        p = p-&gt;next;
    }
    int k;
    cin &gt;&gt; k;
    work(head,k);
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,26);function o(p,g){const i=l("ExternalLinkIcon");return t(),v("div",null,[e("p",null,[e("a",c,[n("反转链表"),s(i)]),n(" -> "),e("a",u,[n("反转链表 II"),s(i)]),n("->"),e("a",m,[n(" K 个一组翻转链表 "),s(i)])]),b])}const x=d(r,[["render",o],["__file","反转链表.html.vue"]]);export{x as default};
