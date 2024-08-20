# APP 启用 ROOT 

在默认情况下，Android 13 并未开启 ROOT 功能，如需要启用 ROOT 需要做如下修改：

- `build/make/target/product/base_system.mk`

在 `PRODUCT_PACKAGES` 最后增加字段

```
su \
```

![image-20240820221330158](assets/post/root/image-20240820221330158.png)

- `frameworks/base/core/jni/com_android_internal_os_Zygote.cpp` 

找到 `DropCapabilitiesBoundingSet` 函数，将其功能废除

```
static void DropCapabilitiesBoundingSet(fail_fn_t fail_fn) {
  return;
  // for (int i = 0; prctl(PR_CAPBSET_READ, i, 0, 0, 0) >= 0; i++) {;
  //   if (prctl(PR_CAPBSET_DROP, i, 0, 0, 0) == -1) {
  //     if (errno == EINVAL) {
  //       ALOGE("prctl(PR_CAPBSET_DROP) failed with EINVAL. Please verify "
  //             "your kernel is compiled with file capabilities support");
  //     } else {
  //       fail_fn(CREATE_ERROR("prctl(PR_CAPBSET_DROP, %d) failed: %s", i, strerror(errno)));
  //     }
  //   }
  // }
}
```

![image-20240820221411472](assets/post/root/image-20240820221411472.png)

- `system/core/init/selinux.cpp`

找到 `SelinuxSetEnforcement` 函数，配置 `is_enforcing` 为 `false`

![image-20240820221624091](assets/post/root/image-20240820221624091.png)

- `system/core/libcutils/fs_config.cpp`

找到 `{ 04750, AID_ROOT,    AID_SHELL,   0, "system/xbin/su" },`  改为

```c
{ 06755, AID_ROOT,      AID_SHELL,     0, "system/bin/su" },
```

![image-20240820221714917](assets/post/root/image-20240820221714917.png)

- `system/extras/su/su.cpp`

找到 `main` 函数，注释检测

![image-20240820221849138](assets/post/root/image-20240820221849138.png)

- `system/extras/su/Android.bp`

找到 `install_in_xbin: true,` 将其删除

![image-20240820221924452](assets/post/root/image-20240820221924452.png)