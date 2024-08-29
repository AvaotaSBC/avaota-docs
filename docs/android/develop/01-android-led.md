# Android GPIO 控制

本模块创建一个 GPIO Java 类，以便 android 系统调用。GPIO Java 类又通过 JNI 调用 C/C++ 实现 LED 的控制。

+ GPIO Java 类

路径：frameworks/base/services/core/java/com/aw/server/Gpio.java

代码结构：

```
├── AwSystemServer.java
├── Gpio.java	// Gpio Java 类具体实现
├── MouseMode.java
└── Ntc.java
```

+ GPIO JNI

路径：vendor/aw/public/framework/gpio

代码结构：

```
├── Android.mk
├── gpio.mk			// 板级控制 gpio JNI 编译文件
└── jni
    ├── Android.mk	// JNI 编译文件
    └── com_softwinner_gpio.cpp	// JNI 具体实现
```

编译 Gpio JNI，需要将 gpio.mk，加入到板级编译文件中，当前默认所有方案均会编译，编译配置在 `device/softwinner/common/input/config.mk`。

```
$(call inherit-product-if-exists, vendor/aw/public/framework/gpio/gpio.mk)
```

如果只想在单独方案进行编译，则需要在单独方案 `input/config.mk` 文件加入以下内容，并且将`common/input/config.mk` 相关内容删除。

```
$(call inherit-product-if-exists, vendor/aw/public/framework/gpio/gpio.mk)
```

## 接口说明

### JAVA 接口

#### nativeWriteGpio

* 函数原型：```private static native int nativeWriteGpio(String path, boolean value);```

* 作用：给 GPIO 节点写值

* 参数：
  - path: LED 使能节点路径
  - value: true / false 对应着亮灭

* 返回：
  - 成功：返回 0。
  - 失败：返回 -1。

####  checkLed

* 函数原型：```private static boolean checkLed()```

* 作用：检查 LED 节点是否存在

* 返回：
  - 成功：至少存在一个 LED 节点，返回 ture。
  - 失败：一个 LED 节点均不存在，返回 false。

### setNormalLedOn

* 函数原型：```public static int setNormalLedOn(boolean on)```

* 作用：使能 /sys/class/gpio_sw/normal_led/light

* 参数：
  - on: 是否使能节点

* 返回：
  - 成功：返回 0。
  - 失败：返回 -1。

### setStandbyLedOn

* 函数原型：```public static int setStandbyLedOn(boolean on)```

* 作用：使能 /sys/class/gpio_sw/standby_led/light

* 参数：
  - on: 是否使能节点

* 返回：
  - 成功：返回 0。
  - 失败：返回 -1。

### setNetworkLedOn

* 函数原型：```public static int setNetworkLedOn(boolean on)```

* 作用：使能 /sys/class/gpio_sw/network_led/light

* 参数：
  - on: 是否使能节点

* 返回：
  - 成功：返回 0。
  - 失败：返回 -1。

### JNI 接口

### native_write_gpio

* 函数原型：```static jint native_write_gpio(JNIEnv *env, jobject clazz, jstring path, jboolean value)```

* 作用：给节点写值

* 参数：
  - path: 节点路径
  - value: true / false 对应着亮灭

* 返回：
  - 成功，返回 0。
  - 失败，返回 -1。

## 使用示例

```java
import com.softwinner.Gpio;
@Override
public int interceptKeyBeforeQueueing(KeyEvent event, int policyFlags) {
    int keyCode = event.getKeyCode();
    final boolean down = event.getAction() == KeyEvent.ACTION_DOWN;
    if (down) {
        Gpio.setNormalLedOn(false);	// 灭
    } else {
        Gpio.setNormalLedOn(true);	// 亮
    }

    return super.interceptKeyBeforeQueueing(event,policyFlags);
}
```

## FAQ

- 为什么传入 setxxxxLedOn 接口的参数为 true 时，灯灭；为 false ，灯亮

由于硬件电路的设计存在不同，部分电路给节点写 0 为灯亮，部分电路给节点写 1 为灯亮。因此出现该问题时，修改 Gpio JNI 参数即可，如下：

路径：vendor/aw/public/framework/gpio/jni/com_softwinner_gpio.cpp

+ 节点写 0 为灯亮，写 1 灯灭

```C
#define POWER_ON    "0"
#define POWER_OFF   "1"
```

+ 节点写 1 为灯亮，写 0 灯灭

```C
#define POWER_ON    "1"
#define POWER_OFF   "0"
```

- 出现 system_server: No implementation found for xxx 报错

在 logcat 中，可看到如下详细报错：

```
system_server: No implementation found for int com.softwinner.Gpio.nativeWriteGpio(java.lang.String, boolean)
```

说明没有将 Gpio JNI 的 gpio.mk 加入到方案中编译。

解决方法：在方案 input/config.mk 文件加入以下内容。

```
$(call inherit-product-if-exists, vendor/aw/public/framework/gpio/gpio.mk)
```
