# Android Fastboot

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