# Android 方案配置


## 方案配置原则
1. 方案配置尽量以模块作为分界线，一个模块的配置尽量放在同一级目录下，使配置的层次结构清晰。
2. 方案配置尽量提炼出公共部分，公共部分放在 `common` 目录下，新增板级配置时只需修改定制化的内容。
3. 方案配置尽量在每个模块下提供配置说明/版本信息等。

## 方案配置结构
```
├── AndroidProducts.mk                  -- 添加引用方案mk及lunch名称
├── BoardConfig.mk                      -- 芯片平台共用的BoardConfig.mk
├── t527-avaota-a1                      -- 板级目录，命名与PRODUCT_DEVICE相同
│   ├── BoardConfig.mk                  -- 板级BoardConfig.mk
│   ├── camera                          -- 板级模块配置目录
│   │   ├── config.mk                   -- 模块配置文件，固定名称config.mk
│   │   ├── init.camera.rc              -- 模块init启动初始化rc文件
│   │   └── camera.cfg                  -- 模块其他配置文件
│   ├── input
│   └── system
│       ├── bootanimation.zip           -- 开机动画
│       ├── sys_partition.fex           -- 分区配置文件
│       └── vendor_ramdisk.modules      -- 启动必须模块，非必须的放在init.secondmodules.rc
├── t527_avaota_a1_arm64.mk             -- 板级总配置文件，主要配置方案信息及一些配置开关
```

注意事项：

模块初始化文件尽量使用 `init.${module}.rc` 的命名规则，并在模块 `config.mk` 中拷贝到 `vendor/etc/init` 目录中。

板级BoardConfig.mk主要配置kernel cmdline及板级外设配置。

## 新增一个模块

在common或者板级目录下创建一个子目录，新建一个config.mk作为该模块配置，模块配置会自动加载：

```makefile
LOCAL_MODULE_PATH := $(shell dirname $(lastword $(MAKEFILE_LIST)))

# copy files
PRODUCT_COPY_FILES += \
    $(LOCAL_MODULE_PATH)/model.cfg:$(TARGET_COPY_OUT_VENDOR)/etc/model.cfg
```

## 新增一个方案

```
# cd android
# source ./build/envsetup.sh
# lunch（选择对应平台公版方案配置）
# clone
```

根据提示输入新增方案信息：
```
please enter PRODUCT_DEVICE({device-name}): newdevice
please enter PRODUCT_NAME({product-name}): newproduct
please enter PRODUCT_BOARD({BOARD}): newboard
please enter PRODUCT_MODEL({MODEL_NAME}): NEWMODEL
please enter DENSITY(160): 320
```

完成以上操作后，将会新增`newdevice`目录配置及`newproduct.mk`文件，配置是参考`lunch`的参考方案。
可根据实际外设及方案需求，修改方案目录中相关的配置及目录。