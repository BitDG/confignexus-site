// 一次性脚本：读创意工坊组件的 metadata.json，生成站点用的 workshop-components.js。
// 产物提交进本仓库，官网构建期不读组件源——保持站点构建独立（见前序「官网文档独立化」任务）。
//
// 源路径优先级（不写死私有绝对路径）：
//   1) --src=<components 目录>
//   2) 环境变量 CONFIGNEXUS_WORKSHOP_COMPONENTS
//   3) 同级目录回退：<site 仓库上一级>/configNexus-workshop/components
//
// 用法：node scripts/gen-workshop-data.mjs [--src=E:/configNexus-workshop/components]
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url))); // 站点仓库根（scripts/ 上一级）
const argv = process.argv.slice(2);
const srcArg = (argv.find(a => a.startsWith('--src=')) || '').split('=')[1];
const SRC = srcArg || process.env.CONFIGNEXUS_WORKSHOP_COMPONENTS
  || join(dirname(ROOT), 'configNexus-workshop', 'components');

const REPO_URL = 'https://github.com/digua12331/confignexus-workshop';

if (!existsSync(SRC)) {
  console.error('[gen-workshop] 组件源目录不存在：' + SRC + '（用 --src= 指定）');
  process.exit(1);
}

const components = [];
for (const name of readdirSync(SRC)) {
  if (name.startsWith('_')) continue; // 跳过 _shared / _template
  const dir = join(SRC, name);
  if (!statSync(dir).isDirectory()) continue;
  const metaPath = join(dir, 'metadata.json');
  if (!existsSync(metaPath)) continue; // 仅收有 metadata 的组件
  let meta;
  try { meta = JSON.parse(readFileSync(metaPath, 'utf8')); }
  catch (e) { console.warn('[gen-workshop] 跳过（metadata 解析失败）：' + name); continue; }

  const dn = meta.displayNames || {};
  components.push({
    id: meta.name || name,
    dir: name,
    icon: meta.icon || '',
    displayName: {
      zh: dn['zh-CN'] || meta.name || name,
      en: dn['en-US'] || dn['zh-CN'] || meta.name || name,
      ja: dn['ja-JP'] || dn['zh-CN'] || meta.name || name,
      ko: dn['ko-KR'] || dn['zh-CN'] || meta.name || name,
    },
    desc: meta.description || '',
    repoPath: REPO_URL + '/tree/main/components/' + name,
  });
}

components.sort((a, b) => a.dir.localeCompare(b.dir));

const banner = '// 自动生成：node scripts/gen-workshop-data.mjs。勿手改；改组件 metadata 后重跑。\n';
const body = 'window.WORKSHOP_REPO = ' + JSON.stringify(REPO_URL) + ';\n'
  + 'window.WORKSHOP_COMPONENTS = ' + JSON.stringify(components, null, 2) + ';\n';
writeFileSync(join(ROOT, 'workshop-components.js'), banner + body, 'utf8');
console.log('[gen-workshop] 写出 workshop-components.js：' + components.length + ' 个组件，源 ' + SRC);
