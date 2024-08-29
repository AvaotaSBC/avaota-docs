# Android 定制化修改

## 修改启动LOGO

启动LOGO为初始引导阶段的LOGO。

将默认的启动logo放入位置：`longan/device/config/chips/{IC}/configs/{BOARD}/bootlogo.bmp`。

如有多种用途的logo，可按照使用用途等放到该目录下，如适用于go版本的logo，可将其保存在`longan/device/config/chips/{IC}/configs/{BOARD}/bootlogo-go.bmp`

同时，Android 对应方案配置应添加如下配置，以表明使用该bootlogo：

```
BOARD_ADD_PACK_CONFIG += longan/device/config/chips/$(TARGET_BOARD_IC)/boot-resource/boot-resource/bootlogo-go.bmp:boot-resource/bootlogo.bmp
```

## 修改开机动画

开机动画的目录通过如下Makefile变量定义：

```
device/softwinner/{PRODUCT}/common/media/config.mk:
  BOOTANIMATION_CONFIG_PATH := $(LOCAL_MODULE_PATH)/bootanimation
```

默认路径为 `device/softwinner/{PRODUCT}/common/media/bootanimation/`

可修改 `BOOTANIMATION_CONFIG_PATH` 的值切换 `bootanimation` 系统的找寻位置。

将动画放入：`bootanimation.zip` 放入以上定义的路径中。

::: note
Android13开始支持在OTA自动升级系统时，夜晚系统自动重启过程中降低对用户的干扰，要求这时的开机画面应该以暗色调为主。如果原始开机动画文件以亮色调为主，可另设暗色调开机动画，文件命名为bootanimation_dark.zip，放入以上定义的路径中。
:::

### 文件结构

`bootanimation.zip` 包含part0 part1文件夹和desc.txt文件，part0，part1 等文件夹里面放的是动画拆分的图片，格式为png或jpg。

```
|- desc.txt
|- audio_conf.txt
|- part0
    |- part000.png
    |- part001.png
    |- part0….png
    |- audio.wav(可选)
    |- trim.txt(可选)
|- part1
    |- part100.png
    |- part101.png
    |- part1….png
    |- audio.wav(可选)
    |- trim.txt(可选)
|- part...N
```

### desc.txt配置文件

```
第一行：
WIDTH HEIGHT FPS
后面每行，表示部分part动画：
TYPE: 类型（p：播放直到开机完成，c：播放完整动画）
COUNT: 循环次数，0表示无限循环直到开机结束
PAUSE: part结束后暂停帧数
PATH: 文件加路径（如：part0）
RGBHEX: （可选）背景颜色：#RRGGBB
CLOCK: （可选）画当前时间的y坐标(for watches)
```

例如：

```
800 480 15
p 1 0 part0
p 0 0 part1
```

说明：第一行：800为宽度，480为高度，15为帧数。第二行开始p为标志符，接下来第二列为循环次数（0为无限循环），第三项为两次循环之间间隔的帧数，第四项为对应的目录名。播放动画时会按照图片文件名顺序自动播放。

### 开机音乐

如需开机音乐，将开机音乐放入part0目录中，命名为audio.wav。在根目录中加入audio_conf.txt，复制原有动画配置即可。

### 优化png图片

由于图片占用内存较大，需要做一些优化来减少图片资源占用及加快读取时间，可参考源码中frameworks/base/cmds/bootanimation/FORMAT.md文件进行优化，如下命令可以无损压缩图片。

```
for fn in *.png ; do zopflipng -m ${fn} ${fn}.new && mv -f ${fn}.new ${fn}; done
```

### 打包bootanimation.zip

windows使用winrar打包，选择ZIP格式，压缩标准要选“储存”；

linux系统下使用命令：

```
$ zip -0qry -i \*.txt \*.png \*.wav @ bootanimation.zip *.txt part*。
```

:::warning
linux命令使用-0指定压缩等级为最低等级stored，即只归档不压缩，否则可能由于包格式问题引起动画显示为黑屏。
:::

## 修改充电图标

在android目录下执行。

```
python bootable/recovery/interlace-frames.py battery1.png battery2.png ... batteryn.png battery_scale.png
```

然后将生成的battery_scale.png替换device/softwinner/common/health/images/目录下battery_scale.png  。
其中[battery1.png battery2.png ... batteryn.png ]为充电动画的图标。  
如图片数量有变化则需修改配置device/softwinner/common/health/animation.txt。

## 定制recovery功能

Recovery是Android的专用升级模式，用于对android自身进行更新；进入recovery模式的方法是，在android系统开机时，按住一个特定按键，则会自动进入android的recovery模式。

### 键值的查看

按键是通过AD转换的原理制成。当用户按下某个按键的时候，会得到这个按键对应的AD转换的值。同时，所有的按键的键值都不相同，并且，键值之间都有一定的间隔，没有相邻。比如，键值可能是5,10,15,20，但是不可能是5,11,12,13。

为了方便用户查看不同按键的键值，这种方法要求连接上串口使用，因此适合于开发阶段使用。具体步骤是。

把小机和PC通过串口线连接起来，小机开机时按住对应按键，此时会串口屏幕上打印对应按键的键值。打印信息如下代码所示。

```
key value = 8
key value = 8
key value = 8
key value = 63
```

由于AD采样的速度非常快，所以同一个按键按下，屏幕上会出现多个值。用户可以看出，这个按键的键值是8。最后出现的63是松开按键的时候的采用，是需要去掉的干扰数据。因此，用户查看按键键值的时候只要关注前面打印出的数值，后面出现的应该忽略不计。

### 按键选择

通常情况下，一块方案板上的按键个数不同，或者排列不同，这都导致了方案商在选择作为开机阶段 `recovery` 功能的按键有所不同。因此，系统中提供了一种方法用于选择进入`recovery` 模式的按键。

在 `longan/device/config/chips/{IC}/configs/{BOARD}/uboot-board.dts` 配置脚本中，提供了一项配置，用于选择按键的键值，如下所示。

```
&fastboot_key {
    device_type = "fastboot_key";
    key_max = <42>;
    key_min = <38>;
};

&recovery_key {
    device_type = "recovery_key";
    key_max = <31>;
    key_min = <28>;
};
```

它表示，所选择用于作为recovery功能的按键的键值范围落在key_min到key_max之间，即4到6之间。由于所有按键的选择都可以通过前面介绍的方法查看，因此，假设用户要选的按键是a，用户这里选择配置的方法是。

1. 按照前面介绍的方法，读出所有按键的键值；
2. 读出a的键值a1，同时取出两个相邻于a的键值，记为b1和c1，b1>c1；
3. 计算出(a1 + b1)/2，(a1 + c1)/2，分别填写到key_max和key_min处；
4. 如果a1刚好是所有按键的最小值，则取key_min为0；如果a1刚好是所有按键的最大值，则取key_max为63；

经过以上的步骤，就可以选择一个特定的按键进入recovery模式。取了一个平均值的原因是考虑到长时间的使用，电阻的阻值可能会略有变化导致键值变化，取范围值就可以兼容这种阻值变化带来的键值变化。

在系统启动时，按住设定的特定按键进入recovery模式，进入该模式后，可以选择升级文件升级。

## 默认壁纸设置

替换文件 `frameworks/base/core/res/res/drawable-swxxxdp-nodpi/default_wallpaper.png`。
:::note
可通过overlay方式替换。
:::

## 添加壁纸

准备壁纸及壁纸的缩略图放进壁纸存放目录 `packages/apps/WallpaperPicker2/res/drawable-nodpi` ，并按照文件夹内文件命名，分别为 `wallpaper_xxx.png` 与 `wallpaper_xxx_small.png`。

在 `platform/packages/apps/WallpaperPicker2/res/values-nodpi/wallpapers.xml` 中添加该壁纸索引，如下。

```
<resources>
    <string-array name="wallpapers" translatable="false">
        <item>wallpaper_00</item>
        <item>wallpaper_01</item>
        ……
        <item>wallpaper_xxx</item>
    </string-array>
</resources>
```

注：可通过overlay方式修改，具体请参照overlay说明。

## Launcher默认图标和快捷栏设置

修改文件 `platform/packages/apps/Launcher3/res/xml/default_workspace_5x6.xml`，文件中各配置项含义如下。

| 设置名      | 意义                                               |
| ----------- | -------------------------------------------------- |
| packageName | 所运行的APP的package名。                           |
| className   | 该APP的Activity的class名(packageName.ActivityName) |
| screen      | 表示在第几个，根据显示的个数决定                   |
| x           | 放在该屏的第几行                                   |
| y           | 放在该屏的第几列                                   |

注：可通过overlay方式修改，具体请参照 overlay 说明。

