# Android 分区大小

在sys_partition.fex进行分区配置，配置文件默认在 

```
device/{vendor-name}/{platform-name}/{device-name}/system/sys_partition.fex
```

`super` 分区为系统分区大小，包括`system`、`vendor`、`product`等镜像是包含在动态`super`分区当中，调整`super`分区即可调整系统分区大小。

```
[partition]
    name         = super
    size         = 2G
    downloadfile = "super.fex"
    user_type    = 0x8000
```

`data`分区大小可以由`BoardConfig.mk`文件的`BOARD_USERDATAIMAGE_PARTITION_SIZE`指定，单位是字节。

:::note
一般将最后一个分区作为data分区，该分区大小是Nand或者eMMC总容量减去其他分区大小。如果需要烧写data分区镜像，分区大小需要预留一定预度，防止超出Nand或者eMMC容量。
:::