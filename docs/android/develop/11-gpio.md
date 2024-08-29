# Android GPIO 控制

### 定义需要控制的GPIO

在board.dts中的配置如下：

```c
&gpio_para { 
    gpio-pins = <&pio PH 6 GPIO_ACTIVE_LOW>, <&pio PH 9 GPIO_ACTIVE_LOW>; 	//设备使用的pin脚配置<控制器 引脚号 有效电平> 
    init-status = <GPIO_ACTIVE_LOW>, <GPIO_ACTIVE_LOW>; 					//初始状态 
    pin-names = "normal_led", "standby_led"; 								//设备使用的pin脚名称 
    gpio-sdcard-reused; 													//是否用于卡打印灯的控制，与sdcard复用gpio 
    status = "okay"; 														//设备是否使用 
};
```

### 控制GPIO的接口

添加了GPIO的配置后，会在sys文件系统下产生节点。`sys/class/gpio_sw/ `

```
├── normal_led 		//normal_led灯控制 
│ ├── light 		//控制灯的状态 
│ ├── cfg		 	//设置/读取gpio的功能 
│ ├── drv 			//设置/读取gpio的驱动等级 
│ ├── pull 			//设置/读取gpio电阻上拉或者下拉 
│ ├── data 			//设置/读取gpio的电平状态 
├── standby_led 	//standby_led灯控制 
│ ├── light 
│ ├── cfg 
│ ├── drv 
│ ├── pull 
│ ├── data
```

对于目录下的normal_led/standby_led节点下的light节点写入0，将导致输出低电平，写入1，将导致输出高电平，为了方便代码中进行操作，有提供java以及C++的接口。

点亮normal_led：

```
echo 1 > /sys/class/gpio_sw/normal_led/light 
```

熄灭normal_led：

```
echo 0 > /sys/class/gpio_sw/normal_led/light
```

### java层的接口

java控制GPIO的接口定义在文件Gpio.java中，其路径为：

```
platform/frameworks/base/services/core/java/com/aw/server/Gpio.java。
```

在java代码中 `import com.softwinner.Gpio;` 的 `setNormalLedOn(bool)` 和 `setStandbyLedOn(bool)` 接口方便的操作Led的亮灭。
提供的接口如下。

```java
public static int setNormalLedOn(boolean on);
public static int setStandbyLedOn(boolean on);
public static int setNetworkLedOn(boolean on) ;
public static int writeGpio(char group, int num, int value);
public static int readGpio(char group, int num) ;
public static int setPull(char group, int num, int value);
public static int getPull(char group, int num);
public static int setDrvLevel(char group, int num, int value);
public static int getDrvLevel(char group, int num);
public static int setMulSel(char group, int num, int value);
public static int getMulSel(char group, int num);
private static String composePinPath(char group, int num);
```

### c++层的接口

C++层的操作函数是对内核接口的简单封装，具体的接口如下。

```cpp
int readData(const char * filePath);
int writeData(const char *data, int count, const char *filePath);
```

```txt
cfg：设置/读取gpio的功能
    0x00：input
    0x01：output
pull：设置/读取gpio电阻上拉或者下拉
    0x00：关闭上拉/下拉
    0x01：上拉
    0x02：下拉
    0x03：保留
drv：设置/读取gpio的驱动等级
    0x00：level 0
    0x01：level 1
    0x02：level 2
    0x03：level 3
data：设置/读取gpio的电平状态
    0x00：低电平
    0x01：高电平
```

在C语言中可以用read和write函数直接操作这4个文件。具体的范例可参考文件`vendor/aw/homlet/framework/gpio/libgpio/GpioService.cpp`中的代码。