---
title: Angular基础入门

order: 2
author: zzys
create_date: 2022-09-15
category:
- 笔记
tag:
- angular
- 前端
---

## 1. 概览

**组件由以下部分构成：**
1. 一个HTML模板，声明渲染的内容`<component-name>.component.html`
2. TypeScript类 `<component-name>.component.ts`
3. css选择器 `<component-name>.component.css`
4. （可选）应用在模板上的css样式

**创建组件**
```bash
ng g c component-name
```
会在以组件名命名的文件夹中创建四个文件，分别是上面的前三个文件和一个测试文件

在component.ts文件中有一个装饰器：

```TypeScript
@Component({
  selector: 'app-component-overview',
  templateUrl: './component-overview.component.html',
  styleUrls: ['./component-overview.component.css']
})
```
1. 第一行是指定组件的CSS选择器（这个就是当你使用这个组件的时候要写的标签名称）
2. 定义外部模板文件位置
3. 定义模板样式文件位置

## 2. 模板

绑定会在模板和组件之间创建实时连接
绑定的例子：
- 文本插值
- 属性绑定
- 事件绑定
- 双向绑定

### 2.1 文本插值
```HTML
<h3>Current customer: {{ currentCustomer }}</h3>
```
使用双大括号进行插值


### 2.2 属性绑定

使用方括号进行属性绑定:
```HTNL
<img alt="item" [src]="itemImageUrl">
```
在大多数情况下，目标名称是 Property（属性）名称，即使它看起来是 Attribute（属性）名称,
[property和attribute的区别](https://www.cnblogs.com/lmjZone/p/8760232.html)

### 2.3 类和样式的绑定

```HTML

[class]="classExpression"

[style]="{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}"

```

一般使用ngClass和ngStyle，见指令一节

### 2.4 事件绑定

使用小括号绑定组件事件

```HTML

<button (click)="onSave()">Save</button>

```

为了确定事件目标，Angular 会检查目标事件的名称是否与已知指令的 event 属性匹配,不匹配则会去检查有无这个指令

### 2.5 双向绑定

子模版和子组件代码

```HTML

<div>
  <button type="button" (click)="dec()" title="smaller">-</button>
  <button type="button" (click)="inc()" title="bigger">+</button>
  <span [style.font-size.px]="size">FontSize: {{size}}px</span>
</div>

```

```TypeScript

export class SizerComponent {

  @Input()  size!: number | string;
  @Output() sizeChange = new EventEmitter<number>();

  dec() { this.resize(-1); }
  inc() { this.resize(+1); }

  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }
}

```

为了使双向数据绑定有效，@Output属性的名字必须遵循 inputChange 模式。这里面牵涉到子父组件通信，可见组件一章。

父模板代码

```HTML

<app-sizer [(size)]="fontSizePx"></app-sizer>
<div [style.font-size.px]="fontSizePx">Resizable Text</div>

```

最后在父组件中加入fontSizePx这个属性即可

Tips：表单的双向绑定见指令

### 2.6 管道

管道用于接受输入值并返回转换后的值,管道的优先级大于三目运算符，并且支持链式调用

[内置管道](https://angular.cn/api/common#管道)

使用管道：

```HTML

<p>The hero's birthday is {{ birthday | date }}</p>

```

如果要传入参数，在管道后面用冒号隔开

### 2.7 模板引用变量

在模板中，要使用井号 # 来声明一个模板变量。下列模板变量 #phone 声明了一个名为 phone 的变量，其值为此 < input > 元素。可以在组件模板中的任何地方引用某个模板变量

```HTML

<input #phone placeholder="phone number" />

```

## 3. 组件

### 3.1 组件周期

从实例化组件类并渲染组件视图及其子视图是开始到组件实例从DOM中移除成为生命周期

可以使用生命周期钩子来出发生命周期中的关键事件（初始化，变更，销毁...）

[响应生命周期事件](https://angular.cn/guide/lifecycle-hooks#responding-to-lifecycle-events)

1. ngOnChanges：当数据变更时调用，如果组件绑定过输入属性那么它会最先调用一次，如果没有输入属性则不会调用（会发生的非常频繁，要注意性能）
2. ngOnInit：在第一次ngOnChanges之后，初始化组件时调用，常用于从后端查询模板数据
3. ngOnDestroy： 当组件要从DOM上销毁时调用，取消订阅可观察的对象并脱离
事件处理程序,以避免内存泄漏,[具体含义](https://angular.cn/guide/lifecycle-hooks#cleaning-up-on-instance-destruction)

注意：==不会再构造函数中初始化复杂数据，一般是在ngOnInit中进行初始化，构造函数一般用于依赖的注入和简单数据的初始化==

[组件周期停止](https://angular.cn/guide/lifecycle-hooks#general-examples)

### 3.2 视图封装

### 3.3 组件交互

#### 3.3.1 父组件向子组件传值

子组件使用@Input修饰变量，在父组件中使用方括号绑定即可，可以传送各种值甚至是方法和父组件本身

同时可以使用setter监听输入

```TypeScript

 @Input()
  get name(): string { return this._name; }
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
  }
  private _name = '';

```

更多的是使用ngOnChanges钩子来监听

```TypeScript

 @Input() major = 0;
 @Input() minor = 0;
 changeLog: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
  }

```

SimpleChanges是一个记录了属性变化的哈希表

#### 3.3.2 父组件监听子组件的事件
子组件暴露一个 EventEmitter 属性，当事件发生时，子组件利用该属性 emits(向上弹射)事件。父组件绑定到这个事件属性，并在事件发生时作出回应，[具体实现](https://angular.cn/guide/component-interaction#parent-listens-for-child-event)

#### 3.3.3 父组件使用子组件

1. 在父模板中给子模版加上模板变量

2. 在父组件中加入@ViewChild('exportHeroes', { static: true }) exportHeroes: any

3. 即可使用this.exportHeroes指代子组件

#### 3.3.4 通过服务通信

[服务通信](Angular父组件和子组件通过服务来通讯_frank201113的博客-CSDN博客)

注意：关于服务的单例化实现见服务

### 3.4.投影

#### 3.4.1 单插槽

同vue只不过是< ng-content>< /ng-content>

#### 3.4.2 多插槽

通过select属性判断对应位置

#### 3.4.3 条件投影和更复杂的投影

[见官网](
https://angular.cn/guide/content-projection#conditional-content-projection)

### 3.5. 动态组件

### 3.6. angular元素

## 4. 指令

### 4.1 内置指令

1. NgClass，NgStyle控制样式

2. NgModel：实现表单的数据双向绑定

  - 首先需要导入
    ```TypeSciipt
    import { FormsModule } from '@angular/forms';
    ```

  - 然后再form元素加入
    ```HTML
    <input [(ngModel)]="currentItem.name" id="example-ngModel">
    ```

   如果要自自定义事件 
    ```
    <input [ngModel]="currentItem.name"     (ngModelChange)="setUppercaseName($event)" id="example-uppercase">  
    ```
3. ngIf
4.NgFor

添加trackBy使得当数据变化时，根据设置的trackBy项，只重新渲染变化的数据

```HTML
<div *ngFor="let item of items; trackBy: trackByItems">
  ({{item.id}}) {{item.name}}
</div>
```

```TypeScript

trackByItems(index: number, item: Item): number { return item.id; }

```

5. NgSwitch

### 4.2 属性型指令

1. 创建指令

```bash

ng generate directive highlight

```

当前的ts文件为

```TypeScript

import { Directive } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor() { }
}

```

@Directive是指令的装饰器，里面存放了元数据

2. 进行修改

```TypeScript

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
    constructor(private el: ElementRef) {
       this.el.nativeElement.style.backgroundColor = 'yellow';
    }
}

```

3. 使用

```HMTL

<p appHighlight>Highlight me!</p>

```

当想让指令处理用户事件，比如鼠标的悬浮时

ts文件改动如下：

```TypeScript

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}

```

当然指令也可以接受输入值
新增一个由@Input修饰的属性，将属性的使用使用方括号绑定即可，[还可以设置初始值](https://angular.cn/guide/attribute-directives#binding-to-a-second-property)
### 4.3 结构型指令

​[官网](https://angular.cn/guide/structural-directives)

Tips:属性型指令时改变元素的属性样式，而结构型指令是用来改变DOM元素布局，控制是否存在的

## 5. 服务

创建服务:
```bash
ng generate service heroes/hero
```

```TypeScript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor() { }
}
```
元数据 providedIn: 'root' 表示 HeroService 在整个应用程序中都是可见的。

​在组件中注入
```TypeScript
constructor(heroService: HeroService)
```