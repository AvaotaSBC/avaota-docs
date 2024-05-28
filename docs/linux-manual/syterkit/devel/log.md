# log 基础库

## LOG 定义

## 日志输出宏文档

### 概述
该文档介绍了一组用于输出日志信息的宏，这些宏根据用户设定的日志级别，选择性地输出对应级别的日志信息。

### 宏列表
1. `printk_trace(fmt, ...)`
   - 描述：输出追踪级别的日志信息。
   - 参数：
     - fmt: 格式化字符串
     - ... : 可变参数列表
   - 注意：仅当 `LOG_LEVEL_DEFAULT` 大于等于 `LOG_LEVEL_TRACE` 时才会真正输出日志信息。

2. `printk_debug(fmt, ...)`
   - 描述：输出调试级别的日志信息。
   - 参数：
     - fmt: 格式化字符串
     - ... : 可变参数列表
   - 注意：仅当 `LOG_LEVEL_DEFAULT` 大于等于 `LOG_LEVEL_DEBUG` 时才会真正输出日志信息。

3. `printk_info(fmt, ...)`
   - 描述：输出信息级别的日志信息。
   - 参数：
     - fmt: 格式化字符串
     - ... : 可变参数列表
   - 注意：仅当 `LOG_LEVEL_DEFAULT` 大于等于 `LOG_LEVEL_INFO` 时才会真正输出日志信息。

4. `printk_warning(fmt, ...)`
   - 描述：输出警告级别的日志信息。
   - 参数：
     - fmt: 格式化字符串
     - ... : 可变参数列表
   - 注意：仅当 `LOG_LEVEL_DEFAULT` 大于等于 `LOG_LEVEL_WARNING` 时才会真正输出日志信息。

5. `printk_error(fmt, ...)`
   - 描述：输出错误级别的日志信息。
   - 参数：
     - fmt: 格式化字符串
     - ... : 可变参数列表
   - 注意：仅当 `LOG_LEVEL_DEFAULT` 大于等于 `LOG_LEVEL_ERROR` 时才会真正输出日志信息。

### 使用示例
```c
// 设置日志级别为调试级别
#define LOG_LEVEL_DEFAULT LOG_LEVEL_DEBUG

// 使用日志输出宏
printk_trace("This is a trace message");
printk_debug("Debug information: %s", debug_info);
printk_info("Information: %d", info_value);
printk_warning("Warning: %s", warning_message);
printk_error("Error occurred: %s", error_message);
```

### 注意事项
- 在使用这些宏输出日志时，需要在程序中定义 `LOG_LEVEL_DEFAULT` 的具体数值，以便控制实际输出的日志级别。
- 如果 `LOG_LEVEL_DEFAULT` 小于宏定义的日志级别，则对应级别的日志信息将被忽略，不会输出到日志中。

## LOG 函数

### set_timer_count

```c
void set_timer_count();
```

- 描述：设置定时器的计数值。
- 注意：在调用此函数之前，应该初始化与定时器相关的硬件配置。

### printk

```c
void printk(int level, const char *fmt, ...);
```

- 描述：将带有指定级别的消息打印到内核日志中。
- 参数：
  - `level`：信息级别，通常用于指定消息的重要性或类型。
  - `fmt`：描述要打印的消息格式的格式字符串。
  - `...`：可变参数列表，用于填充格式字符串中的占位符。
- 注意：此函数应在内核中使用，以记录重要的系统信息或调试消息。

### uart_printf

```c
void uart_printf(const char *fmt, ...);
```

- 描述：通过UART串口将格式化的消息打印到终端。
- 参数：
  - `fmt`：描述要打印的消息格式的格式字符串。
  - `...`：可变参数列表，用于填充格式字符串中的占位符。
- 注意：此函数通常用于嵌入式系统中进行调试和输出系统状态信息。

### printf

```c
int printf(const char *fmt, ...);
```

- 描述：通过UART串口将格式化的消息打印到终端。
- 参数：
  - `fmt`：描述要打印的消息格式的格式字符串。
  - `...`：可变参数列表，用于填充格式字符串中的占位符。
- 注意：此函数通常用于嵌入式系统中进行调试和输出系统状态信息。返回值为打印的字符数。