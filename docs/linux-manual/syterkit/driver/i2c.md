# I2C 驱动

## 结构体

I2C 描述结构体

```c
typedef struct {
    uint32_t base;
    uint8_t id;
    uint32_t speed;
    gpio_mux_t gpio_scl;
    gpio_mux_t gpio_sda;
    bool status;
} sunxi_i2c_t;
```

I2C 总线枚举

```c
enum {
	SUNXI_I2C0 = 0,
	SUNXI_I2C1,
	SUNXI_I2C2,
	SUNXI_I2C3,
	SUNXI_I2C4,
	SUNXI_I2C5,
	SUNXI_R_I2C0,
	SUNXI_R_I2C1,
	SUNXI_I2C_BUS_MAX,
};
```

I2C 外设寄存器结构体

```c
struct sunxi_twi_reg {
    volatile uint32_t addr;   /* slave address     */
    volatile uint32_t xaddr;  /* extend address    */
    volatile uint32_t data;   /* data              */
    volatile uint32_t ctl;    /* control           */
    volatile uint32_t status; /* status            */
    volatile uint32_t clk;    /* clock             */
    volatile uint32_t srst;   /* soft reset        */
    volatile uint32_t eft;    /* enhanced future   */
    volatile uint32_t lcr;    /* line control      */
    volatile uint32_t dvfs;   /* dvfs control      */
};
```

## 接口 API


### sunxi_i2c_init

```c
void sunxi_i2c_init(sunxi_i2c_t *i2c_dev);
```

初始化sunxi_i2c控制器设备结构。

### sunxi_i2c_write

```c
int sunxi_i2c_write(sunxi_i2c_t *i2c_dev, uint8_t addr, uint32_t reg, uint8_t data);
```

向设备写入数据。

- `i2c_dev`：指向sunxi_i2c控制器设备结构的指针。
- `addr`：设备地址。
- `reg`：要在设备中读取/写入的寄存器。
- `data`：要写入/读取的数据。
- 返回值：状态的数量。

### sunxi_i2c_read

```c
int sunxi_i2c_read(sunxi_i2c_t *i2c_dev, uint8_t addr, uint32_t reg, uint8_t *data);
```

从设备读取数据。

- `i2c_dev`：指向sunxi_i2c控制器设备结构的指针。
- `addr`：设备地址。
- `reg`：要从设备中读取的寄存器。
- `data`：用于存储读取数据的缓冲区。
- 返回值：状态的数量。

## I2C 接口状态返回值

| 代码 | 状态                                                         |
|------|--------------------------------------------------------------|
| 00h  | 总线错误                                                     |
| 08h  | 发送起始条件                                                |
| 10h  | 重复发送起始条件                                            |
| 18h  | 地址+写位发送，收到ACK                                      |
| 20h  | 地址+写位发送，未收到ACK                                    |
| 28h  | 主模式下发送数据字节，收到ACK                                |
| 30h  | 主模式下发送数据字节，未收到ACK                              |
| 38h  | 地址或数据字节仲裁丢失                                      |
| 40h  | 地址+读位发送，收到ACK                                      |
| 48h  | 地址+读位发送，未收到ACK                                    |
| 50h  | 主模式下接收数据字节，发送ACK                               |
| 58h  | 主模式下接收数据字节，未发送ACK                              |
| 60h  | 收到从机地址+写位，发送ACK                                  |
| 68h  | 作为主机地址仲裁丢失，收到从机地址+写位，发送ACK            |
| 70h  | 收到广播地址，发送ACK                                       |
| 78h  | 作为主机地址仲裁丢失，收到广播地址，发送ACK                |
| 80h  | 在收到从机地址后接收数据字节，发送ACK                       |
| 88h  | 在收到从机地址后接收数据字节，未发送ACK                      |
| 90h  | 在收到广播地址后接收数据字节，发送ACK                       |
| 98h  | 在收到广播地址后接收数据字节，未发送ACK                      |
| A0h  | 在从机模式下接收到停止或重复开始条件                        |
| A8h  | 收到从机地址+读位，发送ACK                                  |
| B0h  | 作为主机地址仲裁丢失，收到从机地址+读位，发送ACK            |
| B8h  | 在从机模式下发送数据字节，收到ACK                           |
| C0h  | 在从机模式下发送数据字节，未收到ACK                         |
| C8h  | 在从机模式下发送最后一个字节，收到ACK                       |
| D0h  | 发送第二个地址字节+写位，收到ACK                            |
| D8h  | 发送第二个地址字节+写位，未收到ACK                          |
| F8h  | 无相关状态信息或无中断                                      |

## 示例

申明 I2C，并且发送数据

```c
sunxi_i2c_t i2c_0 = {
        .base = 0x02502000,
        .id = 0,
        .speed = 4000000,
        .gpio_scl = {GPIO_PIN(GPIO_PORTE, 4), GPIO_PERIPH_MUX8},
        .gpio_sda = {GPIO_PIN(GPIO_PORTE, 5), GPIO_PERIPH_MUX8},
};

sunxi_i2c_init(&i2c_0);
ret = sunxi_i2c_write(&i2c_0, 0x32, 0x11, 0x11);
```

