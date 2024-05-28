# Android Display 显示

## HWC 使用说明

HWC 代码位于：`android/hardware/aw/display/hwc‑hal`，主要用于实现硬件合成器相关功能对接。

目录结构如下：

```
.
├── aidl
├── common
├── disp2
│   └── include
├── include
├── rotator
├── scripts
├── strategy
├── tests
│   └── layertest
│   └── cases
├── vendorservice
│   ├── default
│   └── homlet
└── writeback
```

- aidl: 顶层适配代码，对接 HWC AIDL 
- common: 通用代码，适配 android.hardware.graphics.composer 
- disp2: 驱动适配代码 
- rotator: 硬件旋转代码实现 
- strategy: 图层合成策略 
- tests: 单元测试代码，主要包括图层分配策略测试已经硬件旋转功能测试 
- vendorservice：自定义显示接口实现

### HWC 调试工具

系统内集成了 HWC 调试工具 `hwcdebug`，通过该工具执行调试：

```
usage: hwcdebug [options] [categories...]
options include:
‑o       enable hwc log output which indicate by the following categories
‑x       disbale all hwc log output
‑‑list   list the available logging categories
‑‑dump   <type> <count> [z]
    request dump buffer raw data into file
    type: 0 ‑ input buffer
    1 ‑ output buffer
    2 ‑ hardware rotated buffer
    count: total request count
    z : which z order of input buffer will be dump
‑‑freeze <enable> ‑s <display>
    freezes the output content of the specified logic display for debugging
‑‑help   show this usage
```

HWC 通过 tag 进行过滤调试信息输出，支持的 tag 包括：

```
layer    ‑ Layer planner debug output
vsync    ‑ Vsync timestamp print
scale    ‑ Hardware scaler detect
fps      ‑ Show primary display refresh rate
rotate   ‑ Hardware rotator relate information
perf     ‑ Hardware rotator relate information
```

#### 例

打开帧率信息显示

```
hwcdebug ‑o fps && logcat ‑s sunxihwc
```

打开图层分配信息显示

```
hwcdebug ‑o layer && logcat ‑s sunxihwc
```

### 图层数据保存

`hwcdebug` 目前支持截取输入图层，和硬件旋转后输出的图层，命令格式如下：

```
hwcdebug ‑‑dump <type> <count> [z]
type  ‑ 可取值为 0/2, 0 对应输入图层，2对应硬件旋转输出图层
count ‑ 截取图层的帧数
z     ‑ 指定输入图层的zorder（即特定zorder的图层才会被截取），如果z=255，截取所有的输入图层
```

图层文件保存于 `/data/` 目录下，以 `dump_format_widthxheight_framenumber.dat` 格式命名。

#### 例

截取 `zorder` 为 1 的输入图层 3 帧：

```
$ hwcdebug ‑‑dump 0 3 1
$ ls ‑l /data/
‑rw‑‑‑‑‑‑‑ 1 system graphics 4096000 2020‑01‑14 11:00 dump_RGBA8888_800x1280_1769.dat
‑rw‑‑‑‑‑‑‑ 1 system graphics 4096000 2020‑01‑14 11:00 dump_RGBA8888_800x1280_1770.dat
‑rw‑‑‑‑‑‑‑ 1 system graphics 4096000 2020‑01‑14 11:00 dump_RGBA8888_800x1280_1771.dat
```

## Display HAL

某些平台除了基础必备的 hwc‑hal 代码外，还有一些如 hdmi、cvbs 热插拔、hdmi 的 edid 解析及 cec 处理、多显策略等拓展功能代码，基于模块化的设计

### CEC hal

代码位于：`android/hardware/aw/display/cec‑hal` 此部分代码用于支持 HDMI 的 CEC 功能，除非产品支持 CEC，否则该部分代码不会使用。

### 显示输出配置

代码位于：`android/hardware/aw/display/configs` 其中 `dispconfigs` 子目录为各配置文件的存放目录，配置文件用于对显示输出接口及分辨率、主副 显映射等信息进行配置。除非产品仅仅支持 LCD 单显，否则会使用到该部分代码。 

默认是通过`ro.product.vendor.device`属性来找配置文件，当不存在时使用 `config.json` 配置的文件。举例 配置如下：

```
{
    "DisplayEngineVersion": 2,
    "DisplayNumber": 3, /*Display0, Display1, Display2 */

    "PrimaryDisplay": ["Display0"],
    "ExternalDisplay": ["Display1", "Display2"],

    "Display0": {
        /* Available interface type: LCD/HDMI/CVBS */
        "InterfaceType": "LCD",
        "DisplayEnginePortId": 0,
        "OverrideFramebufferSize": 1,
        "FramebufferWidth": 1024,
        "FramebufferHeight": 600,
        "DpiX": 213,
        "DpiY": 213,
        "HotplugSupported": 0,
        "AfbcSupported": 0,
        "HardwareRotateSupported": 0,
        "BandwidthLimited": 338800,
        "DefaultOutputMode": 0
    },

    "Display1": {
        /* Available interface type: LCD/HDMI/CVBS */
        "InterfaceType": "HDMI",
        "DisplayEnginePortId": 1,
        "OverrideFramebufferSize": 1,
        "FramebufferWidth": 1280,
        "FramebufferHeight": 720,
        "DpiX": 160,
        "DpiY": 160,
        "HotplugSupported": 0,
        "AfbcSupported": 0,
        "HardwareRotateSupported": 0,
        "BandwidthLimited": 338800,
        "DefaultOutputMode": 0
    },

    "Display2": {
        /* Available interface type: LCD/HDMI/CVBS */
        "InterfaceType": "DP",
        "DisplayEnginePortId": 1,
        "OverrideFramebufferSize": 1,
        "FramebufferWidth": 1280,
        "FramebufferHeight": 720,
        "DpiX": 160,
        "DpiY": 160,
        "HotplugSupported": 0,
        "AfbcSupported": 0,
        "HardwareRotateSupported": 0,
        "BandwidthLimited": 338800,
        "DefaultOutputMode": 0
    }
}
```

重点说明一些常用的可修改配置项，其他不建议修改:

- PrimaryDisplay: 只能引用后边列出的 Display0、Display1、Display2，用于配置默认安卓主显 以及副显，若支持热插拔，可同时配置多个。 
- ExternalDisplay: 类似于 PrimaryDisplay，用于配置按安卓副显。 
- InterfaceType: 接口类型，只能为 LCD/HDMI/CVBS 之一。
- DisplayEnginePortId: 绑定到硬件 DE 的序号, 一般不修改。 
- OverrideFramebufferSize: 1 表示使用 FramebufferWidth 及 FramebufferHeight 作为 UI 分辨 率。 •
- HotplugSupported：是否支持热插拔。

### 显示动态配置接口实现

代码位于：`android/hardware/aw/display/libdisplayconfig`、`android/hardware/aw/display/interfaces `显示的一些支持动态配置的设置项在此完成支持，主要包括如亮度对比度饱和度等显示效果调整 以及显示切边，HDMI、CVBS 的输出分辨率等，除非产品支持 HDMI 或 CVBS，否则不会使用到该 部分代码。

### dispalyd

代码位于：`android/hardware/aw/display/libdisplayd` 主要用于对显示输出设备的热插拔、输出模式、多显策略等进行管理，需要设备支持 HDMI、 CVBS 等热插拔输出接口，否则该部分代码不会使用到。

