# 系统启动常见问题

## 板载 SPI 屏幕显示：WARN: Open file fail, filename xxx

![image-20240615114246263](assets/post/02-os-start/image-20240615114246263.png)

这是读取启动必备的文件失败，，在图中是读取内核 `Image` 失败考虑
1. 读取的文件损坏
2. TF卡通讯失败
3. 烧写错误
4. SDHCI驱动不完善，不支持某些品牌卡，可以来帮助优化驱动：https://github.com/YuzukiHD/SyterKit/blob/main/src/drivers/sys-sdhci.c

解决方法：

1. 重新格式化存储卡并且烧录固件
2. 拔插储存卡测试是否启动
3. 更换储存卡
