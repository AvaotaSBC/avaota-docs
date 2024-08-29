# Android Kernel 开发

Android 的内核提供 SDK 叫做 longan 系统，在编译安卓之前需要先编译 longan 系统产出内核文件给 Android 使用。

## 目录结构

```shell
longan/
├── brandy									//uboot和cpu的源码
│   ├── arisc								//cpus源码目录
│   └── brandy-2.0							//uboot源码目录
├── bsp										//BSP独立仓库源码目录
│   ├── configs								//配置文件目录
│   ├── drivers								//AW的私有驱动源码目录
│   ├── include								//AW的私有头文件目录
│   ├── Kconfig
│   ├── Makefile
│   ├── modules								//AW的模块源码目录
│   ├── platform							//AW的架构配置目录
│   └── ramfs								//AW的ramfs文件系统目录
├── build									//编译打包脚本
│   ├── bin									//制作文件系统工具
│   ├── bsp.sh								//与BSP独立仓库联合编译的脚本
│   ├── buildbase.sh
│   ├── createkeys							//创建安全方案秘钥工具
│   ├── disclaimer
│   ├── envsetup.sh							//配置环境变量
│   ├── getvmlinux.sh
│   ├── hook
│   ├── Makefile
│   ├── mkcmd.sh							//主要编译脚本
│   ├── mkcommon.sh							//编译脚本
│   ├── mkkernel.sh							//内核编译相关的脚本
│   ├── pack								//打包脚本
│   ├── parser.sh
│   ├── quick.sh
│   ├── shflags
│   ├── swapsdc.sh
│   ├── swupdate
│   └── top_build.sh
├── build.sh -> build/top_build.sh			//顶层编译脚本
├── documentation							//各个平台的文档说明
│   ├── config
│   ├── intermediates
│   ├── output
│   ├── source
│   └── tools
├── device									//存储方案配置的目录
│   ├── config
│   |   |chips								//板级配置
│   |   |   ├── A133						//A133配置
│   |   |   |	  ├── bin					//uboot和烧写程序
│   |   |   |	  ├── boot-resource			//启动资源文件，如bootlogo图片
│   |   |   |	  ├── config				//方案板配置
│   |   |   |	  |   ├── default			//默认配置和通用配置
│   |   |   |	  |   ├── p25				//A133-p25方案板配置
│   |   |   |	  |   |		├── android		//andriod sdk配置
│   ├── product -> ./config/chips/a133/
├── kernel
│   └── linux-5.15							//内核原生代码目录
├── out
│   ├── a133								//a133相关的编译生成物
│   ├── a133_linux_p25_card0_secure_v0.img 	//固件
│   ├── kernel -> a133/kernel
│   ├── pack_out -> a133/p25/pack_out
│   ├── serversocket
│   └── toolchain							//解压后的编译工具链
├── platform								//私有软件包定制目录，使用buildroot系统编译
│   ├── apps								//app代码
│   ├── base								//基础库文件
│   ├── config								//allwinner私有软件包配置
│   |		├── buildroot					//针对buildroot的私有软件包配置
│   ├── core								//服务，组件
│   ├── external							//第三方库、组件、服务
│   ├── framework							//中间层框架
│   ├── Makefile -> ../../build/Makefile
│   └── tools								//调试代码、工具
├── prebuilt								//存放各种编译环境库
│   ├── hostbuilt							//pc工具
│   └── kernelbuilt							//内核编译工具链源码
├── tee_kit
│   ├── build.sh -> dev_kit/build.sh
│   ├── demo
│   ├── dev_kit
│   └── README.md
├── test									//AW的测试文件
│   ├── auto_testplains
│   ├── bsptest								//bsptest测试系统
│   ├── dragonboard							//dragonboard测试系统
└── tools									//pc工具
|   ├── build
|   ├── codecheck							//代码检查工具
|   ├── pack
|   └── tools_win 							//windows软件工具
```

## longan编译方式

### SDK常用的编译命令和编译步骤介绍

步骤1，进行sdk环境配置，详细看下一节

```shell
./build.sh config
```

步骤2，编译内核

```shell
./build.sh
```

### longan编译配置示例

```shell
longan$ ./build.sh config
========ACTION List: mk_config ;========
options :
All available platform:
   0. android
   1. linux
Choice [android]: 0
All available ic:
   0. a523
   1. a527
   2. t527
Choice [t527]: 2
All available board:
   0. avaota_a1
   1. demo
   2. demo_battery
   3. demo_car
   4. demo_fastboot
   5. demo_linux_aiot
   6. demo_linux_car
Choice [avaota_a1]: 0
All available flash:
   0. default
   1. nor
Choice [default]: 0
```

### longan的常用命令

longan常见编译打包命令如下所示：

|          | 命令                  | 用法说明                                                     |
| :------: | --------------------- | :----------------------------------------------------------- |
| 整体编译 | ./build.sh config     | 1. 编译配置，然后弹出配置选择<br>2. 作用是找到对应的BoardConfig.mk文件，并且配置部分参数 |
| 整体编译 | ./build.sh            | 编译命令，编译kernel                                         |
| 局部编译 | ./build.sh bootloader | 编译boot0、uboot、efex                                       |
| 局部编译 | ./build.sh kernel     | 编译kernel                                                   |
| 局部编译 | ./build.sh menuconfig | 打开内核的配置界面                                           |
| 局部编译 | ./build.sh saveconfig | 保存内核配置（menuconfig）                                   |

