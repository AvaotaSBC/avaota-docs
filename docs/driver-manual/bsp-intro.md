---
sidebar_position: 1
---

# BSP 驱动介绍

AvaotaOS主要使用的是BSP独立仓库，可以降低BSP模块驱动代码与内核原生代码之间的耦合度，BSP模块能够更轻松地适配各种内核版本，从而方便产品进行内核升级。该独立仓库将SoC驱动代码、板级驱动代码、defconfig、SoC级dts以及ramfs等文件独立出来，统一放在一个名为`bsp`的独立仓库中进行管理。

通过这种方式，BSP独立仓库的做法有以下几个优势：
1. **降低耦合度**：将BSP相关的代码独立出来，有助于减少与内核原生代码的耦合度，使得BSP模块可以更灵活地适配不同版本的内核。
   
2. **便捷适配**：独立管理BSP相关代码可以使得适配工作更加便捷高效，有利于快速响应新内核版本的发布和进行产品内核升级。
   
3. **统一管理**：将SoC驱动代码、板级驱动代码等放在统一的`bsp`仓库下管理，有利于整体代码的组织和维护，提高代码的可读性和可维护性。
   
4. **规范化管理**：通过建立BSP独立仓库，有助于规范化管理BSP相关代码，确保代码的质量和稳定性，同时也方便团队协作和版本控制。

## BSP 驱动目录

BSP 驱动目录结构如下

```
.
├── Kconfig                   # BSP配置文件
├── Makefile                  # BSP整体Makefile文件
├── configs                   # 内核配置文件目录
│   ├── linux-5.15            # 内核5.15配置文件目录
│   ├── linux-6.1             # 内核6.1配置文件目录
... ...    
│   └── linux-6.6             # 内核6.6配置文件目录
├── drivers                   # 驱动程序目录
│   ├── Kconfig               # 驱动程序Kconfig配置
│   ├── Makefile              # 驱动程序Makefile
│   ├── aw_trace
... ...                       
│   ├── watchdog
│   └── wiegand
├── include                   # 头文件目录
│   ├── boot_param.h          # 启动参数头文件
│   ├── dt-bindings           # 设备树绑定头文件
│   ├── errcode               # 错误码头文件
│   ├── linux                 # Linux内核头文件
... ...
│   └── video
├── modules                   # 模块目录
│   └── gpu
├── platform                  # 平台相关配置目录
│   ├── Kconfig               # 平台Kconfig配置
│   ├── Kconfig.common        # 平台通用Kconfig配置
│   ├── Kconfig.debug         # 平台调试Kconfig配置
│   └── Kconfig.test          # 平台测试Kconfig配置
└── ramfs                     # RAM 文件系统目录
    ├── ramfs_arm32           # ARM32架构RAM文件系统
    ...
    └── ramfs_arm64           # ARM64架构RAM文件系统

```

### 目录结构

#### drivers

drivers目录：主要存放模块对应的驱动代码(除nand、gpu外)，如usb，dma等。

```shell
|---bsp
|      |---drivers
|      |      |---Kconfig
|      |      |---Makefile
|      |      |---moduleX
|      |      |      |---Kconfig
|      |      |      |---Makefile
|      |      |      |---sunxi-moduleX.c
|      |      |---module2
|      |      |      |---Kconfig
|      |      |      |---Makefile
|      |      |      |---sunxi-module2.c
```

#### modules

modules目录：主要存放特定模块的驱动源码，如nand和gpu。

```shell
|---bsp
|      |---modules
|      |      |---nand
|      |      |      |---Kconfig
|      |      |      |---Makefile
|      |      |      |---sunxi-moduleX.c
|      |      |---gpu
|      |      |      |---Kconfig
|      |      |      |---Makefile
|      |      |      |---sunxi-module2.c
```

#### include

include目录：主要存放模块公共的.h文件，或需要暴露给其他模块使用的.h文件，如clk相关头文件。

```shell
|---bsp
|      |---include
|      |       |---sunxi-moduleX.h
|      |       |---sunxi-module2.h
|      |       |---module3
|      |       |      |---sunxi-module3-xxx.h
|      |       |      |---sunxi-module3-xxx.h
|      |       |      |---sunxi-module3-xxx.h
|      |       |---...
```

#### configs

configs目录：主要存放SoC级配置，包含dtsi和最小系统defconfig文件。

```shell
|---bsp
|      |---configs
|      |       |---linux-5.10
|      |       |      |---sun50iw10p1.dtsi
|      |       |      |---sun50iw10p1_min_defconfig
```

#### ramfs

ramfs目录：主要存放不同架构内存文件系统相关内容，如rootfs_arm32等。

```shell
|---bsp
|      |---ramfs
|      |       |---rootfs_arm32
|      |       |---rootfs_arm64
|      |       |---rootfs_riscv
```

## 适配新内核

这里以 Linux 5.10 为例，介绍如何适配到新内核

* 更改内核linux-5.10目录下`Kconfig`和`Makefile`,确保bsp仓库与内核仓库正确关联起来，更改内容如下：

```c
diff --git a/Kconfig b/Kconfig
index 57a142d8d8b4..197dfd3558f3 100644
--- a/Kconfig
+++ b/Kconfig
@@ -7,6 +7,8 @@ mainmenu "Linux/$(ARCH) $(KERNELVERSION) Kernel Configuration"

 source "scripts/Kconfig.include"

+source "bsp/Kconfig"
+
 source "init/Kconfig"

 source "kernel/Kconfig.freezer"
diff --git a/Makefile b/Makefile
index 82effe3d7164..85a7bd23101b 100644
--- a/Makefile
+++ b/Makefile
@@ -574,6 +574,7 @@ LINUXINCLUDE    := \
                -I$(objtree)/arch/$(SRCARCH)/include/generated \
                $(if $(building_out_of_srctree),-I$(srctree)/include) \
                -I$(objtree)/include \
+               -I$(srctree)/bsp/include \
                $(USERINCLUDE)

 KBUILD_AFLAGS   := -D__ASSEMBLY__ -fno-PIE
@@ -763,6 +764,7 @@ ifeq ($(KBUILD_EXTMOD),)
 # Objects we will link into vmlinux / subdirs we need to visit
 core-y         :=
 drivers-y      :=
+drivers-y      += bsp/
 libs-y         := lib/
 endif # KBUILD_EXTMOD
```

## 内核版本

### AOSP 与 LTS 内核

BSP 驱动支持 Kernel.org 提供的 LTS 内核，也支持 AOSP 提供的 AOSP 内核，这两个内核虽然版本相同但是接口有所差别。使用下面的宏来区分两个版本的不同内核

```
CONFIG_AW_KERNEL_ORIGIN
```

### 不同内核版本适配不同驱动文件

若不同内核之间，驱动改动太大，需要用不同的C文件来区分，可以在Makefile中借助内核版本号来条件编译。

例：Linux-5.10使用sunxi-module-v200.c，其他内核使用sunxi-module-v100.c，则模块对应Makefile可修改为：

```c
$(BSP_TOP)drivers/dma/Makefile

ifeq ($(VERSION).$(PATCHLEVEL),5.10)
obj-$(CONFIG_AW_DMA) += sunxi-dma-v200.o
else
obj-$(CONFIG_AW_DMA) += sunxi-dma-v100.o
endif
```

### 不同内核版本适配不同驱动目录

若不同内核之间，驱动改动太大，需要用不同的目录来区分，则除了如上所述修改Makefile之外，还需要修改Kconfig。

例：Linux-5.10.43 内核使用 drivers/module1-v200/ ，其他内核使用 drivers/module1-v100/ ，则需同时修改Makefile和Kconfig：

Makefile修改方法与前一章节小节一致，Kconfig里用于判断内核版本号的函数如下，详见 bsp/platform/Kconfig.common ：

```c
ker-ver-lt 	// 判断当前内核版本 <  指定的版本
ker-ver-le 	// 判断当前内核版本 <= 指定的版本
ker-ver-eq 	// 判断当前内核版本 == 指定的版本
ker-ver-gt 	// 判断当前内核版本 > 指定的版本
ker-ver-ge 	// 判断当前内核版本 >= 指定的版本
```
