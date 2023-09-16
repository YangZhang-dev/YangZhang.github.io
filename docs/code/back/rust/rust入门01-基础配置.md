---
title: rust入门01-基础配置

order: 1
author: zzys
date: 2023-05-13
category:
- 笔记
tags:
- rust
- 学习
---









## 1.下载和配置

官网下载：[Install Rust - Rust Programming Language (rust-lang.org)](https://www.rust-lang.org/tools/install)，选择1默认安装。

更新：

```shell
rustup update
```

卸载：

```shell
rustup self uninstall	
```

验证：
```shell
rustc --verison
```

本地文档：

```shell
rustup doc
```

## 2. hello world

创建main.rs文件，输入以下代码：
```rust
fn main() {
    println!("Hello, world!");
}
```

使用以下命令编译：

```shell
rustc main.rs
```



## 3. cargo

类似于java的maven，cargo是rust的代码构建，依赖管理工具

使用下面的命令检查cargo是否安装好了：

```shell
cargo --version
```

使用下面的命令创建cargo项目：

```shell
cargo new hello_cargo
```

src目录下存放源代码，而**Cargo.toml**，则是类似于pom.xml的配置文件。在rust中，每一个依赖称作crate。

在项目根目录使用下面的命令的命令构建项目：

```shell
cargo build
```

使用下面的命令来运行项目。

```shell
cargo run
```

使用下面的命令来检查代码是否能够通过编译：

```shell
cargo check
```

使用下面的命令来构建正式版本：

```shell
cargo build --release
```





