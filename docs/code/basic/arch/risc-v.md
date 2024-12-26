---
title: risc-v

order: 1
author: zzys
date: 2024-12-24
category:
- Arch
- risc-v
tag:
- 杂记
---

## 特权级别

[关于risc-v启动部分的思考-电子发烧友网](https://m.elecfans.com/article/1441031.html)

![image-20241224162339981](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/8e5aed3d5cea6424c74aecf29b8a2efd.png)

SBI是risc-v架构的特有规范，提供SBI结构供OS调用。

应用程序位于最弱的用户特权级（User Mode）， 操作系统位于内核特权级（Supervisor Mode）， RustSBI位于机器特权级（Machine Mode）。



```bash
cargo build --target=riscv64gc-unknown-none-elf --release

rust-objcopy --binary-architecture=riscv64 target/riscv64gc-unknown-none-elf/release/os --strip-all -O binary target/riscv64gc-unknown-none-elf/release/os.bin

qemu-system-riscv64 -machine virt -nographic -bios ../bootloader/rustsbi-qemu.bin -device loader,file=target/riscv64gc-unknown-none-elf/release/os.bin,addr=0x80200000
```

