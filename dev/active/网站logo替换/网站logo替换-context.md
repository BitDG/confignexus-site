# 网站 logo 替换 · context

## 关键文件
- `index.html` / `features.html` / `download.html` / `docs.html`：导航处 `<a class="brand">` 内含 `<span class="mark">…4个 i…</span>`；`<head>` 无 favicon。
- `site.css`：`.brand .mark`（45-48 行）方块样式；`.brand:hover .mark i`（366-369 行）hover 样式；`.intro-brand`（306-308 行）开场品牌文字。
- `intro.js`：第 67 行 overlay.innerHTML 里的 `<div class="intro-brand">`。
- `assets/logo.png`：本次新增的 logo 资源。

## 决策记录
- 用 `<img>` 替换 CSS 画的方块，最直接，无需保留旧的 4 个 `<i>`。
- favicon 直接复用同一 png，不额外生成 .ico（现代浏览器支持 png favicon），避免无谓产物。
- 开场动画保留「ConfigNexus」文字，只在其上方加 logo 图，不改文字渐变样式。

## 依赖与约束
- 站点为静态站（有 CNAME），资源须放进仓库内相对路径 `assets/`，否则部署后取不到。
