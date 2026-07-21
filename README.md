# ConfigNexus 官网

ConfigNexus 官方网站，纯静态页面，托管在 GitHub Pages，自定义域名 **confignexus.org**。

## 文件说明

| 文件 | 用途 |
|------|------|
| `index.html` | 首页 |
| `features.html` | 功能介绍 |
| `download.html` | Windows 试用版与 Steam 完整版下载入口 |
| `docs.html` | 快速上手文档 |
| `site.css` | 共用样式（白色玻璃拟态主题，改配色只改这里） |
| `CNAME` | GitHub Pages 自定义域名绑定（confignexus.org） |
| `.nojekyll` | 关闭 GitHub Pages 的 Jekyll 处理 |

## 本地预览

无需安装依赖。为确保视频和页内路由行为与线上一致，建议从仓库根目录启动静态服务器后访问 `index.html`。

## 修改内容

- 改文字：直接编辑对应 `.html` 里的中文。
- 改配色：编辑 `site.css` 顶部 `:root` 里的颜色变量（如 `--acc` 是主题强调色）。
- 同步产品截图与视频：运行 `node scripts/sync-promo-assets.mjs`。可用 `CONFIGNEXUS_PROMO_ROOT` 或 `--promo-root=<path>` 指定素材仓库。
- 验收页面结构和素材引用：运行 `node scripts/check-site.mjs`。

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

- `content/site-md`
- `index.html`
- `features.html`
- `download.html`
- `workshop.html`
- `site.css`
- `site.js`
- `i18n.js`

Website-only tutorials belong in `content/site-md`. `build-docs.mjs` merges them with the App snapshot without letting `sync-from-app.mjs` overwrite them.

Cross-repository content must move through sync scripts, not manual copy-paste.
