# Android 调试 debug

## 将logcat和dmesg信息保存到文件系统

为了调试方便，可以在开发调试阶段将系统的logcat和内核log自动保存到data分区文件系统上，这种方法可以方便调试偶发问题，log保存在/data/media/awlog目录。

在文件中加入PRODUCT_DEBUG := true即可打开该功能，eng及userdebug固件默认开启。

或者在AOSP计算器中输入，AOSP计算器集成了动态开关设置。

```
log(666+!)++
```

弹出开关设置界面，根据UI进行配置log保存选项。

:::note

GMS方案中主界面显示的是Google计算器，通过以上操作无法打开动态开关。

AOSP计算器默认隐藏，打开方式为Settings->About tablet,点击5次Version number

:::

## 生成debug固件

编译android后，pack -d即可生成debug固件，该固件将串口引入卡口打印出来，配合配套的工具即可实时查看log信息。

## 使用fastboot

获取fastboot工具。

1. 建议更新最新版本Android SDK tools中的fastboot工具。

2. 在android源代码编译过后的生成文件获得(platform/out/host/linux-x86/bin/fastboot)。

* fastboot常用命令

```
usage: fastboot [ <option> ] <command>
commands:
update <filename>                          reflash device from update.zip
flash <partition> [ <filename> ]        write a file to a flash partition
erase <partition>                          erase a flash partition
format <partition>                         format a flash partition
help                                          show this help message
```

* bootloader模式

用于升级传统的物理分区，在adb shell中，使用命令reboot bootloader即可进入bootloader模式。

安装驱动后，在PC端执行fastboot命令即可进行fastboot操作。

* fastbootd模式

Android Q之后引入动态分区，由于在传统bootloader模式中无法识别到逻辑分区，因此基于recovery系统启动的应用进程fastbootd，专门用于烧写system、vendor、product等逻辑分区。