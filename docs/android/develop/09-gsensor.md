# Android 加速度传感器

配置文件目录：`longan/device/config/chips/{IC}/configs/{BOARD}/board.dts`。

### Android层配置修改

以bma250为例。

Sensor驱动是自动加载的，自动加载部分配置好后，不需要手动insmod。

1) 方向的调整。

在 `device/{vendor-name}/{platform-name}/{device-name}/input/gsensor.cfg` 中，以bma250方向为例进行说明。

```
;name: bma250
gsensor_name = bma250  //标示用bma250c gsensor
gsensor_direct_x = false      //如果x轴反向，则置false
gsensor_direct_y = false      //如果y轴反向，则置false
gsensor_direct_z = false      //如果z轴反向，则置false
gsensor_xy_revert = true     //如果x轴当y轴用，y轴当x轴，则置true
```

Gsensor方向调试说明。
假定机器的长轴为X轴，短轴为Y轴，垂直方向为Z轴。  

#### 首先调试Z轴

- 第一步观察现象。

  旋转机器，发现当只有垂直90°时或者是在旋转后需要抖动一下，方向才会发生变化，则说明Z轴反了。若当机器大概45°拿着的时候也可以旋转，说明Z轴方向正确。无需修改Z轴方向。  

- 第二步修改Z轴为正确方向。

  此时需要找到当前使用模组的方向向量（根据模组的名称）。如果此时该方向Z轴向量（gsnesor_direct_z）的值为false，则需要修改为true；当为true，则需要修改为false。通过adb shell将修改后的gsnesor.cfg文件push到system/usr下，重启机器，按第一步观察现象。  

#### 其次查看X，Y轴是否互换

- 第一步观察现象。

首先假定长轴为X轴，短轴为Y轴，以X轴为底边将机器立起来。查看机器的X，Y方向是否正好互换，若此时机器的X，Y方向正好互换，在说明需要将X，Y方向交换。若此时X，Y方向没有反置，则进入X，Y方向的调试。 

- 第二步 交换X，Y方向 

当需要X，Y方向交换时，此时需要找到当前使用模组的方向向量（根据模组的名称）。如果此时该X，Y轴互换向量（gsensor_xy_revert）的值为false，则需要修改为true，当为true，则需要修改为false。通过adb shell将修改后的gsnesor.cfg文件push到system/usr下，重启机器，按第一步观察现象。

#### 再次调试X，Y轴方向。

- 第一步观察现象。
  首先假定长轴为X轴，短轴为Y轴，以X轴为底边将机器立起来，查看机器的方向是否正确，如果正确，说明长轴配置正确，如果方向正好相反，说明长轴配置错误。将机器旋转到短轴，查看机器方向是否正确，如果正确，说明短轴配置正确，如果方向正好相反，说明短轴配置错误。  

- 第二步修改X，Y轴方向。

当需要修改X，Y轴方向时，当只有长轴方向相反或者是只有短轴方向相反时，则只修改方向不正确的一个轴，当两个方向都相反时，则同时修改X与Y轴方向向量。找到当前使用模组的方向向量（根据模组的名称）。  
若长轴方向相反，如果此时该方向X轴向量（gsnesor_direct_x）的值为false，则需要修改为true，当为true，则需要修改为false。  

若短轴方向相反，如果此时该方向Y轴向量（gsnesor_direct_y）的值为false，则需要修改为true，当为true，则需要修改为false。 

通过adb shell将修改后的gsnesor.cfg文件push到system/usr下，重启机器，按第一步观察现象。若发现还是反向X轴或者Y轴的方向仍然相反，则说明X轴为短轴，Y轴为长轴。此时：

若长轴方向相反，如果此时该方向Y轴向量（gsnesor_direct_y）的值为false，则需要修改为true，当为true，则需要修改为false。  

若短轴方向相反，如果此时该方向X轴向量（gsnesor_direct_x）的值为false，则需要修改为true，当为true，则需要修改为false。  