---
title: ES6-05 Symbol

order: 5
author: zzys
date: 2022-11-11
category:
- 笔记
tag:
- es6
- 前端
---

## 1. 概述

`Symbol`是在`ES6`后推出的全新的基础数据类型，凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会发生产生冲突。

```js
let s = Symbol();

typeof s
// "symbol"
```

```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```

`Symbol`可以显示的转化位字符串，不能和其他的基础类型运算

```js
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

## 2. Symbol.prototype.description

使用`description`可以返回描述

```js
const sym = Symbol('foo');

sym.description // "foo"
```

## 3. 作为属性名的 Symbol

> 由于每一个 Symbol 值都是不相等的，这意味着只要 Symbol 值作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

```js
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

注意，在定义`Symbol`为对象的属性时，不可使用点运算符，因为点运算符后面总是字符串，所以不会读取`mySymbol`作为标识名所指代的那个值，导致`a`的属性名实际上是一个字符串，而不是一个 Symbol 值。

```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```

同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。

```js
let s = Symbol();

let obj = {
  [s]: function (arg) { ... }
};

obj[s](123);
```

## 4. 属性名的遍历

有一个`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]
```

## 5. Symbol.for()，Symbol.keyFor()

`Symbol.for()`接受一个字符串参数，在全局搜索以该字符串为名的`Symbol`值，如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。

```js
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```

`Symbol.keyFor()`方法返回一个已登记的 Symbol 类型值的`key`。

```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

## 6. 内置Symbol

[内置Symbol值]([Symbol - ES6 教程 - 网道 (wangdoc.com)](https://wangdoc.com/es6/symbol##内置的-symbol-值))

