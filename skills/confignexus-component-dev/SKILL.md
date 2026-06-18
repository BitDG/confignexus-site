---
name: confignexus-component-dev
description: >-
  开发或制作 ConfigNexus（配置大师）创意工坊组件 / 插件时使用。当用户要"做一个 ConfigNexus 组件"
  "开发创意工坊插件""给配置大师写一个 React 子应用""按 ConfigNexus 规范搭组件脚手架"时，
  加载本技能，按 references/ 下 13 篇规范（项目结构、技术栈、IPC API、字段映射、数据格式、
  Cyberpunk UI 风格、多语言、需求说明书模板）来设计与生成代码。
---

# ConfigNexus 创意工坊组件开发

第三方在 ConfigNexus（配置大师）创意工坊里开发组件的完整规范。组件是嵌入主程序的
React + Vite + TailwindCSS 子应用，通过统一 IPC API 与主程序交换数据，并遵循 Cyberpunk 视觉风格。

## 技术栈版本基准（权威，优先级高于下方文档正文）

下面 13 篇文档是 App 上游文档的快照，其中出现的具体版本号**可能滞后**（例如
`03_依赖管理规范` 仍写 vite `^6.0.3`）。**安装依赖时一律以 ConfigNexus App 的
`app/package.json` 为准。** 本技能同步时（见 references 文件头）App 实际版本为：

| 包 | 版本 |
|---|---|
| vite | ^7.3.0 |
| @vitejs/plugin-react | ^5.1.2 |
| @tailwindcss/vite | ^4.1.18 |
| tailwindcss | ^4.1.18 |
| react / react-dom | ^19.2.0 |
| typescript | ~5.8.2 |

版本号与文档正文冲突时，以本表 / App `package.json` 为准。

## 文档索引（13 篇，按阅读顺序）

先读 `00`（总览）与 `12`（需求说明书模板，非程序员也能填，开工前先填）。再按需查其余各篇。
注意：上游 `00` 总览的导航表实际漏列了 09/10/11，**以本索引为准**。

| 序号 | 文档 | 何时读 |
|------|------|--------|
| 00 | [组件开发总览](./references/00_组件开发总览.md) | 最先读：概述、架构、参考应用 |
| 01 | [项目结构规范](./references/01_项目结构规范.md) | 建目录、起文件名前 |
| 02 | [技术栈规范](./references/02_技术栈规范.md) | 配 vite.config / 引入插件时 |
| 03 | [依赖管理规范](./references/03_依赖管理规范.md) | 装依赖前（版本以上表为准） |
| 04 | [IPC通信API规范](./references/04_IPC通信API规范.md) | 做窗口打开 / 数据同步 / 与主程序通信时 |
| 05 | [字段映射规范](./references/05_字段映射规范.md) | 对接 ConfigNexus 数据、做字段映射弹窗时 |
| 06 | [数据格式规范](./references/06_数据格式规范.md) | 定义数据结构 / 类型时 |
| 07 | [UI组件规范](./references/07_UI组件规范.md) | 做界面：Cyberpunk 设计系统 |
| 08 | [开发流程指南](./references/08_开发流程指南.md) | 从零创建新组件的步骤 |
| 09 | [代码组织规范](./references/09_代码组织规范.md) | 拆分模块 / 组织代码时 |
| 10 | [资源加载规范](./references/10_资源加载规范.md) | 加载图片 / 视频等美术资源时 |
| 11 | [多语言支持规范](./references/11_多语言支持规范.md) | 组件需要多语言时 |
| 12 | [组件需求说明书模板](./references/12_组件需求说明书模板.md) | 开工前先填，明确需求 |

## 使用方式

1. 用户提出组件需求时，先引导其参照 `12` 明确需求，再读 `00`+`08` 把握整体流程。
2. 写代码时按 `01/02/03` 搭脚手架（版本以上表为准），按 `04/05/06` 对接数据与通信，按 `07` 落 UI 风格。
3. 涉及资源加载 / 多语言 / 代码组织分别查 `09/10/11`。

> 本技能是 ConfigNexus 官网仓库（configNexus-site）维护的可分发包。references 由
> `node sync-from-app.mjs` 从 App 单向同步并自动清洗失效链接——**不要反向手改 references**。
