# Android 预装应用

##  预安装不可卸载 APK

预安装不可卸载的 APK（Android 应用程序包）通常指的是由设备制造商或运营商预先在设备上安装并且无法通过常规方式卸载的应用程序。这些应用程序通常被称为“预装应用”或“系统应用”。

对于设备制造商和运营商来说，预安装不可卸载的 APK 具有以下作用：

1. 促进合作伙伴关系：设备制造商和运营商可以与应用开发商合作，在设备出厂时预装其应用程序，从而为双方带来收益。

2. 提供特定功能：一些预装应用程序可能为设备提供特定的功能或服务，比如定制的用户界面、云存储服务等。

3. 品牌推广：设备制造商和运营商可以通过预装应用程序来推广自己的品牌或推动特定的服务。

在目录 `vendor/aw/public/package/apk` 中创建一个目录存放对应 APK。将 `apk` 放入该 目录中。在该目录中创建 `Android.mk` 文件，并编辑：

```
# Example
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE := APK_MODULE_NAME（模块的唯一名字）
LOCAL_MODULE_CLASS := APPS
LOCAL_MODULE_TAGS := optional
LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
LOCAL_CERTIFICATE := PRESIGNED（签名方式）
LOCAL_SRC_FILES := $(LOCAL_MODULE).apk 
include $(BUILD_PREBUILT)
```

在方案 `mk` 文件（`device/softwinner/saturn/t527-avaota-a1/device-common.mk`）中 `PRODUCT_PACKAGES`项中加入：

```
PRODUCT_PACKAGES += APK_MODULE_NAME（apk 模块名字，预装多个 apk 用空
格隔开）
```

## 预安装可卸载 apk

在目录 `vendor/semidrive/modules` 中创建一个目录存放对应 APK。将 apk 放入该目 录中。在该目录中创建 `Android.mk` 文件，并编辑：

```
LOCAL_PATH := $(call my-dir)
LOCAL_MODULE := APK_MODULE_NAME （模块的唯一名字）
LOCAL_SRC_FILES := $(LOCAL_MODULE).apk
$(shell rm -rf $(TARGET_OUT_VENDOR)/preinstall/$(LOCAL_MODULE))
$(shell mkdir -p $(TARGET_OUT_VENDOR)/preinstall/$(LOCAL_MODULE))
$(shell cp $(LOCAL_PATH)/$(LOCAL_SRC_FILES) $(TARGET_OUT_VENDOR)/preinst
all/$(LOCAL_MODULE))
```

