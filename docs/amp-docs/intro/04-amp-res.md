# 异构计算资源划分

## Avaota A1

### DSP 资源

| Module     | cacheable属性   | Address                   | Size | 地址映射说明                                     |
| ---------- | --------------- | ------------------------- | ---- | ------------------------------------------------ |
| DSP IRAM   | non-cacheable   | 0x0002_0000 - 0x0002_FFFF | 64KB | DSP通过外部总线访问                              |
| DSP DRAM0  | non-cacheable   | 0x0003_0000 - 0x0003_7FFF | 32KB | DSP通过外部总线访问                              |
| DSP DRAM1  | non-cacheable   | 0x0003_8000 - 0x0003_FFFF | 32KB | DSP通外部总线访问                                |
| DSP IRAM   | non-cacheable   | 0x0040_0000 - 0x0040_FFFF | 64KB | DSP通过内部总线访问                              |
| DSP DRAM0  | non-cacheable   | 0x0042_0000 - 0x0042_7FFF | 32KB | DSP通过内部总线访问                              |
| DSP DRAM1  | non-cacheable   | 0x0044_0000 - 0x0044_7FFF | 32KB | DSP通过内部总线访问                              |
| DRAM SPACE | non-cacheable   | 0x1000_0000 - 0x1FFF_FFFF | 256M | 对应DDRR的前256M空间(需要DSP输出ahb做地址重映射) |
| DSP IRAM   | cacheable       | 0x2002_0000 - 0x2002_FFFF | 64KB | DSP通过外部总线访问                              |
| DSP DRAM0  | cacheable       | 0x2003_0000 - 0x2003_7FFF | 32KB | DSP通过外部总线访问                              |
| DSP DRAM1  | cacheable       | 0x2003_8000 - 0x2003_FFFF | 32KB | DSP通过外部总线访问                              |
| DRAM SPACE | cacheable       | 0x3000_0000 - 0x3FFF_FFFF | 256M | 对应DDR的前256M空间(需要DSP输出ahb做地址重映射)  |
| DRAM SPACE | non-cacheable   | 0x4000_0000 - 0x7FFF_FFFF | 1G   | DRAM特殊映射                                     |
| DRAM SPACE | cacheable可配置 | 0x8000_0000 - 0xBFFF_FFFF | 1G   | 预留空间                                         |
| DRAM SPACE | cacheable       | 0xC000_0000 - 0xFFFF_FFFF | 1G   | 直接映射到DDR对应空间                            |

由于DSP的cacheable空间大小只能按照你512MB去划分，而且跳转指令不能超过1G空间，因此对于SRAM、以及DRAM的空间，DSP存在多套地址映射，根据不同的地址段区分cacheable和non-cacheable。

DSP的local sram包括IRAM和DRAM0/1，放在DSP内部，其他主机可以通过DSP的总线接口对该RAM进行访问，而DSP可以通过特定地址（0x0040_0000 - 0x0044_FFFF）对其直接访问，实现最高效率。

### RV资源

| Module      | cacheable属性 | Address                   | Size               | 地址映射说明                                                 |
| ----------- | ------------- | ------------------------- | ------------------ | ------------------------------------------------------------ |
| DSP IRAM    | non-cacheable | 0x0002_0000 - 0x0002_FFFF | 64KB               |                                                              |
| DSP DRAM0   | non-cacheable | 0x0003_0000 - 0x0003_7FFF | 32KB               |                                                              |
| DSP DRAM1   | non-cacheable | 0x0003_8000 - 0x0003_FFFF | 32KB               |                                                              |
| SRAM A2     | non-cacheable | 0x0004_0000 - 0x0006_3FFF | 16+128KB           | 系统外设                                                     |
| 其他        | non-cacheable | 0x0800_0000 - 0x3FEF_FFFF |                    | 与CPUX memory mapping一致                                    |
| SRAM SPACE0 |               | 0x3FF0_0000 - 0x3FFF_FFFF | 1MB(实际使用256KB) | 0x3FF0_0000 - 0x3FFB_FFFF在总线上被屏蔽，0x3FFC_0000 - 0x3FFF_FFFF映射到DSP SRAM0 0x0728_0000 - 0x072B_FFFF |
| SRAM SPACE1 |               | 0x4000_0000 - 0x7FFF_FFFF | 1GB                | 0x4000_0000 - 0x4003_FFFF映射到DSP SRAM1 0x072C_0000 - 0x072F_FFFF,其余区间无映射 |

### 设备树配置

```c
reserved-memory {
    dsp0ddr_reserved: dsp0ddr@4a000000 {
        reg = <0x0 0x4a000000 0x0 0x00a00000>;
        no-map;
    };

    riscvsram0_reserved: riscvsram0@7280000 {
        reg = <0x0 0x07280000 0x0 0x40000>;
        no-map;
    };

    riscvsram1_reserved: riscvsram1@72c0000 {
        reg = <0x0 0x072c0000 0x0 0x40000>;
        no-map;
    };

    /*
    * The name should be "vdev%dbuffer".
    * Its size should be not less than
    *     RPMSG_BUF_SIZE * (num of buffers in a vring) * 2
    *   = 512 * (num of buffers in a vring) * 2
    */
    dsp_vdev0buffer: vdev0buffer@4ac00000 {
        compatible = "shared-dma-pool";
        reg = <0x0 0x4ac00000 0x0 0x40000>;
        no-map;
    };

    /*
    * The name should be "vdev%dvring%d".
    * The size of each should be not less than
    *     PAGE_ALIGN(vring_size(num, align))
    *   = PAGE_ALIGN(16 * num + 6 + 2 * num + (pads for align) + 6 + 8 * num)
    *
    * (Please refer to the vring layout in include/uapi/linux/virtio_ring.h)
    */
    dsp_vdev0vring0: vdev0vring0@4ac40000 {
        reg = <0x0 0x4ac40000 0x0 0x2000>;
        no-map;
    };
    dsp_vdev0vring1: vdev0vring1@4ac42000 {
        reg = <0x0 0x4ac42000 0x0 0x2000>;
        no-map;
    };

    /*
     * The name should be "vdev%dbuffer".
     * Its size should be not less than
     *     RPMSG_BUF_SIZE * (num of buffers in a vring) * 2
     *   = 512 * (num of buffers in a vring) * 2
     */
    rv_vdev0buffer: vdev0buffer@4ae00000 {
        compatible = "shared-dma-pool";
        reg = <0x0 0x4ae00000 0x0 0x40000>;
        no-map;
    };

    /*
     * The name should be "vdev%dvring%d".
     * The size of each should be not less than
     *     PAGE_ALIGN(vring_size(num, align))
     *   = PAGE_ALIGN(16 * num + 6 + 2 * num + (pads for align) + 6 + 8 * num)
     *
     * (Please refer to the vring layout in include/uapi/linux/virtio_ring.h)
     */
    rv_vdev0vring0: vdev0vring0@4ae40000 {
        reg = <0x0 0x4ae40000 0x0 0x2000>;
        no-map;
    };
    rv_vdev0vring1: vdev0vring1@4ae42000 {
        reg = <0x0 0x4ae42000 0x0 0x2000>;
        no-map;
    };

    /*
    * mcu ram addr
    */
    mcu0iram_reserved: mcu0iram@20000 {
        reg = <0x0 0x20000 0x0 0x10000>;
        no-map;
    };
    mcu0dram0_reserved: mcu0dram0@30000 {
        reg = <0x0 0x30000 0x0 0x8000>;
        no-map;
    };
    mcu0dram1_reserved: mcu0dram1@38000 {
        reg = <0x0 0x38000 0x0 0x8000>;
        no-map;
    };

    dsp0_rpbuf_reserved: dsp0_rpbuf@4ae44000 {
        compatible = "shared-dma-pool";
        no-map;
        reg = <0x0 0x4ae44000 0x0 0x8000>;
    };

    dsp_share_space@4ab00000 {
        no-map;
        reg = <0x0 0x4ab00000 0x0 0x10000>;
    };
};
```

