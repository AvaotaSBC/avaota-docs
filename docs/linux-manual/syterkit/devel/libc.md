# libc 基础类库

## sstdlib

```c
#include <sstdlib.h>
```

### simple_strtoul

函数原型：

```c
unsigned long simple_strtoul(const char *cp, char **endp, unsigned int base);
```

参数：

- cp：输入字符串
- endp：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
- base：基数，用于指定转换时使用的进制。可以是0或2~36之间的任意整数。当base为0时，会根据字符串的前缀自动判断进制（0x或0开头表示16进制，0开头表示8进制，其他情况表示10进制）。

返回值：

- 将字符串转换后得到的数值。如果转换成功，则返回转换后的数值；如果转换失败（例如，字符串不包含有效的数字部分），则返回0。请注意，0也可能是转换成功的结果之一，因此在使用返回值时需要进行判断。

### simple_strtoull

函数原型：

```c
unsigned long long simple_strtoull(const char *cp, char **endp, unsigned int base);
```

参数：

- `cp`：输入字符串
- `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
- `base`：基数，用于指定转换时使用的进制。可以是0或2~36之间的任意整数。当base为0时，会根据字符串的前缀自动判断进制（0x或0开头表示16进制，0开头表示8进制，其他情况表示10进制）。

返回值：

- 将字符串转换后得到的数值。如果转换成功，则返回转换后的数值；如果转换失败（例如，字符串不包含有效的数字部分），则返回0。请注意，0也可能是转换成功的结果之一，因此在使用返回值时需要进行判断。

### simple_hextoul

函数原型：

```c
unsigned long simple_hextoul(const char *cp, char **endp);
```

参数：

- `cp`：输入字符串
- `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。

返回值：

- 将字符串转换后得到的数值。如果转换成功，则返回转换后的数值；如果转换失败（例如，字符串不包含有效的数字部分），则返回0。请注意，0也可能是转换成功的结果之一，因此在使用返回值时需要进行判断。

### simple_dectoul

函数原型：

```c
unsigned long simple_dectoul(const char *cp, char **endp);
```

参数：

- `cp`：输入字符串
- `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。

返回值：

- 将字符串转换后得到的数值。如果转换成功，则返回转换后的数值；如果转换失败（例如，字符串不包含有效的数字部分），则返回0。请注意，0也可能是转换成功的结果之一，因此在使用返回值时需要进行判断。

### simple_strtol

函数原型：

```c
long simple_strtol(const char *cp, char **endp, unsigned int base);
```

参数：

- `cp`：输入字符串
- `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
- `base`：基数，用于指定转换时使用的进制。可以是0或2~36之间的任意整数。当base为0时，会根据字符串的前缀自动判断进制（0x或0开头表示16进制，0开头表示8进制，其他情况表示10进制）。

返回值：

- 将字符串转换后得到的数值。如果转换成功，则返回转换后的数值；如果转换失败（例如，字符串不包含有效的数字部分），则返回0。请注意，0也可能是转换成功的结果之一，因此在使用返回值时需要进行判断。

### simple_ustrtoul

函数原型：

```c
unsigned long simple_ustrtoul(const char *cp, char **endp, unsigned int base);
```

参数：

- `cp`：输入字符串
- `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
- `base`：基数，用于指定转换时使用的进制。可以是0或2~36之间的任意整数。当base为0时，会根据字符串的前缀自动判断进制（0x或0开头表示16进制，0开头表示8进制，其他情况表示10进制）。

返回值：

- 将字符串转换后得到的数值。如果转换成功，则返回转换后的数值；如果转换失败（例如，字符串不包含有效的数字部分），则返回0。请注意，0也可能是转换成功的结果之一，因此在使用返回值时需要进行判断。

### simple_ustrtoull

```c
unsigned long long simple_ustrtoull(const char *cp, char **endp, unsigned int base);
```

- 描述：将输入的无符号字符串转换为无符号长长整型数。
- 参数：
  - `cp`：输入字符串。
  - `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
  - `base`：用于指定转换时使用的进制。可以是0或2~36之间的任意整数。当base为0时，会根据字符串的前缀自动判断进制（0x或0开头表示16进制，0开头表示8进制，其他情况表示10进制）。
- 返回值：转换后的无符号长长整型数。

### simple_strtoll

```c
long long simple_strtoll(const char *cp, char **endp, unsigned int base);
```

- 描述：将输入的字符串转换为长长整型数。
- 参数：
  - `cp`：输入字符串。
  - `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
  - `base`：用于指定转换时使用的进制。可以是0或2~36之间的任意整数。当base为0时，会根据字符串的前缀自动判断进制（0x或0开头表示16进制，0开头表示8进制，其他情况表示10进制）。
- 返回值：转换后的长长整型数。

### trailing_strtoln_end

```c
long trailing_strtoln_end(const char *str, const char *end, char const **endp);
```

- 描述：将输入的字符串转换为长整型数，并检查是否存在指定的结尾字符串。
- 参数：
  - `str`：输入字符串。
  - `end`：要检查的结尾字符串。
  - `endp`：一个指向字符指针的指针，用于存储转换后剩余的字符串部分的地址。如果传入NULL，则表示不需要获取剩余的字符串部分。
- 返回值：转换后的长整型数。

### trailing_strtoln

```c
long trailing_strtoln(const char *str, const char *end);
```

- 描述：将输入的字符串转换为长整型数，并检查是否存在指定的结尾字符串。
- 参数：
  - `str`：输入字符串。
  - `end`：要检查的结尾字符串。
- 返回值：转换后的长整型数。

### trailing_strtol

```c
long trailing_strtol(const char *str);
```

- 描述：将输入的字符串转换为长整型数。
- 参数：
  - `str`：输入字符串。
- 返回值：转换后的长整型数。

### str_to_upper

```c
void str_to_upper(const char *in, char *out, size_t len);
```

- 描述：将输入的字符串转换为大写形式。
- 参数：
  - `in`：输入字符串。
  - `out`：用于存储大写形式的输出字符串。
  - `len`：输入字符串的长度。

### ltoa

```c
char *ltoa(long int num, char *str, int base);
```

- 描述：将长整型数转换为字符串表示。
- 参数：
  - `num`：输入的长整型数。
  - `str`：用于存储转换后的字符串。
  - `base`：指定转换时使用的进制。可以是2~36之间的任意整数。
- 返回值：指向输出字符串的指针。

### simple_atoi

```c
int simple_atoi(const char *nptr);
```

- 描述：将输入的字符串转换为整数。
- 参数：
  - `nptr`：输入字符串。
- 返回值：转换后的整数。

### simple_atoll

```c
long long simple_atoll(const char *nptr);
```

- 描述：将输入的字符串转换为长长整型数。
- 参数：
  - `nptr`：输入字符串。
- 返回值：转换后的长长整型数。

### simple_abs

```c
int simple_abs(int n);
```

- 描述：计算整数的绝对值。
- 参数：
  - `n`：输入的整数。
- 返回值：输入整数的绝对值。

## ctype

```c
#include <ctype.h>
```

### isalnum

```c
int isalnum(int c);
```

- 描述：检查给定的字符是否是字母数字字符（字母或数字）。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是字母数字字符，则返回非零值，否则返回零。

### isalpha

```c
int isalpha(int c);
```

- 描述：检查给定的字符是否是字母字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是字母字符，则返回非零值，否则返回零。

### isascii

```c
int isascii(int c);
```

- 描述：检查给定的字符是否是有效的ASCII字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是有效的ASCII字符，则返回非零值，否则返回零。

### isblank

```c
int isblank(int c);
```

- 描述：检查给定的字符是否是空白字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是空白字符，则返回非零值，否则返回零。

### iscntrl

```c
int iscntrl(int c);
```

- 描述：检查给定的字符是否是控制字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是控制字符，则返回非零值，否则返回零。

### isdigit

```c
int isdigit(int c);
```

- 描述：检查给定的字符是否是数字字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是数字字符，则返回非零值，否则返回零。

### isgraph

```c
int isgraph(int c);
```

- 描述：检查给定的字符是否是可打印字符且不是空格。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是可打印字符且不是空格，则返回非零值，否则返回零。

### islower

```c
int islower(int c);
```

- 描述：检查给定的字符是否是小写字母字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是小写字母字符，则返回非零值，否则返回零。

### isprint

```c
int isprint(int c);
```

- 描述：检查给定的字符是否是可打印字符，包括空格。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是可打印字符，则返回非零值，否则返回零。

### ispunct

```c
int ispunct(int c);
```

- 描述：检查给定的字符是否是标点符号字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是标点符号字符，则返回非零值，否则返回零。

### isspace

```c
int isspace(int c);
```

- 描述：检查给定的字符是否是空白字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是空白字符，则返回非零值，否则返回零。

### isupper

```c
int isupper(int c);
```

- 描述：检查给定的字符是否是大写字母字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是大写字母字符，则返回非零值，否则返回零。

### isxdigit

```c
int isxdigit(int c);
```

- 描述：检查给定的字符是否是十六进制数字字符。
- 参数：
  - `c`：要检查的字符。
- 返回值：如果字符是十六进制数字字符，则返回非零值，否则返回零。

### toascii

```c
int toascii(int c);
```

- 描述：将给定的字符转换为其ASCII值。
- 参数：
  - `c`：要转换的字符。
- 返回值：字符的ASCII值。

### tolower

```c
int tolower(int c);
```

- 描述：将给定的字符转换为小写字母。
- 参数：
  - `c`：要转换的字符。
- 返回值：字符的小写形式。

### toupper

```c
int toupper(int c);
```

- 描述：将给定的字符转换为大写字母。
- 参数：
  - `c`：要转换的字符。
- 返回值：字符的大写形式。

## string

```c
#include <string.h>
```

### memcpy

```c
void *memcpy(void *dst, const void *src, int cnt);
```

- 描述：将源内存区域的值复制到目标内存区域。
- 参数：
  - `dst`：目标内存区域的指针。
  - `src`：源内存区域的指针。
  - `cnt`：要复制的字节数。
- 返回值：指向目标内存区域的指针。

### memset

```c
void *memset(void *dst, int val, int cnt);
```

- 描述：将目标内存区域的前 `cnt` 个字节设置为指定的值 `val`。
- 参数：
  - `dst`：要填充的内存区域的指针。
  - `val`：要设置的值。
  - `cnt`：要设置的字节数。
- 返回值：指向目标内存区域的指针。

### memcmp

```c
int memcmp(const void *dst, const void *src, unsigned int cnt);
```

- 描述：比较两个内存区域的前 `cnt` 个字节。
- 参数：
  - `dst`：第一个内存区域的指针。
  - `src`：第二个内存区域的指针。
  - `cnt`：要比较的字节数。
- 返回值：如果 `dst` 小于 `src`，返回负数；如果 `dst` 等于 `src`，返回零；如果 `dst` 大于 `src`，返回正数。

### strlen

```c
unsigned int strlen(const char *str);
```

- 描述：计算字符串的长度，不包括结尾的空字符。
- 参数：
  - `str`：输入字符串的指针。
- 返回值：输入字符串的长度。

### strnlen

```c
unsigned int strnlen(const char *s, unsigned int n);
```

- 描述：计算字符串的长度，但不超过 `n` 个字符。
- 参数：
  - `s`：输入字符串的指针。
  - `n`：要检查的最大字符数。
- 返回值：输入字符串的长度，但不超过 `n`。

### strcpy

```c
char *strcpy(char *dst, const char *src);
```

- 描述：将源字符串（包括结尾的空字符）复制到目标缓冲区。
- 参数：
  - `dst`：目标缓冲区的指针。
  - `src`：源字符串的指针。
- 返回值：指向目标缓冲区的指针。

### strncpy

```c
char *strncpy(char *dest, const char *src, unsigned int n);
```

- 描述：将源字符串的最多 `n` 个字符（包括结尾的空字符）复制到目标缓冲区。
- 参数：
  - `dest`：目标缓冲区的指针。
  - `src`：源字符串的指针。
  - `n`：要复制的最大字符数。
- 返回值：指向目标缓冲区的指针。

### strcat

```c
char *strcat(char *dst, const char *src);
```

- 描述：将源字符串（包括结尾的空字符）追加到目标字符串的末尾。
- 参数：
  - `dst`：目标字符串的指针。
  - `src`：源字符串的指针。
- 返回值：指向目标字符串的指针。

### strcmp

```c
int strcmp(const char *p1, const char *p2);
```

- 描述：比较两个字符串。
- 参数：
  - `p1`：第一个字符串的指针。
  - `p2`：第二个字符串的指针。
- 返回值：如果 `p1` 小于 `p2`，返回负数；如果 `p1` 等于 `p2`，返回零；如果 `p1` 大于 `p2`，返回正数。

### strncmp

```c
int strncmp(const char *p1, const char *p2, unsigned int cnt);
```

- 描述：比较两个字符串的前 `cnt` 个字符。
- 参数：
  - `p1`：第一个字符串的指针。
  - `p2`：第二个字符串的指针。
  - `cnt`：要比较的字符数。
- 返回值：如果 `p1` 小于 `p2`，返回负数；如果 `p1` 等于 `p2`，返回零；如果 `p1` 大于 `p2`，返回正数。

### strchr

```c
char *strchr(const char *s, int c);
```

- 描述：在字符串中查找字符 `c` 第一次出现的位置。
- 参数：
  - `s`：输入字符串的指针。
  - `c`：要查找的字符。
- 返回值：指向查找到的字符的指针，或者 `NULL`。

### strrchr

```c
char *strrchr(const char *s, int c);
```

- 描述：在字符串中查找字符 `c` 最后一次出现的位置。
- 参数：
  - `s`：输入字符串的指针。
  - `c`：要查找的字符。
- 返回值：指向查找到的字符的指针，或者 `NULL`。

### strstr

```c
char *strstr(const char *s, const char *what);
```

- 描述：在字符串中查找子串 `what` 的第一次出现位置。
- 参数：
  - `s`：输入字符串的指针。
  - `what`：要查找的子串的指针。
- 返回值：指向查找到的子串的指针，或者 `NULL`。

### memchr

```c
void *memchr(void *ptr, int value, unsigned int num);
```

- 描述：在内存中查找字符 `value` 第一次出现的位置。
- 参数：
  - `ptr`：输入内存区域的指针。
  - `value`：要查找的字符。
  - `num`：要扫描的字节数。
- 返回值：指向查找到的字符的指针，或者 `NULL`。

### memmove

```c
void *memmove(void *dest, const void *src, unsigned int count);
```

- 描述：将源内存区域的值复制到目标内存区域，可以处理内存重叠的情况。
- 参数：
  - `dest`：目标内存区域的指针。
  - `src`：源内存区域的指针。
  - `count`：要复制的字节数。
- 返回值：指向目标内存区域的指针。

---

**启用 CONFIG_SPRINTF**

### sprintf

```c
int sprintf(char *buf, const char *fmt, ...);
```

- 描述：将格式化数据写入字符串中。
- 参数：
  - `buf`：指向目标字符串的指针，用于存储格式化数据。
  - `fmt`：包含要写入的数据格式的格式字符串。
  - `...`：可变数量的参数，根据 `fmt` 进行格式化并写入 `buf` 中。
- 返回值：返回写入到 `buf` 中的字符数（不包括空终止符）。

### snprintf

```c
int snprintf(char *buf, size_t n, const char *fmt, ...);
```

- 描述：安全地将格式化数据写入字符串中，限制写入的字符数。
- 参数：
  - `buf`：指向目标字符串的指针，用于存储格式化数据。
  - `n`：允许写入的最大字符数（包括空终止符）。
  - `fmt`：包含要写入的数据格式的格式字符串。
  - `...`：可变数量的参数，根据 `fmt` 进行格式化并写入 `buf` 中。不会超过 `n-1` 个字符，并在末尾添加空终止符。
- 返回值：返回写入到 `buf` 中的字符数（不包括空终止符）。如果输出被截断，返回尝试写入的总字符数。

### vsnprintf

```c
int vsnprintf(char *buf, size_t n, const char *fmt, va_list ap);
```

- 描述：类似于 `snprintf`，但使用 `va_list` 类型的参数列表来处理可变参数。
- 参数：
  - `buf`：指向目标字符串的指针，用于存储格式化数据。
  - `n`：允许写入的最大字符数（包括空终止符）。
  - `fmt`：包含要写入的数据格式的格式字符串。
  - `ap`：`va_list` 类型的参数列表，用于传递可变数量的参数。
- 返回值：返回写入到 `buf` 中的字符数（不包括空终止符）。如果输出被截断，返回尝试写入的总字符数。

## smalloc

```c
#include <smalloc.h>
```

### smalloc_init

```c
int32_t smalloc_init(uint32_t p_heap_head, uint32_t n_heap_size);
```

- 描述：使用指定的堆参数初始化简单的 ``malloc`` 库。
- 参数：
  - ``p_heap_head`` (``uint32_t``): 堆的起始地址。
  - ``n_heap_size`` (``uint32_t``): 堆的大小（以字节为单位）。
- 返回值：如果成功则返回零，否则返回非零值。

### smalloc

```c
void *smalloc(uint32_t num_bytes);
```

- 描述：从堆中分配指定大小的内存块。
- 参数：
  - ``num_bytes`` (``uint32_t``): 要分配的字节数。
- 返回值：指向分配的内存块的指针，如果分配失败则返回 ``NULL``。

### srealloc

```c
void *srealloc(void *p, uint32_t num_bytes);
```

- 描述：重新分配具有指定新大小的内存块。
- 参数：
  - ``p`` (``void*``): 要重新分配的内存块的指针。
  - ``num_bytes`` (``uint32_t``): 新的字节大小。
- 返回值：指向重新分配的内存块的指针，如果重新分配失败则返回 ``NULL``。

### sfree

```c
void sfree(void *p);
```

- 描述：释放指定指针指向的内存块。
- 参数：
  - ``p`` (``void*``): 要释放的内存块的指针。