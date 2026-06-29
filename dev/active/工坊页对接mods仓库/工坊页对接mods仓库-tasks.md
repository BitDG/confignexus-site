# 工坊页对接 mods 仓库 · 任务清单

- [x] 仓库设为 public → verify: `gh repo view ...mods --json visibility` = PUBLIC ✓
- [x] 改 gen-workshop-data.mjs（REPO_URL/默认源/扫 plugins → WORKSHOP_PLUGINS）→ verify: node 跑通无报错 ✓
- [x] 跑生成器重写 workshop-components.js → verify: 文件含 16 组件 + 8 插件、URL 全为 confignexus-mods ✓
- [x] 改 workshop.js 加 renderPlugins + 两个按钮同步（.ws-repo-link）→ verify: 逻辑读 WORKSHOP_PLUGINS、空则隐藏 ✓
- [x] 改 workshop.html 加插件区 section + 改两处 GitHub 按钮 href → verify: DOM 有 #ws-plugins、href=mods ✓
- [x] 改 i18n.js 4 语补 pluginsTag/pluginsH + 组件计数 15→16 + ws.desc → verify: 4 语均有新键、无缺 ✓
- [x] 浏览器验收：本地起 http.server 打开 workshop.html（HTTP 200），6 条 GitHub URL 实测全 200 不 404 ✓（视觉由大哥最终确认）
