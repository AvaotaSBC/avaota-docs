# Android Overlay 机制

## 方案文件替换

Android方案中有时候需要定制化一些需求，如替换开机LOGO、env.cfg、分区配置等，除了可在longan目录下对应的路径下替换外，android方案也提供了接口进行替换。其原理是在pack操作时，将需要替换的文件拷贝到`longan/out/pack_out`目录下。

在android方案中通过 `BOARD_ADD_PACK_CONFIG` 配置来指定需要替换的文件。

```
# BoardConfig.mk
BOARD_ADD_PACK_CONFIG += $(TARGET_DEVICE_DIR)/system/sys_partition.fex
BOARD_ADD_PACK_CONFIG += $(PRODUCT_PLATFORM_PATH)/common/system/b1_env.cfg:env.cfg
```

通过这种方式替换的文件只能是会被拷贝到 `longan/out/pack_out` 目录下的文件。格式为：`local_filepath[:copy_filename]`。

## overlay说明

Android overlay 机制允许在不修改apk或者framework源代码的情况下，实现资源的定制。  
以下几类能够通过overlay机制定义。

1. Configurations (string, bool, bool-array)
2. Localization (string, string-array)
3. UI Appearance (color, drawable, layout, style, theme, animation)
4. Raw resources (audio, video, xml)  
   更详细的资源文件可浏览[android网站](http://developer.android.com/guide/topics/resources/available-resources.html)

### 为产品添加Overlay目录

有两种不同的overlay目录定义。

1. `PRODUCT_PACKAGE_OVERLAYS`    用于指定产品。
2. `DEVICE_PACKAGE_OVERLAYS`   用于同一设备模型的一系列产品。

如果包含同一资源，那么 `PRODUCT_PACKAGE_OVERLAYS` 的内容 将覆盖`DEVICE_PACKAGE_OVERLAYS` 中的内容 。如果要定义多个overlays目录，需要用空格隔开，同一资源的定义，将使用先定义的目录中的资源。

在方案目录下创建 `common/overlay` 和 `{device-name}/overlay` 目录，分别用于 `device` 通用及 `product` 使用的 `overlay` 文件夹。  

### 改变mk文件来添加overlays的编译项

在文件 `common/overlay/config.mk` 和 `{device-name}/overlay/config.mk`中分别添加。

```
DEVICE_PACKAGE_OVERLAYS := \
    $(LOCAL_MODULE_PATH)/overlay \
    $(DEVICE_PACKAGE_OVERLAYS)   

PRODUCT_PACKAGE_OVERLAYS := \
    $(LOCAL_MODULE_PATH)/overlay \
    $(PRODUCT_PACKAGE_OVERLAYS)
```

注：必须加上 `$(PRODUCT_PACKAGE_OVERLAYS)` 变量否则将找不到默认资源。

### 在overlay目录下创建资源文件

在overlay目录下创建和要替换资源所在文件相同的路径的文件，此路径是相对于`android platform`目录。如替换`framework-res`路径为：`platform/framework/base/core/res/res/values/config.xml`中的某一项，则在overlay中创建对应的路径：`overlay/framework/base/core/res/res/values/config.xml` 并添加要修改的一向配置，如：

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <bool name="config_showNavigationBar">true</bool>
</resources>
```
