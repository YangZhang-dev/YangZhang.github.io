import{_ as l,r,o as d,c as t,a as e,b as i,d as a,e as s}from"./app-20538318.js";const c={},o=s(`<h2 id="_1-概览" tabindex="-1"><a class="header-anchor" href="#_1-概览" aria-hidden="true">#</a> 1. 概览</h2><p><strong>组件由以下部分构成：</strong></p><ol><li>一个HTML模板，声明渲染的内容<code>&lt;component-name&gt;.component.html</code></li><li>TypeScript类 <code>&lt;component-name&gt;.component.ts</code></li><li>css选择器 <code>&lt;component-name&gt;.component.css</code></li><li>（可选）应用在模板上的css样式</li></ol><p><strong>创建组件</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ng g c component-name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>会在以组件名命名的文件夹中创建四个文件，分别是上面的前三个文件和一个测试文件</p><p>在component.ts文件中有一个装饰器：</p><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>@Component({
  selector: &#39;app-component-overview&#39;,
  templateUrl: &#39;./component-overview.component.html&#39;,
  styleUrls: [&#39;./component-overview.component.css&#39;]
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>第一行是指定组件的CSS选择器（这个就是当你使用这个组件的时候要写的标签名称）</li><li>定义外部模板文件位置</li><li>定义模板样式文件位置</li></ol><h2 id="_2-模板" tabindex="-1"><a class="header-anchor" href="#_2-模板" aria-hidden="true">#</a> 2. 模板</h2><p>绑定会在模板和组件之间创建实时连接 绑定的例子：</p><ul><li>文本插值</li><li>属性绑定</li><li>事件绑定</li><li>双向绑定</li></ul><h3 id="_2-1-文本插值" tabindex="-1"><a class="header-anchor" href="#_2-1-文本插值" aria-hidden="true">#</a> 2.1 文本插值</h3><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>&lt;h3&gt;Current customer: {{ currentCustomer }}&lt;/h3&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用双大括号进行插值</p><h3 id="_2-2-属性绑定" tabindex="-1"><a class="header-anchor" href="#_2-2-属性绑定" aria-hidden="true">#</a> 2.2 属性绑定</h3><p>使用方括号进行属性绑定:</p><div class="language-HTNL line-numbers-mode" data-ext="HTNL"><pre class="language-HTNL"><code>&lt;img alt=&quot;item&quot; [src]=&quot;itemImageUrl&quot;&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,18),u={href:"https://www.cnblogs.com/lmjZone/p/8760232.html",target:"_blank",rel:"noopener noreferrer"},v=s(`<h3 id="_2-3-类和样式的绑定" tabindex="-1"><a class="header-anchor" href="#_2-3-类和样式的绑定" aria-hidden="true">#</a> 2.3 类和样式的绑定</h3><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>
[class]=&quot;classExpression&quot;

[style]=&quot;{width: &#39;100px&#39;, height: &#39;100px&#39;, backgroundColor: &#39;cornflowerblue&#39;}&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般使用ngClass和ngStyle，见指令一节</p><h3 id="_2-4-事件绑定" tabindex="-1"><a class="header-anchor" href="#_2-4-事件绑定" aria-hidden="true">#</a> 2.4 事件绑定</h3><p>使用小括号绑定组件事件</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>
&lt;button (click)=&quot;onSave()&quot;&gt;Save&lt;/button&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了确定事件目标，Angular 会检查目标事件的名称是否与已知指令的 event 属性匹配,不匹配则会去检查有无这个指令</p><h3 id="_2-5-双向绑定" tabindex="-1"><a class="header-anchor" href="#_2-5-双向绑定" aria-hidden="true">#</a> 2.5 双向绑定</h3><p>子模版和子组件代码</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>
&lt;div&gt;
  &lt;button type=&quot;button&quot; (click)=&quot;dec()&quot; title=&quot;smaller&quot;&gt;-&lt;/button&gt;
  &lt;button type=&quot;button&quot; (click)=&quot;inc()&quot; title=&quot;bigger&quot;&gt;+&lt;/button&gt;
  &lt;span [style.font-size.px]=&quot;size&quot;&gt;FontSize: {{size}}px&lt;/span&gt;
&lt;/div&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
export class SizerComponent {

  @Input()  size!: number | string;
  @Output() sizeChange = new EventEmitter&lt;number&gt;();

  dec() { this.resize(-1); }
  inc() { this.resize(+1); }

  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了使双向数据绑定有效，@Output属性的名字必须遵循 inputChange 模式。这里面牵涉到子父组件通信，可见组件一章。</p><p>父模板代码</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>
&lt;app-sizer [(size)]=&quot;fontSizePx&quot;&gt;&lt;/app-sizer&gt;
&lt;div [style.font-size.px]=&quot;fontSizePx&quot;&gt;Resizable Text&lt;/div&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后在父组件中加入fontSizePx这个属性即可</p><p>Tips：表单的双向绑定见指令</p><h3 id="_2-6-管道" tabindex="-1"><a class="header-anchor" href="#_2-6-管道" aria-hidden="true">#</a> 2.6 管道</h3><p>管道用于接受输入值并返回转换后的值,管道的优先级大于三目运算符，并且支持链式调用</p>`,18),p={href:"https://angular.cn/api/common#%E7%AE%A1%E9%81%93",target:"_blank",rel:"noopener noreferrer"},h=s(`<p>使用管道：</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>
&lt;p&gt;The hero&#39;s birthday is {{ birthday | date }}&lt;/p&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果要传入参数，在管道后面用冒号隔开</p><h3 id="_2-7-模板引用变量" tabindex="-1"><a class="header-anchor" href="#_2-7-模板引用变量" aria-hidden="true">#</a> 2.7 模板引用变量</h3><p>在模板中，要使用井号 # 来声明一个模板变量。下列模板变量 #phone 声明了一个名为 phone 的变量，其值为此 &lt; input &gt; 元素。可以在组件模板中的任何地方引用某个模板变量</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>
&lt;input #phone placeholder=&quot;phone number&quot; /&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-组件" tabindex="-1"><a class="header-anchor" href="#_3-组件" aria-hidden="true">#</a> 3. 组件</h2><h3 id="_3-1-组件周期" tabindex="-1"><a class="header-anchor" href="#_3-1-组件周期" aria-hidden="true">#</a> 3.1 组件周期</h3><p>从实例化组件类并渲染组件视图及其子视图是开始到组件实例从DOM中移除成为生命周期</p><p>可以使用生命周期钩子来出发生命周期中的关键事件（初始化，变更，销毁...）</p>`,10),m={href:"https://angular.cn/guide/lifecycle-hooks#responding-to-lifecycle-events",target:"_blank",rel:"noopener noreferrer"},g=e("li",null,"ngOnChanges：当数据变更时调用，如果组件绑定过输入属性那么它会最先调用一次，如果没有输入属性则不会调用（会发生的非常频繁，要注意性能）",-1),b=e("li",null,"ngOnInit：在第一次ngOnChanges之后，初始化组件时调用，常用于从后端查询模板数据",-1),_={href:"https://angular.cn/guide/lifecycle-hooks#cleaning-up-on-instance-destruction",target:"_blank",rel:"noopener noreferrer"},f=e("p",null,[i("注意："),e("mark",null,"不会再构造函数中初始化复杂数据，一般是在ngOnInit中进行初始化，构造函数一般用于依赖的注入和简单数据的初始化")],-1),x={href:"https://angular.cn/guide/lifecycle-hooks#general-examples",target:"_blank",rel:"noopener noreferrer"},T=s(`<h3 id="_3-2-视图封装" tabindex="-1"><a class="header-anchor" href="#_3-2-视图封装" aria-hidden="true">#</a> 3.2 视图封装</h3><h3 id="_3-3-组件交互" tabindex="-1"><a class="header-anchor" href="#_3-3-组件交互" aria-hidden="true">#</a> 3.3 组件交互</h3><h4 id="_3-3-1-父组件向子组件传值" tabindex="-1"><a class="header-anchor" href="#_3-3-1-父组件向子组件传值" aria-hidden="true">#</a> 3.3.1 父组件向子组件传值</h4><p>子组件使用@Input修饰变量，在父组件中使用方括号绑定即可，可以传送各种值甚至是方法和父组件本身</p><p>同时可以使用setter监听输入</p><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
 @Input()
  get name(): string { return this._name; }
  set name(name: string) {
    this._name = (name &amp;&amp; name.trim()) || &#39;&lt;no name set&gt;&#39;;
  }
  private _name = &#39;&#39;;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多的是使用ngOnChanges钩子来监听</p><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
 @Input() major = 0;
 @Input() minor = 0;
 changeLog: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(\`Initial value of \${propName} set to \${to}\`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        log.push(\`\${propName} changed from \${from} to \${to}\`);
      }
    }
    this.changeLog.push(log.join(&#39;, &#39;));
  }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>SimpleChanges是一个记录了属性变化的哈希表</p><h4 id="_3-3-2-父组件监听子组件的事件" tabindex="-1"><a class="header-anchor" href="#_3-3-2-父组件监听子组件的事件" aria-hidden="true">#</a> 3.3.2 父组件监听子组件的事件</h4>`,10),y={href:"https://angular.cn/guide/component-interaction#parent-listens-for-child-event",target:"_blank",rel:"noopener noreferrer"},S=s('<h4 id="_3-3-3-父组件使用子组件" tabindex="-1"><a class="header-anchor" href="#_3-3-3-父组件使用子组件" aria-hidden="true">#</a> 3.3.3 父组件使用子组件</h4><ol><li><p>在父模板中给子模版加上模板变量</p></li><li><p>在父组件中加入@ViewChild(&#39;exportHeroes&#39;, { static: true }) exportHeroes: any</p></li><li><p>即可使用this.exportHeroes指代子组件</p></li></ol><h4 id="_3-3-4-通过服务通信" tabindex="-1"><a class="header-anchor" href="#_3-3-4-通过服务通信" aria-hidden="true">#</a> 3.3.4 通过服务通信</h4><p><a href="Angular%E7%88%B6%E7%BB%84%E4%BB%B6%E5%92%8C%E5%AD%90%E7%BB%84%E4%BB%B6%E9%80%9A%E8%BF%87%E6%9C%8D%E5%8A%A1%E6%9D%A5%E9%80%9A%E8%AE%AF_frank201113%E7%9A%84%E5%8D%9A%E5%AE%A2-CSDN%E5%8D%9A%E5%AE%A2">服务通信</a></p><p>注意：关于服务的单例化实现见服务</p><h3 id="_3-4-投影" tabindex="-1"><a class="header-anchor" href="#_3-4-投影" aria-hidden="true">#</a> 3.4.投影</h3><h4 id="_3-4-1-单插槽" tabindex="-1"><a class="header-anchor" href="#_3-4-1-单插槽" aria-hidden="true">#</a> 3.4.1 单插槽</h4><p>同vue只不过是&lt; ng-content&gt;&lt; /ng-content&gt;</p><h4 id="_3-4-2-多插槽" tabindex="-1"><a class="header-anchor" href="#_3-4-2-多插槽" aria-hidden="true">#</a> 3.4.2 多插槽</h4><p>通过select属性判断对应位置</p><h4 id="_3-4-3-条件投影和更复杂的投影" tabindex="-1"><a class="header-anchor" href="#_3-4-3-条件投影和更复杂的投影" aria-hidden="true">#</a> 3.4.3 条件投影和更复杂的投影</h4>',11),H={href:"https://angular.cn/guide/content-projection#conditional-content-projection",target:"_blank",rel:"noopener noreferrer"},q=s(`<h3 id="_3-5-动态组件" tabindex="-1"><a class="header-anchor" href="#_3-5-动态组件" aria-hidden="true">#</a> 3.5. 动态组件</h3><h3 id="_3-6-angular元素" tabindex="-1"><a class="header-anchor" href="#_3-6-angular元素" aria-hidden="true">#</a> 3.6. angular元素</h3><h2 id="_4-指令" tabindex="-1"><a class="header-anchor" href="#_4-指令" aria-hidden="true">#</a> 4. 指令</h2><h3 id="_4-1-内置指令" tabindex="-1"><a class="header-anchor" href="#_4-1-内置指令" aria-hidden="true">#</a> 4.1 内置指令</h3><ol><li><p>NgClass，NgStyle控制样式</p></li><li><p>NgModel：实现表单的数据双向绑定</p></li></ol><p>- 首先需要导入     <code>TypeSciipt     import { FormsModule } from &#39;@angular/forms&#39;;     </code></p><p>- 然后再form元素加入     <code>HTML     &lt;input [(ngModel)]=&quot;currentItem.name&quot; id=&quot;example-ngModel&quot;&gt;     </code></p><p>如果要自自定义事件      <code>     &lt;input [ngModel]=&quot;currentItem.name&quot;     (ngModelChange)=&quot;setUppercaseName($event)&quot; id=&quot;example-uppercase&quot;&gt;       </code> 3. ngIf 4.NgFor</p><p>添加trackBy使得当数据变化时，根据设置的trackBy项，只重新渲染变化的数据</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>&lt;div *ngFor=&quot;let item of items; trackBy: trackByItems&quot;&gt;
  ({{item.id}}) {{item.name}}
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
trackByItems(index: number, item: Item): number { return item.id; }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>NgSwitch</li></ol><h3 id="_4-2-属性型指令" tabindex="-1"><a class="header-anchor" href="#_4-2-属性型指令" aria-hidden="true">#</a> 4.2 属性型指令</h3><ol><li>创建指令</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>
ng generate directive highlight

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当前的ts文件为</p><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
import { Directive } from &#39;@angular/core&#39;;

@Directive({
  selector: &#39;[appHighlight]&#39;
})
export class HighlightDirective {
  constructor() { }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@Directive是指令的装饰器，里面存放了元数据</p><ol start="2"><li>进行修改</li></ol><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
import { Directive, ElementRef } from &#39;@angular/core&#39;;

@Directive({
  selector: &#39;[appHighlight]&#39;
})
export class HighlightDirective {
    constructor(private el: ElementRef) {
       this.el.nativeElement.style.backgroundColor = &#39;yellow&#39;;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>使用</li></ol><div class="language-HMTL line-numbers-mode" data-ext="HMTL"><pre class="language-HMTL"><code>
&lt;p appHighlight&gt;Highlight me!&lt;/p&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当想让指令处理用户事件，比如鼠标的悬浮时</p><p>ts文件改动如下：</p><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>
import { Directive, ElementRef, HostListener } from &#39;@angular/core&#39;;

@Directive({
  selector: &#39;[appHighlight]&#39;
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @HostListener(&#39;mouseenter&#39;) onMouseEnter() {
    this.highlight(&#39;yellow&#39;);
  }

  @HostListener(&#39;mouseleave&#39;) onMouseLeave() {
    this.highlight(&#39;&#39;);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25),M={href:"https://angular.cn/guide/attribute-directives#binding-to-a-second-property",target:"_blank",rel:"noopener noreferrer"},E=e("h3",{id:"_4-3-结构型指令",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_4-3-结构型指令","aria-hidden":"true"},"#"),i(" 4.3 结构型指令")],-1),L={href:"https://angular.cn/guide/structural-directives",target:"_blank",rel:"noopener noreferrer"},k=s(`<p>Tips:属性型指令时改变元素的属性样式，而结构型指令是用来改变DOM元素布局，控制是否存在的</p><h2 id="_5-服务" tabindex="-1"><a class="header-anchor" href="#_5-服务" aria-hidden="true">#</a> 5. 服务</h2><p>创建服务:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ng generate <span class="token function">service</span> heroes/hero
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>import { Injectable } from &#39;@angular/core&#39;;

@Injectable({
  providedIn: &#39;root&#39;,
})
export class HeroService {
  constructor() { }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>元数据 providedIn: &#39;root&#39; 表示 HeroService 在整个应用程序中都是可见的。</p><p>​在组件中注入</p><div class="language-TypeScript line-numbers-mode" data-ext="TypeScript"><pre class="language-TypeScript"><code>constructor(heroService: HeroService)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,8);function C(z,A){const n=r("ExternalLinkIcon");return d(),t("div",null,[o,e("p",null,[i("在大多数情况下，目标名称是 Property（属性）名称，即使它看起来是 Attribute（属性）名称, "),e("a",u,[i("property和attribute的区别"),a(n)])]),v,e("p",null,[e("a",p,[i("内置管道"),a(n)])]),h,e("p",null,[e("a",m,[i("响应生命周期事件"),a(n)])]),e("ol",null,[g,b,e("li",null,[i("ngOnDestroy： 当组件要从DOM上销毁时调用，取消订阅可观察的对象并脱离 事件处理程序,以避免内存泄漏,"),e("a",_,[i("具体含义"),a(n)])])]),f,e("p",null,[e("a",x,[i("组件周期停止"),a(n)])]),T,e("p",null,[i("子组件暴露一个 EventEmitter 属性，当事件发生时，子组件利用该属性 emits(向上弹射)事件。父组件绑定到这个事件属性，并在事件发生时作出回应，"),e("a",y,[i("具体实现"),a(n)])]),S,e("p",null,[e("a",H,[i("见官网"),a(n)])]),q,e("p",null,[i("当然指令也可以接受输入值 新增一个由@Input修饰的属性，将属性的使用使用方括号绑定即可，"),e("a",M,[i("还可以设置初始值"),a(n)])]),E,e("p",null,[i("​"),e("a",L,[i("官网"),a(n)])]),k])}const B=l(c,[["render",C],["__file","Angular基础入门.html.vue"]]);export{B as default};
