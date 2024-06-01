# PMU 驱动

SyterKit 集成基于 I2C 的 PMU 驱动，支持 AXP 系列 PMU。

## 结构体

描述 axp pmu 的每一 step 对应电压关系的信息

```c
/**
 * Structure describing a voltage step of the power domain.
 */
typedef struct _axp_step_info {
    uint32_t step_min_vol;// Minimum voltage level for the step.
    uint32_t step_max_vol;// Maximum voltage level for the step.
    uint32_t step_val;    // Voltage increment value for the step.
    uint32_t regation;    // Regulator register address.
} axp_step_info_t;
```

PMU 的相关控制参数

```c
/**
 * Structure describing the control information of a power domain.
 */
typedef struct _axp_contrl_info {
    char name[8];                   // Name of the power domain.
    uint32_t min_vol;               // Minimum voltage level for the domain.
    uint32_t max_vol;               // Maximum voltage level for the domain.
    uint32_t cfg_reg_addr;          // Configuration register address.
    uint32_t cfg_reg_mask;          // Configuration register mask.
    uint32_t ctrl_reg_addr;         // Control register address.
    uint32_t ctrl_bit_ofs;          // Bit offset in the control register.
    uint32_t reg_addr_offset;       // Offset of the register address.
    axp_step_info_t axp_step_tbl[4];// Voltage step table for the domain.
} axp_contrl_info;
```

## API 接口

### 公共接口

#### axp_set_vol

```c
int axp_set_vol(sunxi_i2c_t *i2c_dev, char *name, int set_vol, int onoff, axp_contrl_info *axp_ctrl_tbl, uint8_t axp_ctrl_tbl_size, uint8_t axp_addr);
```

设置由AXP控制的特定电源域的电压值。

- `i2c_dev`：指向I2C设备结构的指针。
- `name`：电源域的名称。
- `set_vol`：要设置的电压值。
- `onoff`：是否打开或关闭电源域（1表示打开，0表示关闭）。
- `axp_ctrl_tbl`：指向AXP控制信息表的指针。
- `axp_ctrl_tbl_size`：AXP控制信息表的大小。
- `axp_addr`：AXP设备地址。
- 返回值：表示操作成功状态的整数。

#### axp_get_vol

```c
int axp_get_vol(sunxi_i2c_t *i2c_dev, char *name, axp_contrl_info *axp_ctrl_tbl, uint8_t axp_ctrl_tbl_size, uint8_t axp_addr);
```

获取由AXP控制的特定电源域的电压值。

- `i2c_dev`：指向I2C设备结构的指针。
- `name`：电源域的名称。
- `axp_ctrl_tbl`：指向AXP控制信息表的指针。
- `axp_ctrl_tbl_size`：AXP控制信息表的大小。
- `axp_addr`：AXP设备地址。
- 返回值：指定电源域的电压值。

### AXP313/AXP323/AXP1530

#### pmu_axp1530_init

**函数原型**

```c
int pmu_axp1530_init(sunxi_i2c_t *i2c_dev);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。

**返回值**

- 如果成功则返回0，如果发生错误则返回-1。

---

#### pmu_axp1530_get_vol

**函数原型**

```c
int pmu_axp1530_get_vol(sunxi_i2c_t *i2c_dev, char *name);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。
- `name`：电源域的名称。

**返回值**

- 指定电源域的电压值，如果发生错误则返回-1。

---

#### pmu_axp1530_set_vol

**函数原型**

```c
int pmu_axp1530_set_vol(sunxi_i2c_t *i2c_dev, char *name, int set_vol, int onoff);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。
- `name`：电源域的名称。
- `set_vol`：要设置的电压值。
- `onoff`：电源域的开/关状态（1 - 开启，0 - 关闭）。

**返回值**

- 如果成功则返回0，如果发生错误则返回-1。

---

#### pmu_axp1530_set_dual_phase

**函数原型**

```c
int pmu_axp1530_set_dual_phase(sunxi_i2c_t *i2c_dev);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。

**返回值**

- 如果成功则返回0，如果发生错误则返回-1。

---

#### pmu_axp1530_dump

**函数原型**

```c
void pmu_axp1530_dump(sunxi_i2c_t *i2c_dev);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。

### AXP717/AXP717C/AXP717B

#### pmu_axp2202_init

**函数原型**

```c
int pmu_axp2202_init(sunxi_i2c_t *i2c_dev);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。

**返回值**

- 如果成功则返回0，如果发生错误则返回-1。

---

#### pmu_axp2202_get_vol

**函数原型**

```c
int pmu_axp2202_get_vol(sunxi_i2c_t *i2c_dev, char *name);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。
- `name`：电源域的名称。

**返回值**

- 指定电源域的电压值，如果发生错误则返回-1。

---

#### pmu_axp2202_set_vol

**函数原型**

```c
int pmu_axp2202_set_vol(sunxi_i2c_t *i2c_dev, char *name, int set_vol, int onoff);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。
- `name`：电源域的名称。
- `set_vol`：要设置的电压值。
- `onoff`：电源域的开/关状态（1 - 开启，0 - 关闭）。

**返回值**

- 如果成功则返回0，如果发生错误则返回-1。

---

#### pmu_axp2202_dump

**函数原型**

```c
void pmu_axp2202_dump(sunxi_i2c_t *i2c_dev);
```

**参数**

- `i2c_dev`：指向I2C设备结构的指针。

## 示例

初始化 I2C，初始化 PMU，设置 PMU 电压

```c
sunxi_i2c_t i2c_pmu = {
        .base = SUNXI_R_TWI0_BASE,
        .id = SUNXI_R_I2C0,
        .speed = 4000000,
        .gpio_scl = {GPIO_PIN(GPIO_PORTL, 0), GPIO_PERIPH_MUX2},
        .gpio_sda = {GPIO_PIN(GPIO_PORTL, 1), GPIO_PERIPH_MUX2},
};

int main(void) {
    sunxi_i2c_init(&i2c_pmu);
    pmu_axp2202_init(&i2c_pmu);
    pmu_axp2202_set_vol(&i2c_pmu, "dcdc1", 1100, 1);
    pmu_axp2202_dump(&i2c_pmu);
}
```

初始化 I2C，初始化两路 PMU，设置 PMU 电压

```c
sunxi_i2c_t i2c_pmu = {
        .base = SUNXI_R_TWI0_BASE,
        .id = SUNXI_R_I2C0,
        .speed = 4000000,
        .gpio_scl = {GPIO_PIN(GPIO_PORTL, 0), GPIO_PERIPH_MUX2},
        .gpio_sda = {GPIO_PIN(GPIO_PORTL, 1), GPIO_PERIPH_MUX2},
};

int main(void) {
    sunxi_i2c_init(&i2c_pmu);
    pmu_axp2202_init(&i2c_pmu);
    pmu_axp1530_init(&i2c_pmu);
    
    pmu_axp1530_set_dual_phase(&i2c_pmu);
    pmu_axp1530_set_vol(&i2c_pmu, "dcdc1", 1100, 1);
    pmu_axp1530_set_vol(&i2c_pmu, "dcdc2", 1100, 1);
    
    pmu_axp2202_set_vol(&i2c_pmu, "dcdc1", 1100, 1);
    pmu_axp2202_set_vol(&i2c_pmu, "bldo3", 1800, 1);
    pmu_axp2202_set_vol(&i2c_pmu, "bldo1", 1800, 1);
    
    pmu_axp2202_dump(&i2c_pmu);
    pmu_axp1530_dump(&i2c_pmu);
}
```

