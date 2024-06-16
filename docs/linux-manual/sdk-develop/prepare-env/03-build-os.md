---
sidebar_position: 3
---

# 编译 AvaotaOS

AvaotaOS 支持 TUI 与 CLI 形式编译，这两种方法都是一样的，TUI 对操作更加友好，而 CLI 更方便集成进各种持续集成服务中。这里分开讲述。

## TUI 编译

在获取 SDK 后，执行下面的命令会进入 TUI 编译模式

```shell
sudo bash build_all.sh
```

首先是选择开发板，这里选择 Avaota A1

![image-20240613122850725](assets/post/03-build-os/image-20240613122850725.png)

然后选择发行版，这里选择 `Ubuntu 22.04 Jammy`

![image-20240613122911422](assets/post/03-build-os/image-20240613122911422.png)

然后选择需要安装的桌面，这里就编译无桌面的 `CLI` 版本

![image-20240613122945356](assets/post/03-build-os/image-20240613122945356.png)

选择是否需要运行内核配置，这里就不配置了

![image-20240613123012020](assets/post/03-build-os/image-20240613123012020.png)

输入默认用户名

![image-20240613123031939](assets/post/03-build-os/image-20240613123031939.png)

输入用户密码

![image-20240613123044131](assets/post/03-build-os/image-20240613123044131.png)

输入 ROOT 用户密码

![image-20240613123057587](assets/post/03-build-os/image-20240613123057587.png)

配置镜像源

![image-20240613123111208](assets/post/03-build-os/image-20240613123111208.png)

之后便开始编译

![image-20240613123135565](assets/post/03-build-os/image-20240613123135565.png)

### 演示

import AsciinemaWidget from '/src/components/AsciinemaWidget';

<AsciinemaWidget src={require('./assets/build-os/os-build-tui.docx').default} rows={30} idleTimeLimit={1} preload={true} />

## CLI 编译

AvaotaOS 的编译命令的格式如下：

```bash
sudo ./build_all.sh \
    -b <BOARD> \
    -m <MIRROR> \
    -v <SYSTEM_DISTRO> \
    -t <SYS_TYPE> \
    -u <SYS_USER> \
    -p <USER_PASSWORD> \
    -s <ROOT_PASSWORD> \
    -k <IF_MENUCONFIG> \
    -i <GITHUB_MIRROR> \
    -o <KERNEL_ONLY> \
    -e <USE_CCACHE>
```

其中，各个选项的含义如下：

- `<BOARD>`：指定要编译的目标板型，例如 `avaota-a1`。
- `<MIRROR>`：指定镜像站，例如 `https://mirrors.ustc.edu.cn/ubuntu-ports`。
- `<SYSTEM_DISTRO>`：指定发行版版本，可选值为 `jammy`（Ubuntu 22.04）或者 `noble`（Ubuntu 24.04）以及 `bookworm`（Debian 12）。
- `<SYS_TYPE>`：指定系统类型，可选值包括 `cli`、`xfce`、`gnome`、`kde`、`lxqt`等。
- `<SYS_USER>`：指定系统普通用户用户名。
- `<USER_PASSWORD>`：指定系统普通用户密码。
- `<ROOT_PASSWORD>`：指定 root 用户密码。
- `<IF_MENUCONFIG>`：指定是否运行内核配置界面（make menuconfig），可选值包括 `yes`、`no`。
- `<GITHUB_MIRROR>`：指定是否使用 GitHub 代理，例如 `https://mirror.ghproxy.com`。（无论是否指定，第一次代码拉取失败则会从 Gitee 拉取）
- `<KERNEL_ONLY>`：指定是否只编译内核包，可选值包括 `yes`、`no`。
- `<USE_CCACHE>`：指定是否使用 `ccache`，可选值包括 `yes`、`no`。


例如，要编译 `avaota-a1` 板型，Ubuntu 22.04，系统类型为 `cli`，命令格式如下：

```bash
sudo bash build_all.sh \
    -b avaota-a1 \
    -m https://mirrors.ustc.edu.cn/ubuntu-ports \
    -v jammy \
    -t cli \
    -u avaota \
    -p avaota \
    -s avaota \
    -k no \
    -i no \
    -o no \
    -e no
```

这样的命令将会使用 `build_all.sh` 脚本进行编译，编译出符合指定要求的系统镜像。编译需要网络连接，依照网络性能和电脑性能大约需要10分钟~120分钟。

编译后的系统镜像在 `build_dir` 里，例如这里示例的编译文件`ubuntu-jammy-cli-aarch64-avaota-a1.img.xz`

### 命令举例

1. 编译 `avaota-a1` 板型，Ubuntu 24.04，从中科大镜像站构建根目录，系统类型为 `xfce`：

```bash
sudo bash build_all.sh \
    -b avaota-a1 \
    -m https://mirrors.ustc.edu.cn/ubuntu-ports \
    -v jammy \
    -t xfce \
    -u avaota \
    -p avaota \
    -s avaota \
    -k no \
    -i no \
    -o no \
    -e no
```

2. 编译 `avaota-a1` 板型，Ubuntu 24.04，从中科大镜像站构建根目录，系统类型为 `gnome`：

```bash
sudo bash build_all.sh \
    -b avaota-a1 \
    -m https://mirrors.ustc.edu.cn/ubuntu-ports \
    -v jammy \
    -t gnome \
    -u avaota \
    -p avaota \
    -s avaota \
    -k no \
    -i no \
    -o no \
    -e no
```

3. 编译 `avaota-a1` 板型，Debian bookworm，从中科大镜像站构建根目录，系统类型为 cli`：

```bash
sudo bash build_all.sh \
    -b avaota-a1 \
    -m https://mirrors.ustc.edu.cn/debian \
    -v bookworm \
    -t cli \
    -u avaota \
    -p avaota \
    -s avaota \
    -k no \
    -i no \
    -o no \
    -e no
```

### 演示

<AsciinemaWidget src={require('./assets/build-os/os-build.docx').default} rows={30} idleTimeLimit={1} preload={true} />
