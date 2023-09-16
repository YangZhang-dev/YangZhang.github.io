---
title: ES6-06 Module的导入和导出

order: 6
author: zzys
date: 2022-11-19
category:
- 笔记
tag:
- es6
- 前端
---

## 1. 概述

```js
// ES6模块
import { stat, exists, readFile } from 'fs';
```

ES6通过使用模块来进行导入一个js文件，并且这种加载称为**静态加载**，即只加载导入的方法

## 2. export

`export`用于指定对外输出的接口，一个文件就是一个模块，内部代码在外部无法调用，如果想要调用，那么就要使用`export`将其导出，可以导出变量，函数，类

```js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName as first, lastName, year };
// 通过as进行重命名
```

```js
export function multiply(x, y) {
  return x * y;
};
```

需要特别注意的是，`export`命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

```js
// 报错
export 1;

// 报错
var m = 1;
export m;

// 正确写法
var m = 1;
export {m};
```

## 3. import

通过`import`就可以导入外部导出的模块，注意导入的变量都是只读的，对象是可改的，但不建议这么左。同时，`import`具有提升效果，会自动提升到文件头部，首先执行。

```js
// main.js
import { firstName, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

```js
import {a} from './xxx.js'

a = {}; // Syntax Error : 'a' is read-only;
```

`import`可以使用`*`进行整体加载

```js
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

同时，当导出时使用`export default`时，允许`import`时任意起一个名字