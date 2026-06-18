// 把上游「组件开发方案」文档复制进 skill 时做的确定性清洗。
// 创建 skill（一次性）和 sync-from-app.mjs（每次同步）都复用本函数，保证 re-sync 后仍清洗。
//
// 处理 1：中和指向 App 内示例 app 的失效相对链接 [文字](../../xxx) → 文字
//   - 仅匹配以 ../ 开头的相对上溯链接（指向 skill 内不存在的 App 目录）。
//   - 保留 13 篇之间有效的 ./0X_*.md 互链（以 ./ 开头，不被匹配）。
//   - 保留 http(s):// 外链。
// 处理 2：脱敏本机绝对路径——形如 `X:\…\app`（如 `cd X:\<本机目录>\…\app`）→ `path/to/app`
//   - 公开仓库不能泄露作者本机目录结构；用 ASCII 锚点匹配，不写死具体盘符/文件夹名。
//   - 只命中以 `\app` 结尾的本机绝对路径（开发文档里的 `cd 进 app 目录` 示例），
//     不误伤资源加载文档里 `C:\path\image.png`、`file:///…` 等示例。
export function cleanComponentDoc(text) {
  return text
    .replace(/\[([^\]]*)\]\(\.\.\/[^)]*\)/g, '$1')
    .replace(/[A-Za-z]:\\[^\r\n"]*?\\app\b/g, 'path/to/app');
}
