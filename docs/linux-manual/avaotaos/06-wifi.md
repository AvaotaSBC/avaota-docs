# 连接 WIFI

Avaota OS 支持连接 WIFI，这里主要分为两个部分来说明如何连接WIFI，包括 CLI 命令行界面和GUI图形界面

## CLI 连接 WIFI

这里我们使用串口登录 Avaota SBC

![image-20240531220557363](assets/post/06-wifi/image-20240531220557363.png)

使用 `ifconfig -a` 查看是否有 `wlan0` 节点

![image-20240531220655380](assets/post/06-wifi/image-20240531220655380.png)

### 查看可用的 WIFI 节点

```
nmcli dev wifi list
```

![image-20240531220755158](assets/post/06-wifi/image-20240531220755158.png)

### 联网

使用命令联网，其中的 `<SSID>` 替换成你的 WIFI 名称，`<密码>` 换成你的 WIFI 密码。

```
sudo nmcli dev wifi connect <SSID> password <密码>
```

![image-20240531221001124](assets/post/06-wifi/image-20240531221001124.png)

每次命令执行后，会在 `/etc/NetworkManager/system-connections/` 目录下创建一个新文件来保存配置，重复执行则创建多个这样的文件。删除 WIFI 连接，在 `/etc/NetworkManager/system-connections/` 目录下的对应文件也会被删除。

### 检查网络连接

通过 `ping` 百度获取网络连接情况

```
ping baidu.com
```

![image-20240531221218642](assets/post/06-wifi/image-20240531221218642.png)

### 查看保存的网络

```
nmcli conn show
```

![image-20240531221309273](assets/post/06-wifi/image-20240531221309273.png)

