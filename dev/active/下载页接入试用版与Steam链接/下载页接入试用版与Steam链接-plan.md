# 下载页接入试用版与 Steam 链接 · plan（简单档）

## 这次干了啥
下载页（download.html）原来只有一个灰色「即将提供下载」的占位按钮。现在换成两个真按钮：
- **试用版**（itch.io）→ https://digua123.itch.io/confignexusai
- **Steam 版** → https://store.steampowered.com/app/4400360?beta=0

并更新按钮下方说明文字和「第 1 步」文案（4 语），去掉「即将提供/准备中」的措辞。

## 怎么验收
打开 download.html，下载卡片里看到两个可点按钮：「下载试用版（itch.io）」跳 itch.io 页面、「在 Steam 上获取」跳 Steam 页面；切英/日/韩文案正常。纯静态页面改动，不动任何数据，可回退。

## 改动文件
- download.html（按钮区 + data-i18n）
- i18n.js（4 语：新增 dl.btnTrial / dl.btnSteam，改 dl.note、dl.s1p）
