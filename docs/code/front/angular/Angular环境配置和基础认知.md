---
title: Angular环境配置和基础认知

order: 1
author: zzys
date: 2022-09-14
category:
- 笔记
tags:
- angular
- 前端
---


[官方文档](https://angular.cn/docs)
[概览视频](https://www.bilibili.com/video/BV1nW411Y7U8?p=1&vd_source=06aef435eae31ddd5a83e745f4e35879)
[推荐学习文档](https://www.w3cschool.cn/angulerten/angulerten-od1h37tl.html)
## 1. 搭建环境
1. 首先你要必须要有nodejs环境，nodejs中默认安装了npm包管理器
2. 通过npm下载Angular-cli（当然可以用cnpm代替）
```bash
npm install -g @angular/cli
```
## 2. 基础命令
[官方cli命令文档](https://angular.cn/cli)
1. ```bash
   ng new my-app
   # 创建新项目  
   ```
2. ```bash
   cd my-app
   ng serve --open
   # 启动项目
   ```
3. ```bash
   ng g 
   # 后面可跟很多子项，component，class等等，并且都可以缩写
   ```
4. ```bash
   ng build
   # 构建项目
   ```
## 3. 基础概念

### 3.1 模块
Angular应用时模块化的，称为NgModule，它是专注于某个应用领域、某个工作流或一组紧密相关的功能。每个 Angular 应用都至少有一个 NgModule 类，也就是根模块，它习惯上命名为 AppModule，并位于一个名叫 app.module.ts 的文件中。引导这个根模块就可以启动应用。
@NgModule 元数据是一个装饰器，用来声明一个模块

### 3.2 组件
组件控制屏幕上被称为视图的一小片区域
@Component 元数据是一个装饰器，用来声明一个组件
模板，指令和数据绑定

### 3.3 服务和依赖注入
对于与特定视图无关并希望跨组件共享的数据或逻辑，可以创建服务类
@Injectable()元数据是一个装饰器，用来声明一个服务

### 3.4 路由
基本同于vue的路由

==当然angular之所以被称为一个框架，而vue，react被称为库，就是因为它有很多概念，所以angular的入手难度要高于其他两个。==

## 4.  知识脑图
![pngAngular2byStuQ.png](http://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ca86535134b6be20c957454faecae0f3.png)