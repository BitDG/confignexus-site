// 一次性脚本：读 mods 仓库的组件 metadata.json + 插件 manifest.json，生成站点用的 workshop-components.js。
// 产物提交进本仓库，官网构建期不读组件源——保持站点构建独立（见前序「官网文档独立化」任务）。
//
// 源路径优先级（不写死私有绝对路径，--src 指向 mods 仓库的 components 目录，plugins 取其同级）：
//   1) --src=<components 目录>
//   2) 环境变量 CONFIGNEXUS_WORKSHOP_COMPONENTS
//   3) 同级目录回退：<site 仓库上一级>/configNexus-mods/components
//
// 用法：node scripts/gen-workshop-data.mjs [--src=E:/configNexus-mods/components]
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url))); // 站点仓库根（scripts/ 上一级）
const argv = process.argv.slice(2);
const srcArg = (argv.find(a => a.startsWith('--src=')) || '').split('=')[1];
const SRC = srcArg || process.env.CONFIGNEXUS_WORKSHOP_COMPONENTS
  || join(dirname(ROOT), 'configNexus-mods', 'components');
const PLUGINS_SRC = join(dirname(SRC), 'plugins'); // 插件目录取 components 的同级

const REPO_URL = 'https://github.com/digua12331/confignexus-mods';

// 插件 manifest 无 runtime.icon 时，按 cnxCategory.form 兜底一个 emoji
const PLUGIN_FORM_ICON = { tool: '🔧', 'ai-runtime': '🤖', theme: '🎨', menu: '🧩' };

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

// 插件：读 plugins/<id>/manifest.json（manifest 只有中文名，故 name 单语；desc 仅中文）
const plugins = [];
if (existsSync(PLUGINS_SRC)) {
  for (const name of readdirSync(PLUGINS_SRC)) {
    if (name.startsWith('_')) continue; // 跳过 _shared
    const dir = join(PLUGINS_SRC, name);
    if (!statSync(dir).isDirectory()) continue;
    const manPath = join(dir, 'manifest.json');
    if (!existsSync(manPath)) continue; // 仅收有 manifest 的插件
    let man;
    try { man = JSON.parse(readFileSync(manPath, 'utf8')); }
    catch (e) { console.warn('[gen-workshop] 跳过（manifest 解析失败）：' + name); continue; }

    const form = (man.cnxCategory && man.cnxCategory.form) || '';
    const runtimeIcon = man.runtime && man.runtime.icon;
    plugins.push({
      id: man.id || name,
      dir: name,
      name: man.name || name,
      desc: man.description || '',
      icon: runtimeIcon || PLUGIN_FORM_ICON[form] || '🧩',
      form: form,
      repoPath: REPO_URL + '/tree/main/plugins/' + name,
    });
  }
  plugins.sort((a, b) => a.dir.localeCompare(b.dir));
} else {
  console.warn('[gen-workshop] 插件源目录不存在，跳过插件：' + PLUGINS_SRC);
}

const banner = '// 自动生成：node scripts/gen-workshop-data.mjs。勿手改；改组件 metadata 或插件 manifest 后重跑。\n';
const body = 'window.WORKSHOP_REPO = ' + JSON.stringify(REPO_URL) + ';\n'
  + 'window.WORKSHOP_COMPONENTS = ' + JSON.stringify(components, null, 2) + ';\n'
  + 'window.WORKSHOP_PLUGINS = ' + JSON.stringify(plugins, null, 2) + ';\n';
writeFileSync(join(ROOT, 'workshop-components.js'), banner + body, 'utf8');
console.log('[gen-workshop] 写出 workshop-components.js：' + components.length + ' 个组件 + ' + plugins.length + ' 个插件，源 ' + SRC);
