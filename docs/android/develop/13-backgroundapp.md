# Android 后台服务管理

限制后台服务，使得多应用运行场景下还保留足够的空闲内存，当系统资源内存紧张时，通过清除后台服务，让系统保持运行流畅。

## 方案配置

:::note
通过 `device/softwinner/common/config/awbms_config` 复制到 `$(TARGET_COPY_OUT_VENDOR)/etc/` 开启后台管理服务。通过配置文件中各项修改后台服务管理的配置。
:::

```
debug: false
limit: 12
threadCheck: true
memoryCheck: true
memoryLimit: 450,0
memoryTrim: false
skipService: true
blockBroadcast: false
lmk: false
lmk_level: 100,150,250
lmk_adj: 99,200,600

whitelist:
android
com.android
com.android.phone
```

* debug 是否打开调试打印，取值true/false，默认为false。
* limit 限制后台个数，清理多余的后台，-1则不限制，默认为0。
* threadCheck 检查优化关键进程优先级，取值true/false，默认为false。
* memoryCheck 根据当前内存情况清理后台应用，取值true/false，默认为false。
* skipService 是否跳过非白名单服务自动启动，取值true/false，默认为true。
* whitelist配置包名前缀白名单，系统白名单的进程不会被上述机制清理。
* 当前输入法、正在播放音乐进程等自动系统白名单，无须单独配置。

## 用户设置

通过：设置->系统->自动运行可以进入设置后台清理列表。列表中只显示不在系统配置白名单中的应用。勾选后的应用添加到用户白名单中。

## 功能调试

通过删除 `awbms_config` 配置文件可以关闭后台管理功能，通过以下命令可开启/关闭相关调试打印：

```
service call background 1 i32 1/0
```

logcat中关于BackgroundManagerService相关的打印。

```
D bms: skipped service Intent(xxx)
I bms: forceStopPackage com.xxx.xxx
D bms: killBackgroundProcesses com.xxx.xxx
```

当看到则 `forceStopPackage` 或 `killBackgroundProcesses` 表示后台应用被后台服务管理清除，如有必要则需要将应用加入白名单或者在设置中取消勾选清除列表。

使用命令：`dumpsys background` 可以查看后台服务当前的状态。