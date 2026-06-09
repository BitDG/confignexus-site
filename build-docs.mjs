// 生成 docs-data.js：把 ConfigNexus 软件里的中文教程 Markdown 打包成一个 JS 对象，
// 供官网文档页离线渲染（避免 file:// 下 fetch 被浏览器拦截）。
// 用法：node build-docs.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC = 'E:/configNexus-1/src/renderer/welcome/md/zh';
const OUT = 'E:/configNexus-site/docs-data.js';

const docs = {};
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!name.endsWith('.md')) continue;
    const key = relative(SRC, full).replace(/\\/g, '/').replace(/\.md$/, '');
    docs[key] = readFileSync(full, 'utf8');
  }
}
walk(SRC);

writeFileSync(OUT, 'window.DOCS = ' + JSON.stringify(docs) + ';\n', 'utf8');
console.log('生成完成：' + Object.keys(docs).length + ' 篇教程 → ' + OUT);
