# UART 驱动

## 结构体

波特率定义：

```c
typedef enum {
    UART_BAUDRATE_300 = 300,
    UART_BAUDRATE_600 = 600,
    UART_BAUDRATE_1200 = 1200,
    UART_BAUDRATE_2400 = 2400,
    UART_BAUDRATE_4800 = 4800,
    UART_BAUDRATE_9600 = 9600,
    UART_BAUDRATE_19200 = 19200,
    UART_BAUDRATE_38400 = 38400,
    UART_BAUDRATE_57600 = 57600,
    UART_BAUDRATE_115200 = 115200,
    UART_BAUDRATE_230400 = 230400,
    UART_BAUDRATE_460800 = 460800,
    UART_BAUDRATE_921600 = 921600,
    UART_BAUDRATE_1500000 = 1500000,
    UART_BAUDRATE_MAX,
} sunxi_serial_baudrate_t;
```

校验位定义

```c
typedef enum {
    UART_PARITY_NO = 0,
    UART_PARITY_ODD,
    UART_PARITY_EVEN,
} sunxi_serial_parity_t;
```

停止位定义

```c
typedef enum {
    UART_STOP_BIT_0 = 0,
    UART_STOP_BIT_1,
} sunxi_serial_stop_bit_t;
```

数据长度定义

```c
typedef enum {
    UART_DLEN_5 = 0,
    UART_DLEN_6,
    UART_DLEN_7,
    UART_DLEN_8,
} sunxi_serial_dlen_t;
```

UART 设备描述结构体

```c
typedef struct {
    uint32_t base;                     /* Base address of the serial device */
    uint8_t id;                        /* ID of the serial device */
    sunxi_serial_baudrate_t baud_rate; /* Baud rate configuration */
    sunxi_serial_parity_t parity;      /* Parity configuration */
    sunxi_serial_stop_bit_t stop;      /* Stop bit configuration */
    sunxi_serial_dlen_t dlen;          /* Data length configuration */
    gpio_mux_t gpio_tx;                /* GPIO pin for data transmission */
    gpio_mux_t gpio_rx;                /* GPIO pin for data reception */
} sunxi_serial_t;
```

## API 接口

### sunxi_serial_init

```c
void sunxi_serial_init(sunxi_serial_t *uart);
```

- 描述：使用指定的配置初始化 Sunxi 串口接口。
- 参数：
  - `uart`：指向 Sunxi 串口接口结构的指针。

### sunxi_serial_putc

```c
void sunxi_serial_putc(void *arg, char c);
```

- 描述：通过 Sunxi 串口接口发送一个字符。
- 参数：
  - `arg`：指向 Sunxi 串口接口参数的指针。
  - `c`：要发送的字符。

### sunxi_serial_tstc

```c
int sunxi_serial_tstc(void *arg);
```

- 描述：检查 Sunxi 串口接口是否有可读取的字符。
- 参数：
  - `arg`：指向 Sunxi 串口接口参数的指针。
- 返回值：如果有可用字符则返回1，否则返回0。

### sunxi_serial_getc

```c
char sunxi_serial_getc(void *arg);
```

- 描述：从 Sunxi 串口接口读取一个字符。
- 参数：
  - `arg`：指向 Sunxi 串口接口参数的指针。
- 返回值：从接口读取的字符。

## 使用示例

### 简易模式

配置串口 0 为 `115200-8-1`，引脚 `PB9` `PB10`，配置如下：

```c
sunxi_serial_t uart_dbg = {
    .base = SUNXI_UART0_BASE,
    .id = 0,
    .gpio_tx = {GPIO_PIN(GPIO_PORTB, 9), GPIO_PERIPH_MUX2},
    .gpio_rx = {GPIO_PIN(GPIO_PORTB, 10), GPIO_PERIPH_MUX2},
};
```
使用示例：
```c
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <types.h>
#include <log.h>
#include <common.h>

sunxi_serial_t uart_dbg = {
    .base = SUNXI_UART0_BASE,
    .id = 0,
    .gpio_tx = {GPIO_PIN(GPIO_PORTB, 9), GPIO_PERIPH_MUX2},
    .gpio_rx = {GPIO_PIN(GPIO_PORTB, 10), GPIO_PERIPH_MUX2},
};

int main(void) {
    sunxi_serial_init(&uart_dbg);
    printk_info("Hello World!\n");
    abort();
    return 0;
}
```

### 专业模式

配置串口 0 为 `1500000-8-1`，引脚 `PB9` `PB10`，配置如下：

```c
sunxi_serial_t uart_dbg_1m5 = {
    .base = SUNXI_UART0_BASE,
    .id = 0,
    .baud_rate = UART_BAUDRATE_1500000,
    .dlen = UART_DLEN_8,
    .stop = UART_STOP_BIT_0,
    .parity = UART_PARITY_NO,
    .gpio_tx = {GPIO_PIN(GPIO_PORTB, 9), GPIO_PERIPH_MUX2},
    .gpio_rx = {GPIO_PIN(GPIO_PORTB, 10), GPIO_PERIPH_MUX2},
};
```
使用示例：

```c
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <types.h>
#include <log.h>
#include <common.h>

sunxi_serial_t uart_dbg_1m5 = {
    .base = SUNXI_UART0_BASE,
    .id = 0,
    .baud_rate = UART_BAUDRATE_1500000,
    .dlen = UART_DLEN_8,
    .stop = UART_STOP_BIT_0,
    .parity = UART_PARITY_NO,
    .gpio_tx = {GPIO_PIN(GPIO_PORTB, 9), GPIO_PERIPH_MUX2},
    .gpio_rx = {GPIO_PIN(GPIO_PORTB, 10), GPIO_PERIPH_MUX2},
};

int main(void) {
    sunxi_serial_init(&uart_dbg_1m5);
    printk_info("Hello World!\n");
    abort();
    return 0;
}
```



