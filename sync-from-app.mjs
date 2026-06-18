// 一键从 ConfigNexus App 上游同步内容到本站点（单向 App → site），随后自动构建+校验。
// 本文件是仓库内【唯一可执行】引用 App 路径之处；App 根路径不写死，按以下优先级解析：
//   1) 命令行 --app-root=<路径>
//   2) 环境变量 CONFIGNEXUS_APP_ROOT
//   3) 同级目录回退：<site 仓库的上一级>/configNexus-1
//
// 同步三类内容（镜像式：先清空目标再写入，清掉上游已删除的旧文件）：
//   - <app>/src/renderer/welcome/md   → content/md（站点教程 md 快照）
//   - <app>/src/renderer/welcome/Res  → docs/Res-*（教程媒体）
//   - <app>/app/docs/组件开发方案      → skills/confignexus-component-dev/references（清洗失效链接）
//
// 安全：先确认三个上游源都存在再动手；目标若有未提交改动默认拒绝，需 --force。
// 用法：node sync-from-app.mjs [--app-root=E:/configNexus-1] [--force]
import { existsSync, readdirSync, readFileSync, writeFileSync, rmSync, cpSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';
import { cleanComponentDoc } from './scripts/clean-component-doc.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const FORCE = argv.includes('--force');
const appArg = (argv.find(a => a.startsWith('--app-root=')) || '').split('=')[1];
const APP = appArg || process.env.CONFIGNEXUS_APP_ROOT || join(dirname(ROOT), 'configNexus-1');

const ts = new Date().toISOString();
const log = (m) => console.log('[sync] ' + m);
const fail = (m) => { console.error('[sync] 失败：' + m); process.exit(1); };

log('开始同步（' + ts + '）App 根：' + APP);

// 1) 校验三个上游源存在
const SRC = {
  md:   join(APP, 'src', 'renderer', 'welcome', 'md'),
  res:  join(APP, 'src', 'renderer', 'welcome', 'Res'),
  comp: join(APP, 'app', 'docs', '组件开发方案'),
};
if (!existsSync(APP)) fail('App 根不存在：' + APP + '（用 --app-root= 或环境变量 CONFIGNEXUS_APP_ROOT 指定）');
for (const [k, p] of Object.entries(SRC)) {
  if (!existsSync(p)) fail('上游源缺失（' + k + '）：' + p);
}
log('上游三源齐全 ✓');

// 2) 目标未提交改动保护
const TARGETS = ['content/md', 'docs/Res-en', 'docs/Res-ja', 'docs/Res-ko', 'docs/Res-zh',
                 'skills/confignexus-component-dev/references', 'docs-data.js'];
try {
  const dirty = execSync('git status --porcelain -- ' + TARGETS.map(t => '"' + t + '"').join(' '),
    { cwd: ROOT, encoding: 'utf8' }).trim();
  if (dirty && !FORCE) {
    fail('目标路径存在未提交改动，默认拒绝覆盖（避免吞掉本地编辑）。确认后加 --force 重跑。\n' + dirty);
  }
  if (dirty && FORCE) log('检测到未提交改动，--force 已指定，继续覆盖。');
} catch (e) {
  log('（git 状态检查跳过：' + e.message.split('\n')[0] + '）');
}

// 3) 镜像同步
let counts = { md: 0, res: 0, comp: 0 };
function countFiles(dir) {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) n += countFiles(full); else n++;
  }
  return n;
}

// 3a) md → content/md（镜像）
const mdDst = join(ROOT, 'content', 'md');
rmSync(mdDst, { recursive: true, force: true });
cpSync(SRC.md, mdDst, { recursive: true });
counts.md = countFiles(mdDst);
log('md → content/md：' + counts.md + ' 文件');

// 3b) Res/<lang> → docs/Res-<lang>（镜像）
for (const lang of readdirSync(SRC.res)) {
  const langSrc = join(SRC.res, lang);
  if (!statSync(langSrc).isDirectory()) continue;
  const langDst = join(ROOT, 'docs', 'Res-' + lang);
  rmSync(langDst, { recursive: true, force: true });
  cpSync(langSrc, langDst, { recursive: true });
  counts.res += countFiles(langDst);
}
log('Res → docs/Res-*：' + counts.res + ' 文件');

// 3c) 组件开发方案 → skill references（复制 + 清洗失效链接）
const refDst = join(ROOT, 'skills', 'confignexus-component-dev', 'references');
rmSync(refDst, { recursive: true, force: true });
mkdirSync(refDst, { recursive: true });
for (const f of readdirSync(SRC.comp)) {
  if (!f.endsWith('.md')) continue;
  writeFileSync(join(refDst, f), cleanComponentDoc(readFileSync(join(SRC.comp, f), 'utf8')), 'utf8');
  counts.comp++;
}
log('组件文档 → references：' + counts.comp + ' 篇（已清洗失效链接）');

// 4) 自动构建 + 校验
log('运行 build-docs.mjs 校验…');
const r = spawnSync(process.execPath, [join(ROOT, 'build-docs.mjs')], { cwd: ROOT, stdio: 'inherit' });
if (r.status !== 0) fail('构建/校验未通过（退出码 ' + r.status + '）。内容已同步但请检查校验错误。');

log('成功：md=' + counts.md + ' / res=' + counts.res + ' / 组件文档=' + counts.comp + ' 篇，构建校验通过。');
