# skills/ — ConfigNexus 可分发技能包

本目录维护 ConfigNexus 官网仓库出品的 Claude 技能（Skill）。技能是给 AI 加载的「技能包」——
AI 加载后按其中规范帮人干活。技能源在此版本化，**用时需安装到 Claude 的 skills 扫描目录才会被发现**。

## confignexus-component-dev — 创意工坊组件开发

教 AI 按 ConfigNexus 创意工坊规范开发组件（React + Vite + TailwindCSS 子应用、IPC 对接、
Cyberpunk UI、多语言等，共 13 篇规范在 `references/`）。

`references/` 由 `node sync-from-app.mjs` 从 App 上游单向同步并自动清洗失效链接，
**不要反向手改 references**。

### 安装

```bash
# 装到用户级（任何项目都可用）
node skills/install.mjs

# 或装到 App 项目（组件开发实际发生地）
node skills/install.mjs --target=app

# 或指定任意目标 skills 目录
node skills/install.mjs --dest=D:/somewhere/.claude/skills
```

安装是**复制**（非软链，规避 Windows 权限/跨盘问题）。装好后开一个新的 Claude 会话，
说「我要开发一个 ConfigNexus 创意工坊组件」即可触发。

### 更新

App 那边规范更新后，先 `node sync-from-app.mjs` 把最新内容同步进本仓库，再重新 `node skills/install.mjs`。
