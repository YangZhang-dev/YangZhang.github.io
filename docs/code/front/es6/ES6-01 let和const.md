---
title: ES6-01 let&const

order: 1
author: zzys
date: 2022-10-27
category:
- 笔记
tag:
- es6
- 前端
---

## 1. let

### 1.1 基础用法

`let`和`var`的用法类似，只不过`let`只在代码块内有效

```js
{
    let a=1;
    var b=1;
}
a // ReferenceError: a is not defined.
b // 1

```

例子：`for`循环

```js
var a=[];
for(var i=0;i<10;i++){
	a[i]=function(){
        console.log(i);
    }
}

a[6]();// 10


// 因为在每一次的for循环中i的指向都是全局相同的，每一次在后面改变，前面的i也会改变
```

```js
var a=[];
for(let i=0;i<10;i++){
	a[i]=function(){
        console.log(i);
    }
}

a[6]();// 6

// 每一次的i都是重新定义的,另外for循环的定义区域是循环体的父作用域
```

> 如果每一轮循环的变量`i`都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量`i`时，就在上一轮循环的基础上进行计算。



### 1.2 不存在变量提升

[Hoisting（变量提升） - 术语表 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)

> 从概念的字面意义上说，“变量提升”意味着变量和函数的声明会在物理层面移动到代码的最前面，但这么说并不准确。实际上变量和函数声明在代码里的位置是不会动的，而是在编译阶段被放入内存中。



```js
let tmp = 2;

function f() {
    console.log(tmp);	
    if(false){
       var tmp=1; 
    }
	console.log(tmp);
}

f(); // undefined undefined
console.log(tmp); // 2
```



```js
var tmp = 2;

function f() {
    console.log(tmp);	
	tmp=1;
	console.log(tmp);
}

f(); // 2 1
console.log(tmp); // 1
```



第一种方式：函数内部的变量声明会由于变量提升提至函数的最开始，所以在函数中实际上只进行了`tmp`的声明，而由于if的存在没有进行初始化，所以在函数中`tmp`为`undefined`

第二种方式：实际上是对全局变量的重新赋值

```js
let tmp = 2;

function f() {
    console.log(tmp);	
    if(false){
       let tmp=1; 
    }
	console.log(tmp);
}

f(); // 2 2
console.log(tmp); // 2
```

使用`let`不会出现变量提升

### 1.3 暂时性死区

>当程序的控制流程在新的作用域（module function 或 block作用域）进行实例化时，在此作用域中用let/const声明的变量会先在作用域中被创建出来，但因此时还未进行词法绑定，所以是不能被访问的，如果访问就会抛出错误。因此，在这运行流程进入作用域创建变量，到变量可以被访问之间的这一段时间，就称之为暂时死区。

```js
var i=1;
{
    console.log(i); // ReferenceError
    typeof i; // ReferenceError
    let i; 
}	
```

 一些比较隐蔽的死区

1. 

```js
function bar(x = y, y = 2) {
	return [x, y];
}

bar(); // 报错

// 声明x时y还没由被声明

function bar(x = 2, y = x) {
	return [x, y];
}
bar(); // [2, 2]
```
2. 
```js
// 不报错
var x = x;

// 报错
let x = x;
// ReferenceError: x is not defined
```

### 1.4 不允许重复声明

即不能在一个代码块中使用let重复定义一个变量



## 2. 块级作用域

### 2.1 ES6块级作用域

在作用域内的变量只存在于作用域内

```js
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); 
}

f1(); // 5
```

可以存在多重作用域嵌套，每一层都是单独的作用域，可以定义同名变量

```js
{{{{
  let insane = 'Hello World';
  {let insane = 'Hello World'}
}}}};
```

同时IIFE立即执行函数也可以被代替
```js
(function () {
    var a = "b";
})();
// 无法从外部访问变量 name
console.log(a); // 抛出错误："Uncaught ReferenceError: name is not defined"

{
    let a="b";
}
console.log(a);
```



### 2.2 块级作用域与函数声明

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于`let`，在块级作用域之外不可引用

```js
// 浏览器的 es6 环境
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```

上述代码中的函数类似于变量提升，函数的声明也会提至函数的最开始，所以就等同于以下代码

```js
// 浏览器的 es6 环境
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```

所以应避免在块级作用域中声明函数，使用也应使用函数表达式

```js
// 块级作用域内部的函数声明语句，建议不要使用
{
  let a = 'secret';
  function f() {
    return a;
  }
}

// 块级作用域内部，优先使用函数表达式
{
  let a = 'secret';
  let f = function () {
    return a;
  };
}
```

同时在if和while、for后必须加上大括号才存在块级作用域



## 3. const

### 3.1 基本用法

`const`声明一个只读的常量。一旦声明，常量的值就不能改变,所以必须在声明式初始化。

```js
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.
```

`const`同`let`存在死区、不存在变量提升、不允许重复声明、只存在于作用域中



### 3.2 本质

 `const`实际上保证的是变量指向的内存地址中的值不变，对于基础数据类型，它的值就保存在那个地址中，而对于复合类型（对象、数组），内存地址保存的只是一个指向实际数据的指针，所以`const`只能保证它的指向不发生改变，而其中的值无法限制

```js
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only

const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错
```

冻结对象

```js
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```

下面是一个可以将对象彻底冻结的函数

```js
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

## 4. 顶层对象的属性



> 顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，`window`对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。

>  在ES5中全局变量默认是浏览器顶层对象`window`的属性，ES6 为了改变这一点，一方面规定，为了保持兼容性，`var`命令和`function`命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，`let`命令、`const`命令、`class`命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

```js
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```



## 5. globalThis 对象

在js的不同的实现中，顶级对象是不同的 

- 浏览器里面，顶层对象是`window`，但 Node 和 Web Worker 没有`window`。
- 浏览器和 Web Worker 里面，`self`也指向顶层对象，但是 Node 没有`self`。
- Node 里面，顶层对象是`global`，但其他环境都不支持。

综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。

```js
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```
