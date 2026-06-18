# Python 脚本编辑器

内置基于 CodeMirror 的 Python 代码编辑器，可以**直接对当前打开的表跑批处理脚本**。是日常配置工作的瑞士军刀——批量改值、格式转换、复杂逻辑都靠它。

> [!IMPORTANT]
> 此功能为 ConfigNexus 专业版功能，需在 Steam 购买后使用。

跟《Python 公式集成》对比：

| 维度 | Python 脚本编辑器（本篇） | Python 公式集成 |
|------|--------------------------|-----------------|
| 触发 | 手动点"运行" | 单元格公式自动算 |
| 用途 | 一次性批量改 | 持续生效的计算 |
| 适合 | 数据迁移 / 格式转换 / 批量校验 | 数值规则 / 复杂计算 |

## 打开编辑器

主窗口菜单 → **Python → 脚本编辑器**，或快捷键 `Ctrl+Shift+P`。

## 界面

```
┌─ Python 脚本编辑器 ─────────────────┐
│ [运行] [保存到脚本库] [注册为公式] │
├─────────────────────────────────────┤
│ # 代码编辑区（CodeMirror）          │
│ for row in range(5, 100):           │
│     price = get_cell(row, 1)        │
│     if price:                       │
│         set_cell(row, 1,            │
│                  float(price) * 0.8)│
├─────────────────────────────────────┤
│ 输出 ＞ 已处理 95 行                │
└─────────────────────────────────────┘
```

## 可用 API（操作表格）

脚本通过这些函数读写当前激活表的数据：

| API | 说明 |
|-----|------|
| `get_cell(row, col)` | 读单个单元格 |
| `set_cell(row, col, value)` | 写单个单元格 |
| `get_range(r1, c1, r2, c2)` | 读区域（二维数组） |
| `set_range(r1, c1, data)` | 写区域（批量） |
| `get_column(col)` | 读整列 |
| `get_row(row)` | 读整行 |
| `insert_row(row, data)` | 插入行 |
| `delete_row(row)` | 删除行 |
| `get_sheet_name()` | 当前 sheet 名 |
| `get_sheets()` | 所有 sheet 名列表 |
| `switch_sheet(name)` | 切到指定 sheet |
| `get_selection()` | 用户当前选区 `(r1, c1, r2, c2)` |
| `find(pattern)` | 在表里找匹配单元格 |

行号、列号都是 **0-indexed**。

## 三方库

脚本环境内置常用包：

- pandas / numpy
- openpyxl
- requests（注意安全限制，详见下文）
- json / re / datetime（标准库）

import 用普通 Python 语法：

```python
import pandas as pd
import numpy as np
```

## 安全限制

脚本在沙箱中运行，**禁止**：

| 禁止操作 | 替代方案 |
|---------|---------|
| `open()` 读写本地文件 | 用 `get_range` 操作表格、用 `requests` 走 HTTP |
| `subprocess.run` 系统命令 | 没有替代——这条是硬限制 |
| `os.system` | 同上 |
| 修改 `os.environ` | 同上 |

> [!WARNING]
> 这些限制保护你的电脑——别人分享的脚本不能在你电脑上乱搞。如果你确实需要文件 IO，把脚本注册为公式后用专门的 IO 包装（详见高级文档）。

## 保存到脚本库 / 注册为公式

写完一段脚本：

- **保存到脚本库**：以后随时打开来跑，不用每次重写。脚本库详见教程《持久化脚本库》。
- **注册为公式**：把脚本里的函数挂到单元格公式系统，单元格里能直接调。详见《Python 公式集成》。

## 实战示例

### 批量给一列乘系数

```python
for row in range(5, 1000):
    val = get_cell(row, 3)
    if val:
        set_cell(row, 3, float(val) * 1.2)
```

### 给所有空单元格填默认值

```python
for row in range(5, 1000):
    if get_cell(row, 5) is None or get_cell(row, 5) == '':
        set_cell(row, 5, 'DEFAULT')
```

### 跨 sheet 复制

```python
data = get_range(0, 0, 100, 10)  # sheet A 读
switch_sheet('sheet_B')
set_range(0, 0, data)  # sheet B 写
```

### 用 pandas 做复杂分组统计

```python
import pandas as pd

data = get_range(0, 0, 1000, 5)
df = pd.DataFrame(data[1:], columns=data[0])  # 第一行作为列名
summary = df.groupby('类型')['数值'].agg(['sum', 'mean', 'count'])
print(summary)
```

### 找出所有重复 ID

```python
ids = get_column(0)
seen = set()
dupes = []
for r, id_ in enumerate(ids):
    if id_ in seen:
        dupes.append((r, id_))
    seen.add(id_)
print(f"发现 {len(dupes)} 个重复:", dupes)
```

## 运行 / 输出 / 调试

| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 运行 | `Ctrl+Enter` | 执行整个脚本 |
| 运行选中部分 | `Ctrl+Shift+Enter` | 只跑选中的代码（适合分段调试） |
| 输出 | 编辑器底部 | print 输出、错误堆栈都在这 |
| 中断 | 红色"停止"按钮 | 死循环时点这个 |

## 撤销

脚本对表格的所有改动都进 ConfigNexus 的撤销栈——跑完发现错了 `Ctrl+Z` 一次性回滚到运行前。

## 注意事项

> [!TIP]
> 写大脚本之前，先用小数据范围（`range(5, 10)`）跑通，再放大到全表。避免一不小心改坏几千行。

> [!NOTE]
> 脚本运行时**主窗口短暂卡住**（Python 子进程是同步调用的）。万级数据处理建议用 `print` 输出进度，避免感觉死机。
