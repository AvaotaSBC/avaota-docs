# Timer 调度器

```c
#include <os.h>
```

## 结构体

```c
#define TIMER_ALWAYS_RUN 0xFFFFFFFF

typedef struct task_struct {
    void (*callback)(void *arg, uint32_t event);
    void *arg;
    uint32_t run_count;
    uint32_t max_run_count;
    uint32_t interval;
    uint32_t elapsed_time;
    struct task_struct *next;
} task_t;

typedef struct timer_struct {
    task_t task;
    uint32_t interval;
} timer_t;
```

## API 接口

### timer_create

```c
void timer_create(timer_t *timer, void (*callback)(void *arg, uint32_t event), void *arg);
```

- 描述：创建一个定时器对象。
- 参数：
  - `timer`：指向需要保存新创建定时器的 `timer_t` 对象的指针。
  - `callback`：指向在定时器超时时将被调用的函数的指针。
  - `arg`：一个 `void` 指针，用于向回调函数传递参数。
  
### timer_start

```c
void timer_start(timer_t *timer, uint32_t max_run_count, uint32_t interval);
```

- 描述：启动一个定时器。
- 参数：
  - `timer`：指向已创建的 `timer_t` 对象的指针。
  - `max_run_count`：定时器运行的最大次数。如果设置为0，则会一直运行。
  - `interval`：定时器的时间间隔。

### timer_handle

```c
void timer_handle();
```

- 描述：定时器处理函数，需要在主循环中连续调用，以实现定时器的正常操作。

## 使用

```c
/* SPDX-License-Identifier: Apache-2.0 */

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <types.h>

#include <log.h>
#include <os.h>
#include <timer.h>

extern sunxi_serial_t uart_dbg;

// 定时器回调函数，每500ms触发一次
static void timer_500ms_cb(void *arg, uint32_t event) {
    printk_info("Timer 500ms callback\n");
}

// 定时器回调函数，每1500ms触发两次
static void timer_1500ms_run2_cb(void *arg, uint32_t event) {
    printk_info("Timer 500ms run 2 times callback\n");
}

int main(void) {
    sunxi_serial_init(&uart_dbg);

    sunxi_clk_init();

    printk_info("Hello World!\n");

    // 创建一个500ms的定时器，并注册回调函数
    timer_t timer_500ms;
    timer_create(&timer_500ms, timer_500ms_cb, NULL);
    timer_start(&timer_500ms, TIMER_ALWAYS_RUN, 500);

    // 创建一个1500ms触发两次的定时器，并注册回调函数
    timer_t timer_1500ms_run2;
    timer_create(&timer_1500ms_run2, timer_1500ms_run2_cb, NULL);
    timer_start(&timer_1500ms_run2, 2, 1500);

    while (1) {
        timer_handle();
        mdelay(1);
    }

    return 0;
}
```

这段代码的功能是创建和管理定时器，并在特定时间间隔内触发回调函数。

代码中使用了两个定时器 `timer_500ms` 和 `timer_1500ms_run2`，分别代表每500毫秒触发一次和每1500毫秒触发两次的定时器。

在 `main` 函数中，首先进行一些初始化操作，然后创建了两个定时器，并注册了对应的回调函数。接着通过调用 `timer_start` 函数启动定时器，指定了触发次数和时间间隔。

在主循环中，不断调用 `timer_handle` 函数来处理定时器事件，并通过调用 `mdelay(1)` 函数来进行1毫秒的延迟。

当定时器触发时，相应的回调函数会被调用并执行特定的操作。在本例中，回调函数打印了相应的信息。

