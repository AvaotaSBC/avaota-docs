# Android 红外遥控

### 内核配置

要支持红外遥控器(多遥控器适配)，需要打开下面的配置。

```
1.Device Drivers -> <*>Multimedia support
2.Device Drivers -> <*>Multimedia support ->[*]Remote controller decoders
3.Device Drivers -> <*>Multimedia support ->[*]Remote controller decoders -> <*>   Enable IR raw decoder for the NEC protocol 
4.Device Drivers -> <*>Multimedia support ->[*]Remote controller decoders -> <*>   Enable IR raw decoder for the RC-5 protocol 
5.Device Drivers -> <*>Multimedia support ->[*]Remote Controller devices 
6.Device Drivers -> <*>Multimedia support ->[*]Remote Controller devices -> <*>   SUNXI IR remote control 
7.Device Drivers -> <*>Multimedia support ->[*]Remote Controller devices -> <*>   SUNXI IR Legacy feature 
8.Device Drivers -> <*>Multimedia support ->[*]Remote Controller devices -> <*>   sunxi multi support  
```

### Device Tree配置

在soc节点下配置s_cir节点属性，其中ir_protocol_used属性配置红外协议，主要是NEC(0x0)和RC5(0x1)两种协议，这个属性可以不配置，不配置则默认使用NEC协议。

```
        s_cir0: s_cir@07040000 {
            compatible = "allwinner,s_cir";
            reg = <0x0 0x07040000 0x0 0x400>;
            interrupts = <GIC_SPI 109 IRQ_TYPE_LEVEL_HIGH>;
            pinctrl-names = "default";
            pinctrl-0 = <&s_cir0_pins_a>;
            clocks = <&clk_hosc>,<&clk_cpurcir>;
            supply = "vcc-pl";
            supply_vol = "3300000";
            status = "okay";
            ir_protocol_used = <0>
        };
```

### Android multi_ir配置

multi_ir是android的一个服务，用于适配多遥控器，如果需要添加此功能，需要在方案下添加以下配置。

```
# utils, add multi_ir to recovery
PRODUCT_PACKAGES += \
   multi_ir \
   multi_ir.recovery \
   libmultiir_jni \
   libmultiirservice \
```

### Android按键功能的映射文件

multi_ir的按键映文件主要放在keylayout 目录下，以customer_ir_xxxx.kl命名的文件是不同遥控器的映射文件，xxxx是底层驱动识别到的遥控器id，随着事件上报。sunxi-ir.kl则是multi_ir映射底层上报的键值为统一的scancode。sunxi-ir-uinput.kl是inputflinger所读取的映射文件。使用此功能时需要将这些映射文件放入到机器内部，应如下配置。

```
PRODUCT_COPY_FILES += \
    $(SUNXI_VENDOR_KL_DIR)/virtual-remote.kl:system/usr/keylayout/virtual-remote.kl \
    $(SUNXI_VENDOR_KL_DIR)/sunxi-ir.kl:system/usr/keylayout/sunxi-ir.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_9f00.kl:system/usr/keylayout/customer_ir_9f00.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_dd22.kl:system/usr/keylayout/customer_ir_dd22.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_fb04.kl:system/usr/keylayout/customer_ir_fb04.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_ff00.kl:system/usr/keylayout/customer_ir_ff00.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_4cb3.kl:system/usr/keylayout/customer_ir_4cb3.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_bc00.kl:system/usr/keylayout/customer_ir_bc00.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_fc00.kl:system/usr/keylayout/customer_ir_fc00.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_ir_2992.kl:system/usr/keylayout/customer_ir_2992.kl \
    $(SUNXI_VENDOR_KL_DIR)/customer_rc5_ir_04.kl:system/usr/keylayout/customer_rc5_ir_04.kl \
    $(SUNXI_VENDOR_KL_DIR)/sunxi-ir-uinput.kl:system/usr/keylayout/sunxi-ir-uinput.kl \
```

### 新增遥控器适配

当需要兼容新的遥控器，只要新增一个新的customer_ir_xxxx.kl文件，而文件主要内容应如下。

```
key 25   BACK
key 0    MENU
key 19   DPAD_CENTER
key 26   DPAD_DOWN
key 22   DPAD_UP
key 17   HOME
key 81   DPAD_LEFT
key 80   DPAD_RIGHT
key 24   VOLUME_UP
key 16   VOLUME_DOWN
key 15   APPS
key 67   CONTACTS
key 64   POWER
 ……
key 34    ZOOM_OUT
key 35    INFO
```

其中这三列字符串分别表示事件类型(KeyEvent)、scancode和事件lable。multi_ir是根据lable来进行映射的，sunxi-ir.kl中有所支持的所以事件lable。新增遥控器主要修改scancode。scancode的获取方式可以通过机器执行`getevent -l (sunxi-ir所对应的设备节点) `来获取，如下。

```
//getevent -l /dev/input/event1
EV_REP       REP_DELAY            00000000
EV_REP       REP_PERIOD           00000000
EV_MSC       MSC_SCAN             01fe0116
EV_SYN       SYN_REPORT           00000000
EV_MSC       MSC_SCAN             00fe0116
EV_SYN       SYN_REPORT           00000000
EV_MSC       MSC_SCAN             01fe0150
EV_SYN       SYN_REPORT           00000000
EV_MSC       MSC_SCAN             00fe0150
EV_SYN       SYN_REPORT           00000000
EV_MSC       MSC_SCAN             01fe011a
EV_SYN       SYN_REPORT           00000000
EV_MSC       MSC_SCAN             00fe011a
EV_SYN       SYN_REPORT           00000000
```

其中 `MSC_SCAN` 所上报的就是我们所要的数据，由8位16进制数据组成(32bit)，`24 ~31bit`表示按下状态，0表示松开，1表示按下。`8 ~ 23bit`表示设备id，根据这个id生成新的 `customer_ir_xxxx.kl`，`0 ~ 7bit`就是`scancode`，对应 `kl` 文件的第二列数据。

