---
sidebar_position: 3
---

# 编译 AvaotaOS

AvaotaOS 的编译命令的格式如下：

```bash
sudo bash build_all.sh -b <BOARD> -v <UBUNTU_VERSION> -a <ARCH> -t <SYS_TYPE>
```

其中，各个选项的含义如下：

- `<BOARD>`：指定要编译的目标板型，例如 `avaota-a1`。
- `<UBUNTU_VERSION>`：指定 Ubuntu 版本，可选值为 `jammy`（Ubuntu 22.04）或者 `noble`（Ubuntu 24.04）。
- `<ARCH>`：指定架构，可选值为 `aarch64`（arm64）或者 `armhf`（armhf）。
- `<SYS_TYPE>`：指定系统类型，可选值包括 `cli`、`xfce`、`gnome`、`kde`、`lxqt`等。

例如，要编译 `avaota-a1` 板型，Ubuntu 22.04，架构为 `aarch64`，系统类型为 `cli`，命令格式如下：

```bash
sudo bash build_all.sh -b avaota-a1 -v jammy -a aarch64 -t cli
```

这样的命令将会使用 `build_all.sh` 脚本进行编译，编译出符合指定要求的系统镜像。编译需要网络连接，依照网络性能和电脑性能大约需要10分钟~120分钟。

编译后的系统镜像在 `build_dir` 里，例如这里示例的编译文件`ubuntu-jammy-cli-aarch64-avaota-a1.img.xz`

## 命令举例

1. 编译 `avaota-a1` 板型，Ubuntu 24.04，架构为 `armhf`，系统类型为 `xfce`：

```bash
sudo bash build_all.sh -b avaota-a1 -v noble -a armhf -t xfce
```

2. 编译 `avaota-a1` 板型，Ubuntu 22.04，架构为 `aarch64`，系统类型为 `gnome`：

```bash
sudo bash build_all.sh -b avaota-a1 -v jammy -a aarch64 -t gnome
```

3. 编译 `avaota-a1` 板型，Ubuntu 24.04，架构为 `armhf`，系统类型为 `kde`：

```bash
sudo bash build_all.sh -b avaota-a1 -v noble -a armhf -t kde
```

## 演示

import AsciinemaWidget from '/src/components/AsciinemaWidget';

<AsciinemaWidget src={require('./assets/build-os/os-build.docx').default} rows={30} idleTimeLimit={1} preload={true} />