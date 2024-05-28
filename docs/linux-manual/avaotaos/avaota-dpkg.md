# 软件包管理

在 Linux 系统中，使用源代码进行软件编译能够实现高度定制化的设置，但对于Linux发行版的用户来说，并不是每个人都具备源代码编译的能力。这一点成为了Linux发行商面临的一个软件管理难题，因为这影响了软件在Linux平台上的发行和推广。

为了解决这个问题，Linux发行商开始提供已经编译好并可执行的软件，直接供用户安装使用。不同的Linux发行版采用不同的打包系统，主要分为两大包管理技术阵营：Debian的 `.deb` 和Red Hat的 `.rpm`

本文将重点介绍Debian系列发行版中的`dpkg`和`apt-*`工具的详细使用方法。

## DPKG 简介
``dpkg``是Debian系统的包管理工具。

``dpkg`` is a tool to install, build, remove, and manage Debian packages. 它是Debian的一个底层包管理工具，主要用于对已下载到本地和已安装的软件包进行管理。

该机制最早由 Debian Linux 社区开发。通过``dpkg``的机制，Debian提供的软件能够轻松安装，并提供安装后的软件信息。许多派生于 Debian 的 Linux 发行版（如B2D、Ubuntu等）大多使用``dpkg``这个机制来管理软件。

### deb软件包命名规则
格式为：``Package_Version-Build_Architecture.deb``

例如：``nano_1.3.10-2_aarch64.deb``

软件包名称（Package Name）: ``nano``
版本（Version Number）: ``1.3.10``
修订号（Build Number）: ``2``
平台（Architecture）: ``aarch64``

### ``dpkg``软件包相关文件介绍

- ``/etc/dpkg/dpkg.cfg``：``dpkg``包管理软件的配置文件【Configuration file with default options】
- ``/var/log/dpkg.log``：``dpkg``包管理软件的日志文件【Default log file (see /etc/dpkg/dpkg.cfg(5) and option --log)】
- ``/var/lib/dpkg/available``：存放系统所有安装过的软件包信息【List of available packages】
- ``/var/lib/dpkg/status``：存放系统现在所有安装软件的状态信息
- ``/var/lib/dpkg/info``：记录安装软件包控制目录的控制信息文件

### ``dpkg`` 数据库
``dpkg``使用文本文件作为数据库来维护系统中软件，包括文件清单、依赖关系、软件状态等详细内容，通常存储在``/var/lib/dpkg``目录下。通常在``status``文件中存储软件状态和控制信息。在``info/``目录下备份控制文件，并在其下的``.list``文件中记录安装文件清单，其下的``.mdasums``保存文件的MD5编码。

可以用下列命令查询 `dpkg` 数据库

```
dpkg -i
```

### `dpkg` 子命令

为了方便用户使用，`dpkg` 不仅提供了大量的参数选项, 同时也提供了许多子命令。

1. ``dpkg-deb``:
   - 功能：``dpkg-deb``是一个用于打包和解包Debian软件包（.deb文件）的工具。
   - 用法：
     - 打包：``dpkg-deb -b <目录> <输出.deb文件>``
     - 解包：``dpkg-deb -x <deb文件> <目标目录>``

2. ``dpkg-divert``:
   - 功能：``dpkg-divert``用于管理Debian软件包中文件的重定向或重命名。
   - 用法：``dpkg-divert [选项] [源文件]``

3. ``dpkg-query``:
   - 功能：``dpkg-query``允许用户查询Debian软件包的信息，如已安装软件包的状态、软件包的文件列表等。
   - 用法：
     - 查询已安装软件包的信息：``dpkg-query -l <软件包名>``
     - 查询软件包的文件列表：``dpkg-query -L <软件包名>``

4. ``dpkg-split``:
   - 功能：``dpkg-split``用于将大型软件包（.deb文件）拆分成较小的部分，以便于分发或存储。
   - 用法：``dpkg-split [选项] [输入.deb文件]``

5. ``dpkg-statoverride``:
   - 功能：``dpkg-statoverride``用于修改Debian软件包中文件的权限和属性，以覆盖默认的文件权限设置。
   - 用法：``dpkg-statoverride [选项]``

6. ``start-stop-daemon``:
   - 功能：``start-stop-daemon``是一个通用的守护进程管理器，用于启动、停止、重启系统服务。
   - 用法：
     - 启动服务：``start-stop-daemon --start --name <服务名>``
     - 停止服务：``start-stop-daemon --stop --name <服务名>``
     - 重启服务：``start-stop-daemon --restart --name <服务名>``

## `dpkg` 使用手册

### 安装：

- 安装软件包：```dpkg -i package-name.deb``` （--install）必须使用完整的deb软件包名称。（安装软件包可分为解包和配置两个步骤）

- 解包：```dpkg --unpack package-name.deb``` 解开软件包到系统目录但不进行配置。若与-R一起使用，则参数可以是一个目录。

- 配置：```dpkg --configure package-name.deb``` 配置软件包。

- 列出deb包的内容：```dpkg -c package-name.deb```

- 递归处理所有与指定目录中找到的符合模式*.deb的常规文件，并且所有的avail操作（可用）可与-i、-A、--install、--unpack一起使用：```-R, --recursive```

### 移除软件包：

- 移除软件包但保留其配置文件：```dpkg -r package-name``` （--remove）

- 清除软件包的所有文件（包括配置文件）：```dpkg -P package-name``` （--purge）

### 查询：

- 查看系统中软件包名符合模式pattern的软件包：```dpkg -l package-name-pattern``` （--list）

- 查看package-name对应的软件包安装的文件及目录：```dpkg -L package-name``` （--listfiles）

- 显示包的具体信息：```dpkg -p package-name``` （--print-avail）

- 查看package-name（已安装）对应的软件包信息：```dpkg -s package-name``` （--status）

- 从已经安装的软件包中查找包含filename的软件包名称：```dpkg -S filename-search-pattern``` （--search）

#### 例子：

- 列出系统上安装的与dpkg相关的软件包：```dpkg -l \*dpkg*```

- 查看dpkg软件包安装到系统中的文件：```dpkg -L dpkg```

更多dpkg的使用方法可在命令行中使用```man dpkg```来查阅，或直接使用```dpkg --help```。

## apt

apt 是一个用于管理 Debian 和 Ubuntu 系统上软件包的高级工具。它解决了在安装软件时可能出现的依赖关系问题。Linux 发行版会将软件包放在特定的服务器中，apt 分析这些软件的依赖关系并记录下来。当用户需要安装软件时，apt 会与本地的软件包数据进行比较，然后从网络端获取所有需要的具有依赖属性的软件。

### apt 工作原理

Ubuntu 使用集中式的软件仓库机制，将各式各样的软件包存放在软件仓库中，进行有效地组织和管理。这些软件仓库置于许多镜像服务器中，并保持基本一致。用户通过配置文件 `/etc/apt/sources.list` 列出最合适访问的镜像站点地址。

**例1：apt-get 的更新过程**

1. 执行 `apt-get update` 命令。
2. 程序分析 `/etc/apt/sources.list`。
3. 自动连网寻找配置文件中对应的 Packages/Sources/Release 列表文件，如果有更新则下载之，存入 `/var/lib/apt/lists/` 目录。
4. 使用 `apt-get install` 安装相应的包，下载并安装。

软件源配置文件告知系统可以访问的镜像站点地址，但具体的软件资源并不清楚。因此，需要为这些软件资源建立索引文件。用户可以使用 `apt-get update` 命令刷新软件源，建立更新软件包列表。这个命令会扫描每个软件源服务器，并为该服务器所具有的软件包资源建立索引文件，存放在本地的 `/var/lib/apt/lists/` 目录中。使用 `apt-get` 执行安装、更新操作时，都将依据这些索引文件向软件源服务器申请资源。因此，在计算机空闲时，经常使用 `apt-get update` 命令刷新软件源是一个好的习惯。

### apt 相关文件

- `/var/lib/dpkg/available` 文件包含软件包的描述信息，包括当前系统所使用的 Debian 安装源中的所有软件包，包括已安装和未安装的软件包。

- `/etc/apt/sources.list` 文件记录了软件源的地址。当执行 `sudo apt-get install xxx` 命令时，Ubuntu 会从这些地址下载软件包到本地并执行安装。

- `/var/cache/apt/archives` 目录存放已经下载的软件包。当使用 `apt-get install` 安装软件时，软件包会临时存放在这个路径下。

- `/var/lib/apt/lists` 目录存放着通过 `apt-get update` 命令从 `/etc/apt/sources.list` 中下载的软件列表文件。

### apt 换源

要更改 apt 软件包管理器的软件源，你可以编辑 `/etc/apt/sources.list` 文件，将其中的软件源地址替换为你想要使用的镜像站点地址。你可以选择一个速度快、稳定可靠的镜像站点，通常你可以在该镜像站点的官方网站上找到相应的地址。

1. 打开终端，以管理员权限编辑 `/etc/apt/sources.list` 文件。你可以使用命令行编辑器如 nano：

```bash
sudo nano /etc/apt/sources.list
```

2. 在编辑器中，你会看到类似下面的内容：

```
deb http://archive.ubuntu.com/ubuntu/ focal main restricted
deb http://archive.ubuntu.com/ubuntu/ focal-updates main restricted
deb http://archive.ubuntu.com/ubuntu/ focal universe
deb http://archive.ubuntu.com/ubuntu/ focal-updates universe
...
```

3. 将每一行的地址替换为你选择的镜像站点地址。例如，如果你想要使用清华大学的 Ubuntu 镜像，你可以将地址修改为：

```
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal universe
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates universe
...
```

4. 保存文件并退出编辑器。在 nano 中，按下 `Ctrl + O` 保存，然后按下 `Ctrl + X` 退出。

5. 最后，运行以下命令以刷新软件包列表并使更改生效：

```bash
sudo apt-get update
```

现在，你的系统将会从新的镜像站点下载软件包。

### apt 使用方法

apt 是一个功能强大的软件包管理工具，用于在 Debian 和 Ubuntu 等 Linux 发行版上安装、升级和删除软件包。以下是一些常用的 apt 命令和选项：

### 安装软件包

```bash
sudo apt-get install package_name
```

此命令将安装指定的软件包及其所有依赖项。

### 升级软件包

```bash
sudo apt-get upgrade
```

此命令将升级系统中所有已安装软件包的版本。

```bash
sudo apt-get dist-upgrade
```

此命令将升级系统中所有软件包的版本，并处理依赖关系的变化。

### 删除软件包

```bash
sudo apt-get remove package_name
```

此命令将从系统中删除指定的软件包，但保留其配置文件。

```bash
sudo apt-get purge package_name
```

此命令将从系统中完全删除指定的软件包，包括其配置文件。

### 搜索软件包

```bash
apt-cache search search_term
```

此命令将搜索软件包的名称和描述中包含指定关键字的所有软件包。

### 显示软件包信息

```bash
apt-cache show package_name
```

此命令将显示指定软件包的详细信息，包括版本、描述、依赖关系等。

### 更新软件包列表

```bash
sudo apt-get update
```

此命令将从软件源中下载最新的软件包列表，但不安装或升级软件包。

### 清理无用软件包

```bash
sudo apt-get autoremove
```

此命令将删除系统中无用的软件包，即已经不再被其他软件包依赖的软件包。

这些是一些常用的 apt 命令，你可以通过在终端中运行 `man apt-get` 命令查看 apt 命令的完整手册页。

### apt-get 和 apt 的区别

Ubuntu 16.04 发布时，一个引人注目的新特性便是 apt 命令的引入。其实早在 2014 年，apt 命令就已经发布了第一个稳定版，只是直到 2016 年的 Ubuntu 16.04 系统发布时才开始引人关注。

随着 `apt install package` 命令的使用频率和普遍性逐步超过 `apt-get install package`，越来越多的其它 Linux 发行版也开始遵循 Ubuntu 的脚步，开始鼓励用户使用 apt 而不是 apt-get。

那么，apt-get 与 apt 命令之间到底有什么区别呢？如果它们有类似的命令结构，为什么还需要新的 apt 命令呢？是否 apt 真的比 apt-get 更好？普通用户应该使用新的 apt 命令还是坚持旧有习惯继续使用 apt-get 呢？

好的，让我来对比一下 `apt` 和 `apt-get` 命令的区别：

1. **语法简洁性**：
   - `apt` 命令通常比 `apt-get` 更简洁，因为它整合了 `apt-get` 和 `apt-cache` 命令的功能，使得常见操作更直观和易用。

2. **命令组合**：
   - `apt` 命令相比 `apt-get` 更加综合，可以执行更多的任务而不需要切换到其他命令，因为它合并了 `apt-get` 和 `apt-cache` 的功能。

3. **自动处理依赖关系**：
   - `apt` 命令在安装和删除软件包时会自动处理依赖关系，使得操作更加方便，而 `apt-get` 则需要手动使用 `apt-get install -f` 来修复依赖关系。

4. **交互性**：
   - 一般来说，`apt` 命令的输出更具有可读性和交互性，它会提供更多的信息和提示，使得用户更容易理解正在发生的操作。

5. **历史记录**：
   - `apt` 命令会记录执行过的操作，可以通过 `apt history` 命令查看，而 `apt-get` 没有类似的功能。

6. **更新策略**：
   - `apt` 命令默认使用更安全的更新策略，即在执行 `apt upgrade` 时会避免升级可能导致依赖关系问题的软件包，而 `apt-get upgrade` 则没有这种策略。

总的来说，`apt` 命令提供了更简洁、更易用的方式来管理软件包，尤其适合普通用户使用。而 `apt-get` 则在某些特定情况下仍然有其用处，比如在脚本中使用时，或者需要更精细控制的情况下。

## 自建 deb 软件源

### 获取软件包

软件包的获取来源根据需求选择：

- 自己构建的 deb 软件包
- 从其他存储获取的 deb 软件包
- 从软件源获取目标软件包，如果不知道有哪些依赖包，可以在能上网的机器上执行 `apt-get install ***` 安装一次软件，默认安装包会存储在 `/var/cache/apt/archives`。将获取的软件归置在一个目录中，例如 : `/var/packages`。如果不需要安装可以使用 `sudo apt-get -d install <包名>` 只下载不安装

### 构建本地 apt 源

**生成索引文件**

```
apt-ftparchive packages . > Packages 
apt-ftparchive release . > Release 
```

**生成签名**

以下操作在 `/opt/debs` 目录下进行

**生成私钥信息**

```
$ gpg --gen-key
```

过程需要填写用户名和邮箱信息提示，以及配置密码信息提示。随后会生成秘钥

**添加私钥**

```
gpg -a --export B394614D9EE5DB4DBC84B26FA035D65B714C3CED | apt-key add -
OK
```

**认证**

```
gpg --clearsign -o InRelease Release
gpg -abs -o Release.gpg Release
```

**配置 sources.list 文件**

```
deb file:///opt/debs/ /
```

### 构建 http 源

使用 nginx / httpd 或其他 web 服务器，将网站的根路径指定为软件源的根路径
