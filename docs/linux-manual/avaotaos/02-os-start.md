# 系统启动常见问题

## 板载 SPI 屏幕显示：WARN: Open file fail, filename xxx

![image-20240615114246263](assets/post/02-os-start/image-20240615114246263.png)

这是读取启动必备的文件失败，，在图中是读取内核 `Image` 失败考虑
1. 读取的文件损坏
2. TF卡通讯失败
3. 烧写错误
