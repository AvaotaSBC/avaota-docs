# 编译 Buildroot

## 进入 Buildroot 目录

首先，确保你已经进入了 Buildroot 的主目录：

```
cd /path/to/buildroot/
```

## 执行配置命令

使用 `avaota_a1_defconfig` 文件进行配置，这需要指定 `BR2_EXTERNAL` 变量来告知 Buildroot 使用外部配置：

```
make BR2_EXTERNAL=../buildroot-external-avaota avaota_a1_defconfig
```

## 使用 `make menuconfig` 自定义配置

进入 Buildroot 的配置界面，可以根据项目需求添加或修改软件包、调整系统设置等：

```
make menuconfig
```

在配置界面中，可以使用箭头键进行导航、空格键进行选择、Enter 键进行确认等操作。

## 增加所需的软件包

在 `make menuconfig` 的界面中，选择并添加你需要的软件包，并确认保存配置。

## 开始编译

配置完成后，执行以下命令开始编译 Buildroot 系统镜像：

```
make
```

编译过程会自动下载所需的软件包，并进行交叉编译和系统配置。

## 等待编译完成

编译完成后，Buildroot 将在 `output/images/` 目录中生成一个完整的系统镜像`sdcard.img`，可以用于烧录到目标设备或进行进一步的测试和调试。

