---
title: ruoyi-vue启动配置

order: 1
author: zzys
date: 2023-05-13
category:
- 技术
tag:
- golang
- 语法
---
最近使用若依进行低代码开发，总结了一下启动需要修改的配置项。
[若依管理系统RuoYi-Vue（三）：代码生成器原理和实战 - 一枝梅的技术收录 (kdyzm.cn)](https://blog.kdyzm.cn/post/48)

## 启动项目

1. git clone https://gitee.com/y_project/RuoYi-Vue.git

2. 修改ruoyi-admin中的application-druid.yaml数据源配置以及application.yaml中的redis配置
3. 新建ry-vue数据库，导入sql包下的文件

## 新建模块

1. 建立新模块jcx，引入ruoyi-framework依赖

2. 更换父模块为ruoyi

3. 在ruoyi-admin中引入jcx依赖

4. 修改ruoyi-generator中的generator.yaml文件的代码生成包配置

5. 修改ruoyi-admin中application.yaml中的mybatis.typeAliasesPackage配置

6. 修改ruoyi-framework中ApplicationConfig中@MapperScan

7. 在ruoyi-admin中增加一个配置类将组件扫描进入spring

   ```java
   package com.ruoyi.config;
   
   import org.springframework.context.annotation.ComponentScan;
   import org.springframework.context.annotation.Configuration;
   
   /**
    * @author kdyzm
    */
   @Configuration
   @ComponentScan(basePackages = "com.kdyzm")
   public class Config {
   }
   ```

   

## 生成并应用代码

1. 创建表

2. 在代码生成页导入表，如果第二块配好了这里就不需要再动了，直接生成
3. 拷贝到指定模块，并运行sql文件