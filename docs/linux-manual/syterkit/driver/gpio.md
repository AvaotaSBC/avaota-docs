# GPIO 驱动

## 结构体

GPIO MUX 枚举

```c
enum {
    GPIO_INPUT = 0,
    GPIO_OUTPUT = 1,
    GPIO_PERIPH_MUX2 = 2,
    GPIO_PERIPH_MUX3 = 3,
    GPIO_PERIPH_MUX4 = 4,
    GPIO_PERIPH_MUX5 = 5,
    GPIO_PERIPH_MUX6 = 6,
    GPIO_PERIPH_MUX7 = 7,
    GPIO_PERIPH_MUX8 = 8,
    GPIO_PERIPH_MUX14 = 14,
    GPIO_DISABLED = 0xf,
};
```

GPIO 端口枚举

```c
enum {
    GPIO_PORTA = 0,
    GPIO_PORTB,
    GPIO_PORTC,
    GPIO_PORTD,
    GPIO_PORTE,
    GPIO_PORTF,
    GPIO_PORTG,
    GPIO_PORTH,
    GPIO_PORTI,
    GPIO_PORTJ,
    GPIO_PORTK,
    GPIO_PORTL,
    GPIO_PORTM,
    GPIO_PORTN,
};
```

GPIO 上下拉状态

```c
enum gpio_pull_t {
    GPIO_PULL_UP = 0,
    GPIO_PULL_DOWN = 1,
    GPIO_PULL_NONE = 2,
};
```

GPIO 引脚定义

```c
#define GPIO_PIN(x, y) (((uint32_t) (x << PIO_NUM_IO_BITS)) | y)

typedef struct {
    gpio_t pin;
    uint8_t mux;
} gpio_mux_t;
```

## 驱动 API

### sunxi_gpio_init

```c
void sunxi_gpio_init(gpio_t pin, int cfg);
```

初始化具有给定配置的指定GPIO引脚。

- `pin`：要初始化的GPIO引脚。
- `cfg`：GPIO引脚的配置值。

### sunxi_gpio_set_value

```c
void sunxi_gpio_set_value(gpio_t pin, int value);
```

设置指定GPIO引脚的值。

- `pin`：要设置值的GPIO引脚。
- `value`：要设置的GPIO引脚的值（0或1）。

### sunxi_gpio_read

```c
int sunxi_gpio_read(gpio_t pin);
```

读取指定GPIO引脚的值。

- `pin`：要读取值的GPIO引脚。
- 返回值：从GPIO引脚读取的值（0或1）。

### sunxi_gpio_set_pull

```c
void sunxi_gpio_set_pull(gpio_t pin, enum gpio_pull_t pull);
```

设置指定GPIO引脚的拉电阻配置。

- `pin`：要设置拉电阻配置的GPIO引脚。
- `pull`：要为GPIO引脚设置的拉电阻配置。

## 示例

### 声明一个GPIO，拉高或拉低

声明一个GPIO，设置为输出模式

```c
static gpio_mux_t pl13_pins = {
        .pin = GPIO_PIN(GPIO_PORTL, 13),
        .mux = GPIO_OUTPUT,
};
```

拉高 GPIO 

```c
sunxi_gpio_init(pl13_pins.pin, pl13_pins.mux);
sunxi_gpio_set_value(pl13_pins.pin, 1);
```

拉低 GPIO

```
sunxi_gpio_init(pl13_pins.pin, pl13_pins.mux);
sunxi_gpio_set_value(pl13_pins.pin, 0);
```

### 声明一个 GPIO，并且配置 MUX

设置 GPIO MUX，假设设置 MUX 为 2，先声明 GPIO

```c
static gpio_mux_t pl13_pins = {
        .pin = GPIO_PIN(GPIO_PORTL, 13),
        .mux = GPIO_PERIPH_MUX2,
};
```

然后初始化 GPIO 

```
sunxi_gpio_init(pl13_pins.pin, pl13_pins.mux);
```

即可对接到其他外设使用







