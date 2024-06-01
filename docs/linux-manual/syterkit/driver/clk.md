# CLK 驱动

## API 接口

### sunxi_clk_init

```c
void sunxi_clk_init(void);
```

初始化全局时钟，包括PLL和时钟分频器。

### sunxi_clk_reset

```c
void sunxi_clk_reset(void);
```

重置所有全局时钟到它们的默认值。

### sunxi_clk_dump

```c
void sunxi_clk_dump(void);
```

打印所有与时钟相关的寄存器值，用于调试和观察。

### sunxi_clk_get_peri1x_rate

```c
uint32_t sunxi_clk_get_peri1x_rate();
```

获取PERI1X总线的时钟频率。

- 返回值：PERI1X总线的时钟频率，单位为Hz。

### sunxi_usb_clk_deinit

```c
void sunxi_usb_clk_deinit();
```

取消初始化USB时钟。

### sunxi_clk_set_cpu_pll

```c
void sunxi_clk_set_cpu_pll(uint32_t freq);
```

更改CPU频率。

- `freq`：要设置的CPU频率。

## 示例

初始化时钟，并且输出时钟

```c
sunxi_clk_init();
sunxi_clk_dump();
```

