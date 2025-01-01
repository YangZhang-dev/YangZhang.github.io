import{_ as l,r as d,o as a,c as r,a as i,b as n,d as s,e as t}from"./app-20538318.js";const v={},c={href:"https://leetcode.cn/problems/merge-two-sorted-lists/description/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://leetcode.cn/problems/merge-k-sorted-lists/description/",target:"_blank",rel:"noopener noreferrer"},m=t(`<h2 id="合并两个有序链表" tabindex="-1"><a class="header-anchor" href="#合并两个有序链表" aria-hidden="true">#</a> 合并两个有序链表</h2><p>将两个有序的链表合成为一个有序链表</p><h3 id="递归" tabindex="-1"><a class="header-anchor" href="#递归" aria-hidden="true">#</a> 递归</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    if(!list1) return list2;
    if(!list2) return list1;

    if(list1-&gt;val &lt; list2-&gt;val) {
        list1-&gt;next = mergeTwoLists(list1-&gt;next, list2);
        return list1;
    }else {
        list2-&gt;next = mergeTwoLists(list1, list2-&gt;next);
        return list2;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="迭代" tabindex="-1"><a class="header-anchor" href="#迭代" aria-hidden="true">#</a> 迭代</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    if(!list1) return list2;
    if(!list2) return list1;
    ListNode* head = new ListNode();
    ListNode* p = head;
    while(list1 &amp;&amp; list2) {
        if(list1-&gt;val &lt; list2-&gt;val) {
            p-&gt;next = list1;
            list1 = list1-&gt;next;
        }else {
            p-&gt;next = list2;
            list2 = list2-&gt;next;
        }
        p = p-&gt;next;
    }
    p-&gt;next = list1 ? list1 : list2;
    return head-&gt;next;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="合并-k-个升序链表" tabindex="-1"><a class="header-anchor" href="#合并-k-个升序链表" aria-hidden="true">#</a> 合并 K 个升序链表</h2><h3 id="堆排序" tabindex="-1"><a class="header-anchor" href="#堆排序" aria-hidden="true">#</a> 堆排序</h3><h4 id="思路" tabindex="-1"><a class="header-anchor" href="#思路" aria-hidden="true">#</a> 思路</h4><p>此题可以采用堆排序的做法，第一步只将所有的头节点入堆，第二步一边获取最小值一边将next入堆。</p><p>因为是给定的升序链表，我们就可以保证当前堆中的m个元素一定是所有n个元素中的最小的一批。</p><h4 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h4><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct Heap{
    vector&lt;ListNode*&gt; h;
    Heap(){
        h.push_back(new ListNode(INT_MIN));
    }
    bool isEmpty() {
        return h.size() &lt;= 1;
    }
    void offer(ListNode* x) {
        h.push_back(x);
        up(h.size() - 1);
    }
    ListNode* poll() {
        ListNode* res = h[1];
        h[1] = h.back();
        h.pop_back();
        down(1);
        return res;
    }
    void up(int x) {
        while(x / 2 &amp;&amp; h[x / 2]-&gt;val &gt; h[x]-&gt;val) {
            swap(h[x / 2], h[x]);
            x /= 2;
        }
    }
    void down(int x){
        int u = x;
        int l = x * 2;
        int r =  x * 2 + 1;
        int size = h.size() - 1;
        if(l &lt;= size &amp;&amp; h[l]-&gt;val &lt; h[u]-&gt;val) u = l;
        if(r &lt;= size &amp;&amp; h[r]-&gt;val &lt; h[u]-&gt;val) u = r;
        if(u != x) {
            swap(h[u], h[x]);
            down(u);
        }
    }
};
ListNode* mergeKLists(vector&lt;ListNode*&gt;&amp; lists) {
    Heap* heap = new Heap();
    for(auto head:lists) {
        if(head != nullptr) {
            heap-&gt;offer(head);   
        }
    }
    ListNode* head = new ListNode();
    ListNode* p = head;
    while(!heap-&gt;isEmpty()) {
        ListNode* x = heap-&gt;poll();
        p-&gt;next = x;
        p = p-&gt;next;
        if(x-&gt;next != nullptr) heap-&gt;offer(x-&gt;next);
    }
    return head-&gt;next;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="分治" tabindex="-1"><a class="header-anchor" href="#分治" aria-hidden="true">#</a> 分治</h3><h4 id="思路-1" tabindex="-1"><a class="header-anchor" href="#思路-1" aria-hidden="true">#</a> 思路</h4><p>可以将N个有序链表的合并转化为两个有序链表的合并。</p><h4 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h4><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>ListNode* mergeKLists(vector&lt;ListNode*&gt;&amp; lists) {
    if(lists.size() == 0) return nullptr;
    return merge(0, lists.size() - 1, lists);
}
ListNode* merge(int l, int r, vector&lt;ListNode*&gt;&amp; lists) {
    if(l &gt;= r) return lists[l];
    int mid = l + r &gt;&gt; 1;
    ListNode* leftLinkList = merge(l, mid, lists);
    ListNode* rightLinkList = merge(mid + 1, r, lists);
    return mergeTwoLists(leftLinkList, rightLinkList);
}
ListNode* mergeTwoLists(ListNode* p, ListNode* q) {
    if(p == nullptr) return q;
    if(q == nullptr) return p;
    ListNode* head = new ListNode();
    ListNode* cur = head;
    while(p &amp;&amp; q) {
        if(p-&gt;val &gt; q-&gt;val) {
            cur-&gt;next = q;
            q = q-&gt;next;
        }else {
            cur-&gt;next = p;
            p = p-&gt;next;
        }
        cur = cur-&gt;next;
    }
    cur-&gt;next = q ? q : p;
    return head-&gt;next;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18);function b(o,h){const e=d("ExternalLinkIcon");return a(),r("div",null,[i("p",null,[i("a",c,[n("合并两个有序链表"),s(e)])]),i("p",null,[i("a",u,[n("合并 K 个升序链表"),s(e)])]),m])}const g=l(v,[["render",b],["__file","合并链表.html.vue"]]);export{g as default};
