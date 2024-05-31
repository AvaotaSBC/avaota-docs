# GPIO - Pinctrl 子系统

Linux Pinctrl（引脚控制）子系统是Linux内核中用于管理和控制硬件引脚（GPIO、I2C、SPI等）的一个子系统。它允许Linux内核与底层硬件交互，配置和控制系统中的各种引脚以实现特定的功能。以下是Linux Pinctrl子系统的一些关键特性和组成部分：

1. **通用性**: Linux Pinctrl子系统设计为通用的，可用于广泛的处理器体系结构和硬件平台。这使得它成为各种嵌入式系统和单板计算机的理想选择。

2. **引脚描述符（pinctrl_desc）**: Pinctrl子系统使用引脚描述符来表示引脚的抽象。每个引脚描述符包含有关引脚的信息，如引脚号、功能、配置参数等。

3. **引脚控制器（pinctrl_controller）**: 引脚控制器是Pinctrl子系统的核心组件之一，负责管理和控制一组相关的引脚。每个引脚控制器对应于特定的硬件模块或芯片，可以配置引脚以实现不同的功能。

4. **引脚状态（pinctrl_state）**: 引脚状态表示引脚的特定配置和状态。通过切换引脚状态，可以实现不同的功能或操作。

5. **设备树绑定（Device Tree Bindings）**: 在Linux系统中，设备树通常用于描述硬件平台的信息。Pinctrl子系统使用设备树绑定来将硬件描述符与设备树节点相关联，以实现引脚的配置和控制。

6. **用户空间接口**: Linux Pinctrl子系统提供了用户空间接口，允许用户空间程序通过sysfs接口或ioctl系统调用与Pinctrl子系统进行交互，配置和控制系统中的引脚。

## 模块配置

### 驱动配置

```
Pinctrl Drivers ->
	<*> Pinctrl Support for Allwinner SoCs
	<*>   Pinctrl Debugfs Driver
	< >   SUN8IW20 PIO // 根据芯片选择
	<*>   SUN55IW3 PIO
```

### 设备树配置

对于 Pinctrl，设备树公共配置如下

```c
pio: pinctrl@2000000 {
	#address-cells = <1>;
	compatible = "allwinner,sun55iw3-pinctrl";
	/*
	* The reg control i2s0/dmic routes to cpus-pad or sys-pad
	* 0: use cpus pad, 1: use sys pad
	*/
	reg = <0x0 0x02000000 0x0 0x800>,
		<0x0 0x07010374 0x0 0x4>,
		<0x0 0x07010378 0x0 0x4>;
	reg-names = "pio", "i2s0", "dmic";
	interrupts = <GIC_SPI 69 IRQ_TYPE_LEVEL_HIGH>,       /* GPIOB */
				   <GIC_SPI 71 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOC */
				   <GIC_SPI 73 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOD */
				   <GIC_SPI 75 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOE */
				   <GIC_SPI 77 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOF */
				   <GIC_SPI 79 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOG */
				   <GIC_SPI 81 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOH */
				   <GIC_SPI 83 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOI */
				   <GIC_SPI 85 IRQ_TYPE_LEVEL_HIGH>,     /* GPIOJ */
				   <GIC_SPI 140 IRQ_TYPE_LEVEL_HIGH>;    /* GPIOK */
	clocks = <&ccu CLK_APB1>, <&dcxo24M>, <&rtc_ccu CLK_OSC32K>;
	clock-names = "apb", "hosc", "losc";
	gpio-controller;
	#gpio-cells = <3>;
	interrupt-controller;
	#interrupt-cells = <3>;
};
```

部分平台存在两个 GPIO 域，一般来说 GPIO L 前的是 PIO 域，从 GPIO L 开始之后的是 RPIO 域，配置如下

```c
r_pio: pinctrl@7022000 {
	#address-cells = <1>;
	compatible = "allwinner,sun55iw3-r-pinctrl";
	reg = <0x0 0x07022000 0x0 0x800>,
		<0x0 0x07010374 0x0 0x4>,
		<0x0 0x07010378 0x0 0x4>;
	/*
	* The reg control i2s0/dmic routes to cpus-pad or sys-pad
	* 0: use cpus pad, 1: use sys pad
	*/
	reg-names = "r-pio", "i2s0", "dmic";
	interrupts = <GIC_SPI 159 IRQ_TYPE_LEVEL_HIGH>,      /* GPIOL */
				  <GIC_SPI 161 IRQ_TYPE_LEVEL_HIGH>;     /* GPIOM */
	clocks = <&ccu CLK_R_APBS1>, <&dcxo24M>, <&rtc_ccu CLK_OSC32K>;
	clock-names = "apb", "hosc", "losc";
	gpio-controller;
	#gpio-cells = <3>;
	interrupt-controller;
	#interrupt-cells = <3>;
};
```

#### 配置通用GPIO功能/中断功能

```c
soc{
	gpiokey {
		device_type = "gpiokey";
		compatible = "gpio-keys";

		ok_key {
			device_type = "ok_key";
			label = "ok_key";
			gpios = <&pio PA 4 GPIO_ACTIVE_HIGH>;
			linux,input-type = "1>";
			linux,code = <0x1c>;
			wakeup-source = <0x1>;
		};
	};
};
```

```c
gpios = <&pio  PA 4 GPIO_ACTIVE_HIGH>;
            |   |   |
            |   |   `-------------------gpio active时状态，如果需要上下拉，还可以或上GPIO_PULL_UP、GPIO_PULL_DOWN标志
            |   `-----------------------哪个bank
            `---------------------------指向哪个pio，属于cpus要用&r_pio
```

#### 配置设备引脚

```c
&pio {
    pwm0_4_pin_active: pwm0_4@0 {
		pins = "PI3";
		function = "pwm0_4";
	};

	pwm0_4_pin_sleep: pwm0_4@1 {
		pins = "PI3";
		function = "gpio_in";
		bias-pull-down;
	};
};

&pwm0_4 {
	pinctrl-names = "active", "sleep";
	pinctrl-0 = <&pwm0_4_pin_active>;
	pinctrl-1 = <&pwm0_4_pin_sleep>;
	status = "okay";
};
```

> `pinctrl-0` 对应 `pinctrl-names` 中的 `default`，即模块正常工作模式下对应的pin配置。
>
> `pinctrl-1`对应`pinctrl-names`中的`sleep`，即模块休眠模式下对应的pin配置。



## 模块接口


### pinctrl_get

* 函数原型：```struct pinctrl *pinctrl_get(struct device *dev);```

* 作用：获取设备的pin操作句柄，所有pin操作必须基于此pinctrl句柄。

* 参数：
  - dev：指向申请pin操作句柄的设备句柄。

* 返回：
  - 成功，返回pinctrl句柄。
  - 失败，返回NULL。

### pinctrl_put

* 函数原型：```void pinctrl_put(struct pinctrl *p)```

* 作用：释放pinctrl句柄，必须与pinctrl_get配对使用。

* 参数：
  - p：指向释放的pinctrl句柄。

* 返回：
  - 没有返回值。

### devm_pinctrl_get

* 函数原型：```struct pinctrl *devm_pinctrl_get(struct device *dev)```

* 作用：根据设备获取pin操作句柄，所有pin操作必须基于此pinctrl句柄，与pinctrl_get功能完全一样，只是devm_pinctrl_get会将申请到的pinctrl句柄做记录，绑定到设备句柄信息中。设备驱动申请pin资源， 推荐优先使用devm_pinctrl_get接口。

* 参数：
  - dev：指向申请pin操作句柄的设备句柄。

* 返回：
  - 成功，返回pinctrl句柄。
  - 失败，返回NULL。

### devm_pinctrl_put

* 函数原型：```void devm_pinctrl_put(struct pinctrl *p)```

* 作用：释放pinctrl句柄，必须与devm_pinctrl_get配对使用。

* 参数：
  - p：指向释放的pinctrl句柄。

* 返回：
  - 没有返回值。

### pinctrl_lookup_state

* 函数原型：```struct pinctrl_state *pinctrl_lookup_state(struct pinctrl *p, const char *name)```

* 作用：根据pin操作句柄，查找state状态句柄。

* 参数：
  - p：指向要操作的pinctrl句柄。
  - name：指向状态名称，如"default"、"sleep"等。

* 返回：
  - 成功，返回执行pin 状态的句柄struct pinctrl_state \*。
  - 失败，返回NULL。

### pinctrl_select_state

* 函数原型：```int pinctrl_select_state(struct pinctrl *p, struct pinctrl_state *s)```

* 作用：将pin句柄对应的pinctrl设置为state句柄对应的状态。

* 参数：
  - p：指向要操作的pinctrl句柄。
  - s：指向state 句柄。

* 返回：
  - 成功，返回0。
  - 失败，返回错误码。

### devm_pinctrl_get_select

* 函数原型：```struct pinctrl *devm_pinctrl_get_select(struct device *dev, const char *name)```

* 作用：获取设备的pin操作句柄，并将句柄设定为指定状态。

* 参数：
  - dev：指向管理pin操作句柄的设备句柄。
  - name：要设置的state名称，如"default"、"sleep"等。

* 返回：
  - 成功，返回pinctrl句柄。
  - 失败，返回NULL。

### devm_pinctrl_get_select_default

* 函数原型：```struct pinctrl *devm_pinctrl_get_select_default(struct device *dev)```

* 作用：获取设备的pin操作句柄，并将句柄设定为默认状态。

* 参数：
  - dev：指向管理pin操作句柄的设备句柄。

* 返回：
  - 成功，返回pinctrl句柄。
  - 失败，返回NULL。

### gpio_request

* 函数原型：```int gpio_request(unsigned gpio, const char *label)```

* 作用：申请gpio，获取gpio的访问权。

* 参数：
  - gpio：gpio编号。
  - label：gpio名称，可以为NULL。

* 返回：
  - 成功，返回0。
  - 失败，返回错误码。

### gpio_free

* 函数原型：```void gpio_free(unsigned gpio)```

* 作用：释放gpio。

* 参数：
  - gpio：gpio编号。

* 返回：
  - 无返回值。

### gpio_direction_input

* 函数原型：```int gpio_direction_input(unsigned gpio)```

* 作用：设置gpio为input。

* 参数：
  - gpio：gpio编号。

* 返回：
  - 成功，返回0。
  - 失败，返回错误码。

### gpio_direction_output

* 函数原型：```int gpio_direction_output(unsigned gpio, int value)```

* 作用：设置gpio为output。

* 参数：
  - gpio：gpio编号。
  - value：期望设置的gpio电平值，非0表示高, 0表示低。

* 返回：
  - 成功，返回0.
  - 失败，返回错误码。

### __gpio_get_value

* 函数原型：```int __gpio_get_value(unsigned gpio)```

* 作用：获取gpio电平值(gpio已为input/output状态)。

* 参数：
  - gpio：gpio编号。

* 返回：
  - 返回gpio对应的电平逻辑，1表示高, 0表示低。

### __gpio_set_value

* 函数原型：```void __gpio_set_value(unsigned gpio, int value)```

* 作用：设置gpio电平值(gpio已为input/output状态)。

* 参数：
  - gpio：gpio编号。
  - value：期望设置的gpio电平值，非0表示高, 0表示低。

* 返回：
  - 无返回值

### of_get_named_gpio

* 函数原型：```int of_get_named_gpio(struct device_node *np, const char *propname, int index)```

* 作用：通过名称从dts解析gpio属性并返回gpio编号。

* 参数：
  - np：指向使用gpio的设备结点。
  - propname：dts中属性的名称。
  - index：dts中gpio属性的索引值。

* 返回：
  - 成功，返回gpio编号。
  - 失败，返回错误码。

### of_get_named_gpio_flags

* 函数原型：```int of_get_named_gpio_flags(struct device_node *np, const char *list_name, int index, enum of_gpio_flags *flags)```

* 作用：通过名称从dts解析gpio属性并返回gpio编号。

* 参数：
  - np：指向使用gpio的设备结点。
  - propname：dts中属性的名称。
  - index：dts中gpio属性的索引值
  - flags：输入、输出信息`of_gpio_flags`

* 返回：
  - 成功，返回gpio编号。
  - 失败，返回错误码。

## 使用示例

### 配置设备引脚

一般设备驱动只需要使用一个接口 `devm_pinctrl_get_select_default` 就可以申请到设备所有pin资源。

```c
static int pin_req_demo(struct platform_device *pdev)
{
	struct pinctrl *pinctrl;
	pinctrl = devm_pinctrl_get_select_default(&pdev->dev);
	if (IS_ERR_OR_NULL(pinctrl))
		return -EINVAL;
	return 0;
}
```

### 获取GPIO号

```c
static int pin_req_demo(struct platform_device *pdev)
{
	struct device *dev = &pdev->dev;
	struct device_node *np = dev->of_node;
	unsigned int gpio;
	gpio = of_get_named_gpio(np, "vdevice_3", 0);
	if (!gpio_is_valid(gpio)) {
		if (gpio != -EPROBE_DEFER)
			dev_err(dev, "Error getting vdevice_3\n");
		return gpio;
	}
}
```

### GPIO属性配置

通过`pin_config_set`/`pin_config_get`/`pin_config_group_set`/`pin_config_group_get`接口单独控制指定pin或group的相关属性。

```c
static int pctrltest_request_all_resource(void)
{
    struct device *dev;
    struct device_node *node;
    struct pinctrl *pinctrl;
    struct sunxi_gpio_config *gpio_list = NULL;
    struct sunxi_gpio_config *gpio_cfg;
    unsigned gpio_count = 0;
    unsigned gpio_index;
    int ret;

    dev = bus_find_device_by_name(&platform_bus_type, NULL, sunxi_ptest_data->dev_name);
    if (!dev) {
        pr_warn("find device [%s] failed...\n", sunxi_ptest_data->dev_name);
        return -EINVAL;
    }

    node = of_find_node_by_type(NULL, dev_name(dev));
    if (!node) {
        pr_warn("find node for device [%s] failed...\n", dev_name(dev));
        return -EINVAL;
    }
    dev->of_node = node;

    pr_warn("++++++++++++++++++++++++++++%s++++++++++++++++++++++++++++\n", __func__);
    pr_warn("device[%s] all pin resource we want to request\n", dev_name(dev));
    pr_warn("-----------------------------------------------\n");

    pr_warn("step1: request pin all resource.\n");
    pinctrl = devm_pinctrl_get_select_default(dev);
    if (IS_ERR_OR_NULL(pinctrl)) {
        pr_warn("request pinctrl handle for device [%s] failed...\n", dev_name(dev));
        return -EINVAL;
    }

    pr_warn("step2: get device[%s] pin count.\n", dev_name(dev));
    ret = dt_get_gpio_list(node, &gpio_list, &gpio_count);
    if (ret < 0 || gpio_count == 0) {
        pr_warn(" devices own 0 pin resource or look for main key failed!\n");
        return -EINVAL;
    }

    pr_warn("step3: get device[%s] pin configure and check.\n", dev_name(dev));
    for (gpio_index = 0; gpio_index < gpio_count; gpio_index++) {
        gpio_cfg = &gpio_list[gpio_index];

        // 配置GPIO功能
        ret = pinctrl_gpio_set_config(dev, gpio_cfg->name, gpio_cfg->mulsel);
        if (ret < 0) {
            pr_warn("failed to set function config for pin %s\n", gpio_cfg->name);
            return -EINVAL;
        }

        // 配置GPIO上下拉
        if (gpio_cfg->pull != GPIO_PULL_DEFAULT) {
            ret = pinctrl_gpio_set_config(dev, gpio_cfg->name, gpio_cfg->pull);
            if (ret < 0) {
                pr_warn("failed to set pull config for pin %s\n", gpio_cfg->name);
                return -EINVAL;
            }
        }

        // 配置GPIO驱动能力
        if (gpio_cfg->drive != GPIO_DRVLVL_DEFAULT) {
            ret = pinctrl_gpio_set_config(dev, gpio_cfg->name, gpio_cfg->drive);
            if (ret < 0) {
                pr_warn("failed to set drive level config for pin %s\n", gpio_cfg->name);
                return -EINVAL;
            }
        }

        // 配置GPIO初始状态
        if (gpio_cfg->data != GPIO_DATA_DEFAULT) {
            ret = pinctrl_gpio_set_config(dev, gpio_cfg->name, gpio_cfg->data);
            if (ret < 0) {
                pr_warn("failed to set initial data config for pin %s\n", gpio_cfg->name);
                return -EINVAL;
            }
        }
    }

    pr_warn("-----------------------------------------------\n");
    pr_warn("test pinctrl request all resource success!\n");
    pr_warn("++++++++++++++++++++++++++++end++++++++++++++++++++++++++++\n\n");
    return 0;
}
```

### GPIO 中断配置

#### 驱动申请中断

设备驱动只需要通过`gpio_to_irq`获取虚拟中断号后，其他均可以按标准irq接口操作。

```c
static int gpio_eint_demo(struct platform_device *pdev)
{
    struct device *dev = &pdev->dev;
    int virq;
    int ret;
    /* map the virq of gpio */
    virq = gpio_to_irq(GPIOA(0));
    if (IS_ERR_VALUE(virq)) {
        pr_warn("map gpio [%d] to virq failed, errno = %d\n",
        GPIOA(0), virq);
        return -EINVAL;
    }
    pr_debug("gpio [%d] map to virq [%d] ok\n", GPIOA(0), virq);
    /* request virq, set virq type to high level trigger */
    ret = devm_request_irq(dev, virq, sunxi_gpio_irq_test_handler,
    IRQF_TRIGGER_HIGH, "PA0_EINT", NULL);
    if (IS_ERR_VALUE(ret)) {
        pr_warn("request virq %d failed, errno = %d\n", virq, ret);
        return -EINVAL;
    }
    return 0;
}
```

#### DT 方法申请中断

配置设备树

```c
soc{
  vdevice: vdevice@0 {
    compatible = "allwinner,sun8i-vdevice";
    device_type = "Vdevice";
    interrupt-parent = <&pio>;/* 依赖的中断控制器(带interrupt-controller属性的结点) */
    interrupts = < PD 3 IRQ_TYPE_LEVEL_HIGH>;
                    | |      `------------------中断触发条件、类型
                    | `-------------------------pin bank内偏移
                    `---------------------------哪个bank
    pinctrl-names = "default";
    pinctrl-0 = <&vdevice_pins_a>;
    test-gpios = <&pio PC 3 1 2 2 1>;
    status = "okay";
  };
};
```

在驱动中，通过 `platform_get_irq()` 标准接口获取虚拟中断号

```c
static int pctrltest_probe(struct platform_device *pdev)
{
	struct device_node *np = pdev->dev.of_node;
	struct gpio_config config;
	int gpio, irq;
	int ret;

	if (np == NULL) {
		pr_err("Vdevice failed to get of_node\n");
		return -ENODEV;
	}
  irq = platform_get_irq(pdev, 0);
  if (irq < 0) {
    printk("Get irq error!\n");
    return -EBUSY;
  }
  sunxi_ptest_data->irq = irq;
  return ret;
}
```

申请中断

```c
static int request_irq(void)
{
	int ret;
	int virq = sunxi_ptest_data->irq;
	int trigger = IRQF_TRIGGER_HIGH;

	reinit_completion(&sunxi_ptest_data->done);

	pr_warn("step1: request irq(%s level) for irq:%d.\n",
			trigger == IRQF_TRIGGER_HIGH ? "high" : "low", virq);
	ret = request_irq(virq, sunxi_pinctrl_irq_handler_demo1,
					trigger, "PIN_EINT", NULL);
	if (IS_ERR_VALUE(ret)) {
		pr_warn("request irq failed !\n");
		return -EINVAL;
	}

	pr_warn("step2: wait for irq.\n");
	ret = wait_for_completion_timeout(&sunxi_ptest_data->done, HZ);
	if (ret == 0) {
		pr_warn("wait for irq timeout!\n");
		free_irq(virq, NULL);
		return -EINVAL;
	}

	free_irq(virq, NULL);

	pr_warn("-----------------------------------------------\n");
	pr_warn("test pin eint success !\n");
	pr_warn("+++++++++++++++++++++++++++end++++++++++++++++++++++++++++\n\n\n");

	return 0;
}
```

#### DT 配置中断 debounce

通过 `dts` 配置每个中断 `bank` 的 `debounce`

```c
&pio {
	/* takes the debounce time in usec as argument */
	input-debounce = <0 0 0 0 0 0 0>;
			  | | | | | | `----------PA bank
			  | | | | | `------------PC bank
			  | | | | `--------------PD bank
			  | | | `----------------PF bank
			  | | `------------------PG bank
			  | `--------------------PH bank
			  `----------------------PI bank
};
```

- `input-debounce` 的属性值中需把pio设备支持中断的 `bank` 都配上，如果缺少，会以 `bank` 的顺序设置相应的属性值到` debounce `寄存器，缺少的 `bank` 对应的` debounce`应该是默认值（启动时没修改的情况）。`debounce`取值范围是`0~1000000`（单位usec）。

## 调试方法

### 寄存器调试

开启 SUNXI DUMP

```
cd /sys/class/sunxi_dump
1.查看一个寄存器
  echo 0x0300b048 > dump ;cat dump

2.写值到寄存器上
  echo 0x0300b058 0xfff > write ;cat write

3.查看一片连续寄存器
  echo 0x0300b000,0x0300bfff > dump;cat dump

4.写一组寄存器的值
  echo 0x0300b058 0xfff,0x0300b0a0 0xfff > write;cat write
```

### DEBUG FS

挂载 DEBUG FS

```
mount -t debugfs none /sys/kernel/debug
cd /sys/kernel/debug/sunxi_pinctrl
```

1. 查看 PIN 下的设备

```
cat pinctrl-devices
```

2. 查看 PIN 的状态和对应的使用设备

```
console:/sys/kernel/debug/pinctrl # ls
pinctrl-devices pinctrl-handles pinctrl-maps pio r_pio
console:/sys/kernel/debug/pinctrl # cat pinctrl-handles

Requested pin control handlers their pinmux maps:
device: twi3 current state: sleep
  state: default
    type: MUX_GROUP controller pio group: PA10 (10) function: twi3 (15)
    type: CONFIGS_GROUP controller pio group PA10 (10)config 00001409
config 00000005
    type: MUX_GROUP controller pio group: PA11 (11) function: twi3 (15)
    type: CONFIGS_GROUP controller pio group PA11 (11)config 00001409
config 00000005
  state: sleep
    type: MUX_GROUP controller pio group: PA10 (10) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PA10 (10)config 00001409
config 00000001
    type: MUX_GROUP controller pio group: PA11 (11) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PA11 (11)config 00001409
config 00000001
device: twi5 current state: default
  state: default
    type: MUX_GROUP controller r_pio group: PL0 (0) function: s_twi0 (3)
    type: CONFIGS_GROUP controller r_pio group PL0 (0)config 00001409
config 00000005
    type: MUX_GROUP controller r_pio group: PL1 (1) function: s_twi0 (3)
    type: CONFIGS_GROUP controller r_pio group PL1 (1)config 00001409
config 00000005
  state: sleep
    type: MUX_GROUP controller r_pio group: PL0 (0) function: io_disabled (4)
    type: CONFIGS_GROUP controller r_pio group PL0 (0)config 00001409
config 00000001
    type: MUX_GROUP controller r_pio group: PL1 (1) function: io_disabled (4)
    type: CONFIGS_GROUP controller r_pio group PL1 (1)config 00001409
config 00000001
device: soc@03000000:pwm5@0300a000 current state: active
  state: active
    type: MUX_GROUP controller pio group: PA12 (12) function: pwm5 (16)
    type: CONFIGS_GROUP controller pio group PA12 (12)config 00000001
config 00000000
config 00000000
  state: sleep
    type: MUX_GROUP controller pio group: PA12 (12) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PA12 (12)config 00000001
config 00000000
config 00000000
device: uart0 current state: default
  state: default
  state: sleep
device: uart1 current state: default
  state: default
    type: MUX_GROUP controller pio group: PG6 (95) function: uart1 (37)
    type: CONFIGS_GROUP controller pio group PG6 (95)config 00001409
config 00000005
    type: MUX_GROUP controller pio group: PG7 (96) function: uart1 (37)
    type: CONFIGS_GROUP controller pio group PG7 (96)config 00001409
config 00000005
    type: MUX_GROUP controller pio group: PG8 (97) function: uart1 (37)
    type: CONFIGS_GROUP controller pio group PG8 (97)config 00001409
config 00000005
    type: MUX_GROUP controller pio group: PG9 (98) function: uart1 (37)
    type: CONFIGS_GROUP controller pio group PG9 (98)config 00001409
config 00000005
  state: sleep
    type: MUX_GROUP controller pio group: PG6 (95) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PG6 (95)config 00001409
config 00000001
    type: MUX_GROUP controller pio group: PG7 (96) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PG7 (96)config 00001409
config 00000001
    type: MUX_GROUP controller pio group: PG8 (97) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PG8 (97)config 00001409
config 00000001
    type: MUX_GROUP controller pio group: PG9 (98) function: io_disabled (5)
    type: CONFIGS_GROUP controller pio group PG9 (98)config 00001409
    ....
```

从上面的部分log可以看到那些设备管理的pin以及pin当前的状态是否正确。以twi3设备为例，twi3管理的pin有PA10/PA11，分别有两组状态sleep和default，default状态表示使用状态，sleep状态表示pin处于io disabled状态，表示pin不可正常使用，twi3设备使用的pin当前状态处于sleep状态的。

