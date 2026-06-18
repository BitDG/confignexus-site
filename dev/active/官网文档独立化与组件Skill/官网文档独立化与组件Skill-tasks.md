# 官网文档独立化与组件Skill · 任务清单

- [x] 1. vendor md 进站点 content/md/{zh,en,ja,ko} → verify: content/md/zh 数到 34 篇(不含CHANGELOG)，en/ja/ko 各 20
- [x] 2. 改 build-docs.mjs 去机器硬编码(import.meta.url 推根)+读 content/md+删 Res 外拷 → verify: 源码 grep 不到 configNexus-1 与 E:/；改名 App 后 node build-docs.mjs 仍成功，打印 zh=34/en=20/ja=20/ko=20
- [x] 3. build 校验前置可阻断 + 新增媒体引用存在性校验(带已知缺失白名单) → verify: 制造坏 manifest 引用→非零退出且 docs-data.js 未改写；修好后退出0产物更新
- [x] 4. 建 sync-from-app.mjs(路径参数化/先验上游/默认拒覆盖/复制后自动build/CLI日志) → verify: App在场跑通且 git diff 仅限预期目录；删一个上游目录→非零退出未写入
- [x] 5. 打包 skill：references 13 篇+清洗6处失效链接+SKILL.md(frontmatter+全13篇索引)+对齐Vite版本 → verify: frontmatter合法；references 13篇齐；grep 不到 ../../ 失效链接
- [x] 6. 写 skills/install.mjs 复制式安装 + README 说明 → verify: 跑安装后 skill 落到目标 skills 目录；新会话能发现/触发
- [x] 7. 记 en/ja/ko Python脚本编辑器缺图 issue 到 dev/issues.md → verify: dev/issues.md 末尾出现该单行条目
