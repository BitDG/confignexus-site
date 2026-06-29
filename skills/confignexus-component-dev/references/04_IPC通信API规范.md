# 04 IPC 通信 API 规范

> **版本**: 2.0  
> **更新日期**: 2026-06  
> **参考应用**: `task_app`、`bag_app`、`mail_app`

本文档定义了 ConfigNexus 组件与主进程之间的 IPC 通信协议，包含完整的实现代码。

---

## 🔌 通信架构概述

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           渲染进程 (mainWindow)                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    main.js / menubar.js                         │     │
│  │  - 获取表格数据                                                  │     │
│  │  - 调用 window.electronAPI.invoke('tool:sync-data', payload)    │     │
│  └─────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ IPC invoke
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            主进程 (main.js)                              │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  ipcMain.handle('tool:sync-data', handler)                      │     │
│  │  - 动态查找目标工具窗口 (componentWindows)                      │     │
│  │  - 调用 toolWindow.webContents.send('tool:receive-sync', data)  │     │
│  └─────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ IPC send
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      工具窗口 (window-frame.html)                        │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  window.electronAPI.on('tool:receive-sync', handler)            │     │
│  │  - 创建 CustomEvent 转发到 iframe                               │     │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                    │                                    │
│                                    ▼ CustomEvent                        │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  iframe (组件应用 App.tsx)                                       │     │
│  │  window.addEventListener('tool:receive-sync', handler)          │     │
│  │  - 解析数据并更新组件状态                                        │     │
│  └────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📡 IPC 通道清单

### 通用工具同步通道

| 通道名 | 方向 | 说明 |
|--------|------|------|
| `tool:sync-data` | 渲染→主 | 同步表格数据到工具窗口 |
| `tool:receive-sync` | 主→工具 | 工具接收同步数据 |
| `tool:get-sheets-list` | 工具→主→渲染 | 获取工作表列表 |
| `tool:mapping-configured` | 工具→主→渲染 | 通知映射配置完成 |
| `tool:create-table` | 工具→主→渲染 | 在主窗口创建新表格 |

### 通用窗口事件

| 事件名 | 方向 | 说明 |
|--------|------|------|
| `component:window-opened` | 主→渲染 | 组件窗口已打开 |
| `component:window-closed` | 主→渲染 | 组件窗口已关闭 |

---

## ⚡ 零代码扩展：元数据配置

> [!IMPORTANT]
> **添加新组件时无需修改 ConfigNexus 核心代码！**
> 
> 只需在组件的 `metadata.json` 中配置 `sync` 字段即可。

### metadata.json 完整配置

```json
{
    "name": "my_app",
    "version": "0.0.1",
    "description": "我的应用",
    "author": "ConfigNexus Team",
    "toolType": "my_tool",
    "category": "tool",
    "componentType": "editor",
    "icon": "package",
    "devPort": 5180,
    "keywords": ["keyword1", "keyword2"],
    "configNexusVersion": "1.0.0",
    "sync": {
        "enabled": true,
        "displayName": "我的同步",
        "buttonColor": {
            "gradient": "linear-gradient(135deg, #ff2a2a 0%, #ff6b6b 100%)",
            "shadow": "rgba(255, 42, 42, 0.4)",
            "shadowHover": "rgba(255, 42, 42, 0.5)"
        }
    }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 组件目录名 |
| `version` | string | 版本号 |
| `description` | string | 组件描述 |
| `author` | string | 作者 |
| `toolType` | string | **唯一工具类型标识** |
| `category` | string | 分类 (tool) |
| `componentType` | string | **组件类型** (`editor` 编辑类 / `preview` 演示类) |
| `icon` | string | Lucide 图标名 |
| `devPort` | number | 开发服务器端口 |
| `sync.enabled` | boolean | 是否启用同步功能 |
| `sync.displayName` | string | 同步按钮显示名称 |
| `sync.buttonColor` | object | 按钮颜色配置 |

---

## 📤 数据同步 API - 完整实现

### 1. TypeScript 类型声明

在组件的 `types.ts` 或单独的 `electron.d.ts` 中声明：

```typescript
// types.ts 或 electron.d.ts

// 同步数据格式
export interface SyncPayload {
    sheetData: {
        [sheetName: string]: any[][];  // 工作表名 -> 二维数组
    };
    timestamp: number;
}

// 工作表信息
export interface SheetInfo {
    name: string;
    columns: { letter: string; name: string }[];
}

// electronAPI 全局声明
declare global {
    interface Window {
        electronAPI?: {
            // 调用主进程方法
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            
            // 监听主进程事件
            on: (channel: string, callback: (event: any, ...args: any[]) => void) => void;
            
            // 获取工作表列表
            getSheetsList: () => Promise<{
                success: boolean;
                sheets: SheetInfo[];
                currentSheetName?: string;
            }>;
            
            // 通知映射已配置
            notifyMappingConfigured: (toolType: string, configured: boolean) => Promise<void>;
            
            // 创建表格
            createTable: (payload: {
                toolType: string;
                tableName?: string;
                data: {
                    sheets: Array<{
                        name: string;
                        celldata: any[];
                        row: number;
                        column: number;
                    }>;
                };
            }) => Promise<{ success: boolean; error?: string }>;
        };
    }
}

export {};
```

### 2. 组件接收数据 - 完整模板

```typescript
// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { SyncPayload, TaskFieldMapping, colToIndex, STORAGE_KEY_MAPPING, DEFAULT_TASK_MAPPING } from './types';

export default function App() {
    // 字段映射状态 - 从 localStorage 加载
    const [fieldMapping, setFieldMapping] = useState<TaskFieldMapping>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_MAPPING);
            return saved ? JSON.parse(saved) : DEFAULT_TASK_MAPPING;
        } catch {
            return DEFAULT_TASK_MAPPING;
        }
    });

    // 映射配置状态
    const [isMappingConfigured, setIsMappingConfigured] = useState(false);

    // Toast 状态
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ 
        message: '', 
        visible: false 
    });

    // 显示 Toast
    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);

    // 检查映射是否已配置
    useEffect(() => {
        const configured = !!fieldMapping.sheetName && 
                           !!fieldMapping.columns.id && 
                           !!fieldMapping.columns.title;
        setIsMappingConfigured(configured);
    }, [fieldMapping]);

    // 解析表格数据并加载
    const parseAndLoadData = useCallback((sheetData: any[][]) => {
        if (!sheetData || sheetData.length === 0) {
            console.warn('[App] 收到空数据');
            return;
        }

        const { startRow, columns } = fieldMapping;
        const parsedItems: any[] = [];

        for (let i = startRow - 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (!row) continue;

            const idIdx = colToIndex(columns.id);
            const id = row[idIdx];
            if (!id) continue; // 跳过空行

            // 解析数据...
            const item = {
                id: String(id),
                title: row[colToIndex(columns.title)] || '未命名',
                // ... 其他字段
            };

            parsedItems.push(item);
        }

        if (parsedItems.length > 0) {
            // 更新状态
            setItems(parsedItems);
            showToast(`成功加载 ${parsedItems.length} 条数据`);
            console.log(`[App] 成功解析 ${parsedItems.length} 条数据`);
        } else {
            console.warn('[App] 未解析到有效数据');
        }
    }, [fieldMapping, showToast]);

    // 监听 tool:receive-sync 数据同步事件
    useEffect(() => {
        if (!isMappingConfigured) {
            console.log('[App] 跳过注册同步监听 - 映射未配置');
            return;
        }

        console.log('[App] 注册 tool:receive-sync 监听器');

        const handleReceiveSync = (payload: SyncPayload) => {
            console.log('[App] ====== 收到数据同步 ======');
            console.log('[App] 时间戳:', payload?.timestamp);

            const { sheetData } = payload;
            if (!sheetData) {
                console.error('[App] ❌ sheetData 为空');
                return;
            }

            console.log('[App] 寻找工作表:', fieldMapping.sheetName);
            const targetSheet = sheetData[fieldMapping.sheetName];

            if (!targetSheet) {
                console.warn('[App] ❌ 未找到目标工作表:', fieldMapping.sheetName);
                console.warn('[App] 可用的工作表:', Object.keys(sheetData));
                return;
            }

            console.log('[App] ✅ 开始解析数据...');
            parseAndLoadData(targetSheet);
        };

        // 处理从 window-frame.html 转发的 CustomEvent
        const handleCustomEvent = (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('[App] 收到 CustomEvent tool:receive-sync');
            handleReceiveSync(customEvent.detail);
        };

        // 注册 IPC 监听（直接 Electron 环境）
        if (window.electronAPI?.on) {
            window.electronAPI.on('tool:receive-sync', (_event: any, payload: SyncPayload) => {
                handleReceiveSync(payload);
            });
        }

        // 注册 CustomEvent 监听（当运行在 iframe 中时）
        window.addEventListener('tool:receive-sync', handleCustomEvent);
        console.log('[App] ✅ CustomEvent 监听器注册成功');

        return () => {
            console.log('[App] 移除 tool:receive-sync 监听器');
            window.removeEventListener('tool:receive-sync', handleCustomEvent);
        };
    }, [isMappingConfigured, fieldMapping, parseAndLoadData]);

    // ... 组件渲染
}
```

---

## 📋 工作表列表 API

### 获取工作表列表

```typescript
// 在 DataMappingModal.tsx 中使用
const fetchSheetsList = async () => {
    setIsLoading(true);
    try {
        if (window.electronAPI?.getSheetsList) {
            const result = await window.electronAPI.getSheetsList();
            // result: { success: true, sheets: [...], currentSheetName: '...' }
            
            if (result.success && result.sheets) {
                setAvailableSheets(result.sheets);
                
                // 自动选择当前工作表
                if (result.currentSheetName) {
                    const currentSheet = result.sheets.find(
                        s => s.name === result.currentSheetName
                    );
                    if (currentSheet) {
                        setSelectedSheet(currentSheet);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch sheets:', error);
    } finally {
        setIsLoading(false);
    }
};
```

---

## 🔔 映射配置通知

当用户完成字段映射配置后，通知主窗口显示同步按钮：

```typescript
// 在保存映射配置时调用
const handleSave = async () => {
    // 1. 保存到 localStorage
    localStorage.setItem(STORAGE_KEY_MAPPING, JSON.stringify(mapping));

    // 2. 通知主窗口映射已配置
    if (window.electronAPI?.notifyMappingConfigured) {
        await window.electronAPI.notifyMappingConfigured('my_tool', true);
    }

    // 3. 回调通知父组件
    onMappingConfirmed(mapping);
    onClose();
};
```

---

## 📝 创建表格 API

组件可以请求在主窗口创建新表格。**强烈建议用声明式签名**，让 SDK 按用户的"表格结构配置"（设置 → 编辑器 → 表格结构配置）自动铺表头。

### 推荐写法：声明列定义 + 数据行

```typescript
import { cnx } from '../_shared/sdk/confignexus-sdk';

const handleCreateTable = async () => {
    const columns = [
        { fieldName: 'id',      fieldNameCN: '物品ID', dataType: 'int',    description: '物品唯一 ID' },
        { fieldName: 'name',    fieldNameCN: '名称',   dataType: 'string', description: '物品名称多语言 key' },
        { fieldName: 'quality', fieldNameCN: '品质',   dataType: 'int',    description: '品质等级' },
    ];

    const rows = items.map(item => [item.id, item.name, item.quality]);

    const result = await cnx.createTable({
        toolType: 'bag',
        tableName: 'ItemData',
        columns,   // 声明列：SDK 按 schema 自动构造表头
        rows,      // 数据二维数组（顺序与 columns 一致）
    });

    if (result.success) {
        console.log('Table created successfully');
    } else {
        console.error('Failed to create table:', result.error);
    }
};
```

**关键点**：
- 用户在「设置 → 表格结构配置」里选「精简(3行)」、「标准(5行)」、「前后端分离」、「完整(7行)」时，组件创建出的表会**自动按对应行数和顺序铺表头**，不需要组件改一行代码。
- 不要再硬编码 `headerRow1 / headerRow2 / headerRow3` 然后手动 push 到 `celldata`。
- 数据行从 `schema.dataStartRow` 自动起算，不要写死 `r + 3`。

详细规范见 [`05_字段映射规范.md`](./05_字段映射规范.md#-按表格结构配置动态创建表格)。

### 兼容老签名（不推荐新组件使用）

直接传完整 `data.sheets` 仍然支持，但**表头写死**、无法跟随用户的"表格结构配置"：

```typescript
// ⚠️ 不推荐
await cnx.createTable({
    toolType: 'bag',
    tableName: 'ItemData',
    data: {
        sheets: [{
            name: 'ItemData',
            row: 100,
            column: 20,
            celldata: [ /* 手动 push 表头和数据 */ ]
        }]
    }
});
```

---

## 📊 数据格式规范

### SyncPayload 结构

```typescript
interface SyncPayload {
    sheetData: {
        [sheetName: string]: any[][];  // 二维数组，原始单元格数据
    };
    timestamp: number;       // 同步时间戳
}

// 示例数据
const examplePayload: SyncPayload = {
    sheetData: {
        'Mission_Data': [
            ['ID', '名称', '描述', '类型'],      // 第1行 (表头)
            ['int', 'string', 'string', 'string'], // 第2行 (类型)
            ['任务ID', '任务名称', '任务描述', '任务类型'], // 第3行 (描述)
            [1001, '每日签到', '完成每日签到', 'DAILY'],  // 第4行 (数据)
            [1002, '击败敌人', '击败10个敌人', 'DAILY'],  // 第5行 (数据)
        ],
        'Sheet2': [...]
    },
    timestamp: 1703299200000
};
```

### SheetInfo 结构

```typescript
interface SheetInfo {
    name: string;
    columns: Array<{
        letter: string;  // 'A', 'B', 'C', ...
        name: string;    // 表头名称
    }>;
}

// 示例数据
const exampleSheetInfo: SheetInfo = {
    name: 'Mission_Data',
    columns: [
        { letter: 'A', name: 'ID' },
        { letter: 'B', name: '名称' },
        { letter: 'C', name: '描述' },
        { letter: 'D', name: '类型' },
    ]
};
```

---

## 🔧 调试技巧

### 添加详细日志

```typescript
// 在接收数据时添加日志
const handleReceiveSync = (payload: SyncPayload) => {
    console.group('[App] 数据同步');
    console.log('时间戳:', new Date(payload.timestamp).toISOString());
    console.log('可用工作表:', Object.keys(payload.sheetData));
    console.log('目标工作表:', fieldMapping.sheetName);
    
    const targetSheet = payload.sheetData[fieldMapping.sheetName];
    if (targetSheet) {
        console.log('数据行数:', targetSheet.length);
        console.log('前3行数据:', targetSheet.slice(0, 3));
    } else {
        console.warn('未找到目标工作表');
    }
    console.groupEnd();
    
    // ... 继续处理
};
```

### 模拟数据（开发环境）

```typescript
// 当 electronAPI 不可用时使用模拟数据
if (!window.electronAPI?.getSheetsList) {
    console.log('[Dev] Using mock data');
    const mockSheets: SheetInfo[] = [
        {
            name: 'Sheet1',
            columns: [
                { letter: 'A', name: 'ID' },
                { letter: 'B', name: '名称' },
                { letter: 'C', name: '描述' },
            ]
        }
    ];
    setAvailableSheets(mockSheets);
}
```

---

## ✅ IPC 通信检查清单

### 类型声明
- [ ] 声明了 `SyncPayload` 接口
- [ ] 声明了 `SheetInfo` 接口
- [ ] 声明了 `window.electronAPI` 全局类型

### 数据接收
- [ ] 组件监听了 `tool:receive-sync` 事件
- [ ] 同时处理 IPC 和 CustomEvent（兼容 iframe）
- [ ] 正确解析 sheetData 结构
- [ ] 处理目标工作表不存在的情况

### 映射配置
- [ ] 实现了 `getSheetsList` 调用
- [ ] 实现了 `notifyMappingConfigured` 调用
- [ ] 映射配置持久化到 localStorage

### 元数据
- [ ] `metadata.json` 配置了 `sync` 字段
- [ ] `toolType` 值唯一且正确

### 清理
- [ ] 组件卸载时清理了事件监听器
- [ ] 使用 useEffect 的 cleanup 函数

