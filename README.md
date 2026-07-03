# ConfigNexus 官网

ConfigNexus 官方网站，纯静态页面，托管在 GitHub Pages，自定义域名 **confignexus.org**。

## 文件说明

| 文件 | 用途 |
|------|------|
| `index.html` | 首页 |
| `features.html` | 功能介绍 |
| `download.html` | 下载页（安装包链接占位，待上线后替换） |
| `docs.html` | 快速上手文档 |
| `site.css` | 共用样式（白色玻璃拟态主题，改配色只改这里） |
| `CNAME` | GitHub Pages 自定义域名绑定（confignexus.org） |
| `.nojekyll` | 关闭 GitHub Pages 的 Jekyll 处理 |

## 本地预览

直接用浏览器打开 `index.html` 即可。无需任何构建步骤。

## 修改内容

- 改文字：直接编辑对应 `.html` 里的中文。
- 改配色：编辑 `site.css` 顶部 `:root` 里的颜色变量（如 `--acc` 是主题强调色）。
- 换软件截图：把 `download.html` / `index.html` 里"软件界面截图占位"那块替换成 `<img>`。
- 补下载链接：把 `download.html` 里"即将提供下载"的按钮改成真实下载地址。

## 部署

推送到 GitHub 仓库后，在仓库 **Settings → Pages** 中选择从 `main` 分支根目录发布。DNS 在域名服务商（Spaceship）配置：apex 域名加 A 记录指向 GitHub Pages 的 IP，`www` 加 CNAME 指向 `<用户名>.github.io`。

---

## ConfigNexus Matrix Boundary

This repository owns the public website only: static pages, public docs snapshots, download pages, and public workshop/promo presentation.

Generated/synced areas:

- `content/md`
- `docs/Res-*`
- `skills/confignexus-component-dev/references`
- `docs-data.js`
- `docs-manifest.js`

Do not edit generated/synced areas directly. Change the source repository and rerun the sync/build script.

Website-owned areas:

- `index.html`
- `features.html`
- `download.html`
- `workshop.html`
- `site.css`
- `site.js`
- `i18n.js`

Cross-repository content must move through sync scripts, not manual copy-paste.
