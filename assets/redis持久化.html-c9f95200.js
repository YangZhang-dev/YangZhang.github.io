import{_ as r,r as d,o as c,c as o,a as e,b as n,d as i,w as t,e as a}from"./app-20538318.js";const u={},h=e("p",null,"Redis有两种持久化方式：",-1),v=e("ul",null,[e("li",null,[e("p",null,"RDB：全量备份，相当于是为Redis做了数据快照")]),e("li",null,[e("p",null,"AOF：追加备份")])],-1),p=e("img",{src:"https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/a11230b3ad7368fb878d4aa7fba6c683.png",alt:"image-20210725151940515",style:{zoom:"67%"}},null,-1),b=e("h2",{id:"rdb",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#rdb","aria-hidden":"true"},"#"),n(" RDB")],-1),m=e("p",null,"RDB全称Redis Database Backup file（Redis数据备份文件），也被叫做Redis数据快照。简单来说就是把内存中的所有数据都记录到磁盘中。当Redis实例故障重启后，从磁盘读取快照文件，恢复数据。快照文件称为RDB文件，默认是保存在当前运行目录。",-1),f={href:"https://zhuanlan.zhihu.com/p/443951927",target:"_blank",rel:"noopener noreferrer"},_=a('<h3 id="执行时机" tabindex="-1"><a class="header-anchor" href="#执行时机" aria-hidden="true">#</a> 执行时机</h3><ul><li><p>执行save命令，<strong>阻塞</strong></p></li><li><p>执行bgsave命令，<strong>非阻塞</strong></p></li><li><p>Redis停机时</p></li><li><p>触发RDB条件时</p><p><code>save 900 2</code>：当900秒内有两个key被改变，则执行RDB备份。</p></li></ul><h3 id="bgsave原理" tabindex="-1"><a class="header-anchor" href="#bgsave原理" aria-hidden="true">#</a> bgsave原理</h3>',3),g=a(`<p>父子进程共享一块只读数据，当主进程接收到修改命令后，拷贝出一个数据副本（实际是以页表为单位）对其进行修改。</p><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/49cc88c188890cbc83cfe5d8cfa1ca74.png" alt="image-20210725151319695" loading="lazy"></p><h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点" aria-hidden="true">#</a> 缺点</h3><ul><li>RDB执行间隔时间长，两次RDB之间写入数据有丢失的风险</li><li>fork子进程、压缩、写出RDB文件都比较耗时</li></ul><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code># 是否压缩 ,建议不开启，压缩也会消耗cpu，磁盘的话不值钱
rdbcompression yes

# RDB文件名称
dbfilename dump.rdb  

# 文件保存的路径目录
dir ./ 

# 执行策略
save 900 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="aof" tabindex="-1"><a class="header-anchor" href="#aof" aria-hidden="true">#</a> AOF</h2><p>AOF全称为Append Only File（追加文件）。Redis处理的每一个写命令都会记录在AOF文件，可以看做是命令日志文件。</p>`,8),R={href:"https://zhuanlan.zhihu.com/p/407031491",target:"_blank",rel:"noopener noreferrer"},y=a(`<h3 id="文件重写" tabindex="-1"><a class="header-anchor" href="#文件重写" aria-hidden="true">#</a> 文件重写</h3><p>对于重复的key修改，大部分情况下可以压缩为一条命令，Redis会根据不同的策略来进行文件重写。由于是模拟快照的过程，因此在重写AOF文件时并没有读取旧的AOF文件，而是将整个内存中的数据库内容用命令的方式重写了一个新的AOF文件。</p><h3 id="配置-1" tabindex="-1"><a class="header-anchor" href="#配置-1" aria-hidden="true">#</a> 配置</h3><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code># 是否开启AOF功能，默认是no
appendonly yes
# AOF文件的名称
appendfilename &quot;appendonly.aof&quot;

# 执行AOF的三种策略

# 表示每执行一次写命令，立即记录到AOF文件
appendfsync always 
# 写命令执行完先放入AOF缓冲区，然后表示每隔1秒将缓冲区数据写到AOF文件，是默认方案
appendfsync everysec 
# 写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘
appendfsync no

# AOF文件比上次文件 增长超过多少百分比则触发重写
auto-aof-rewrite-percentage 100
# AOF文件体积最小多大以上才触发重写 
auto-aof-rewrite-min-size 64mb 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/8992d07f1a35e0d9bc86939be07ca67a.png" alt="image-20210725151654046" loading="lazy"></p><h3 id="缺点-1" tabindex="-1"><a class="header-anchor" href="#缺点-1" aria-hidden="true">#</a> 缺点</h3><p>如果开启每次命令刷盘，那么会大大的降低效率。体积较大，恢复效率较慢。</p>`,7);function O(A,x){const s=d("ExternalLinkIcon"),l=d("RouterLink");return c(),o("div",null,[h,v,p,b,m,e("p",null,[e("a",f,[n("Redis持久化策略—RDB"),i(s)])]),_,e("p",null,[n("利用了操作系统的fork函数，启用子进程对数据进行备份，其中牵涉到了COW技术： "),i(l,{to:"/code/back/redis/....%5Csundry%5CCOW-%E5%86%99%E6%97%B6%E5%A4%8D%E5%88%B6.html"},{default:t(()=>[n("COW-写时复制")]),_:1})]),g,e("p",null,[e("a",R,[n("从底层彻底吃透AOF技术原理"),i(s)])]),y])}const B=r(u,[["render",O],["__file","redis持久化.html.vue"]]);export{B as default};
