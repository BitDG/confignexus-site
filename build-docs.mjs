// 生成 docs-data.js：把四语教程 Markdown 打包成一个 JS 对象，供官网文档页离线渲染
// （避免 file:// 下 fetch 被浏览器拦截）。Markdown 源包括 App 同步快照 content/md，
// 以及仅由官网维护的 content/site-md；媒体已提交在 docs/Res-*，构建不再外拷。
// 构建先做一致性 + 媒体引用校验，失败则非零退出且不写产物，通过后才写 docs-data.js。
// 用法：node build-docs.mjs
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));   // 仓库根（脚本所在目录），不写死绝对路径
const CONTENT_MD = join(ROOT, 'content', 'md');
const SITE_MD = join(ROOT, 'content', 'site-md');
const LANGS = ['zh', 'en', 'ja', 'ko'];

// 已知历史缺失媒体白名单：site 与 App 上游均无此文件，降级为 WARN 不阻断构建。
// 详见 dev/issues.md，待另行处理。
const MEDIA_MISSING_WHITELIST = new Set([
  'Res/zh/videos/py脚本生成.webm',
]);

// ---------- 1) 扫四语 md ----------
function walk(dir, base, out) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full, base, out); continue; }
    if (!name.endsWith('.md') || name === 'CHANGELOG.md') continue;
    const key = relative(base, full).replace(/\\/g, '/').replace(/\.md$/, '');
    out[key] = readFileSync(full, 'utf8');
  }
}

const DOCS = {};
for (const lang of LANGS) {
  const out = {};
  for (const root of [CONTENT_MD, SITE_MD]) {
    const base = join(root, lang);
    if (existsSync(base)) walk(base, base, out);
  }
  DOCS[lang] = out;
}

// ---------- 2) 校验（必须先于产物；有错则非零退出且不写）----------
let errors = 0, warns = 0;
const err = (m) => { console.error('  [ERROR] ' + m); errors++; };
const warn = (m) => { console.warn('  [WARN] ' + m); warns++; };

// 2a) manifest 一致性
try {
  const mtext = readFileSync(join(ROOT, 'docs-manifest.js'), 'utf8');
  const m = mtext.match(/window\.DOC_MANIFEST\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) throw new Error('未能从 docs-manifest.js 解析 DOC_MANIFEST');
  const manifest = JSON.parse(m[1]);
  console.log('manifest 条目：' + manifest.length);

  const referenced = {}; LANGS.forEach(l => referenced[l] = new Set());
  for (const item of manifest) {
    for (const lang of LANGS) {
      const k = item.keys[lang];
      if (k == null) continue;
      referenced[lang].add(k);
      // 硬错误：manifest 引用了不存在的 md
      if (!(k in DOCS[lang])) err('manifest 引用了不存在的文件：' + lang + ' / ' + k + '（id=' + item.id + '）');
    }
    // 硬错误：缺中文兜底
    if (item.keys.zh == null) err('manifest 条目缺中文兜底：id=' + item.id);
  }
  // 软警告：磁盘有但 manifest 未收录（可能是待收录的新篇，不阻断）
  for (const lang of LANGS) {
    for (const k of Object.keys(DOCS[lang])) {
      if (!referenced[lang].has(k)) warn('磁盘有但 manifest 未收录：' + lang + ' / ' + k);
    }
  }
} catch (e) {
  err('manifest 校验失败：' + e.message);
}

// 2b) 媒体引用存在性（图片 + 视频，限 Res/<lang>/ 开头的本地引用）
function checkMediaRef(ref, where) {
  ref = ref.trim();
  if (!/^Res\/(zh|en|ja|ko)\//.test(ref)) return;          // 只校验站内 Res 媒体
  const target = 'docs/' + ref.replace(/^Res\/(zh|en|ja|ko)\//, 'Res-$1/');
  if (existsSync(join(ROOT, target))) return;
  if (MEDIA_MISSING_WHITELIST.has(ref)) { warn('已知缺失媒体（白名单）：' + ref + '（' + where + '）'); return; }
  err('媒体引用指向不存在的文件：' + ref + ' → ' + target + '（' + where + '）');
}
for (const lang of LANGS) {
  for (const [key, md] of Object.entries(DOCS[lang])) {
    const where = lang + ' / ' + key;
    let m;
    const imgRe = /!\[[^\]]*\]\(([^)]+)\)/g;
    while ((m = imgRe.exec(md))) checkMediaRef(m[1], where);
    const vidRe = /^video:\s*(.+?)(?:\|.*)?\s*$/gm;
    while ((m = vidRe.exec(md))) checkMediaRef(m[1], where);
  }
}

if (errors > 0) {
  console.error('校验未通过：' + errors + ' 条错误' + (warns ? ('、' + warns + ' 条警告') : '') + '，已中止，未写出 docs-data.js。');
  process.exit(1);
}

// ---------- 3) 校验通过，写产物 ----------
writeFileSync(join(ROOT, 'docs-data.js'), 'window.DOCS = ' + JSON.stringify(DOCS) + ';\n', 'utf8');
console.log('docs-data.js 生成：' + LANGS.map(l => l + '=' + Object.keys(DOCS[l]).length).join(' / '));
console.log(warns === 0 ? '校验通过：manifest 与媒体引用一致。' : ('校验通过：' + warns + ' 条警告（见上）。'));
