// 把 confignexus-component-dev 技能复制安装到 Claude 的 skills 扫描目录。
// 用复制而非软链（规避 Windows 权限 / 跨盘 / 隐藏依赖，保持目标独立）。
//
// 目标优先级：
//   --dest=<路径>        显式指定目标 skills 目录
//   --target=app [--app-root=<App根>]   装到 App 的 .claude/skills（组件开发实际发生地）
//   默认                 用户级 ~/.claude/skills
//
// 用法：
//   node skills/install.mjs                       # 装到 ~/.claude/skills
//   node skills/install.mjs --target=app          # 装到 <同级>/configNexus-1/.claude/skills
//   node skills/install.mjs --dest=D:/x/.claude/skills
import { existsSync, rmSync, cpSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));   // 仓库根（skills/ 的上一级）
const SKILL = 'confignexus-component-dev';
const SRC = join(ROOT, 'skills', SKILL);

const argv = process.argv.slice(2);
const dest = (argv.find(a => a.startsWith('--dest=')) || '').split('=')[1];
const target = (argv.find(a => a.startsWith('--target=')) || '').split('=')[1];
const appArg = (argv.find(a => a.startsWith('--app-root=')) || '').split('=')[1];

let skillsDir;
if (dest) {
  skillsDir = dest;
} else if (target === 'app') {
  const app = appArg || process.env.CONFIGNEXUS_APP_ROOT || join(dirname(ROOT), 'configNexus-1');
  skillsDir = join(app, '.claude', 'skills');
} else {
  skillsDir = join(homedir(), '.claude', 'skills');
}

if (!existsSync(SRC)) { console.error('[install] 技能源不存在：' + SRC); process.exit(1); }

const out = join(skillsDir, SKILL);
mkdirSync(skillsDir, { recursive: true });
rmSync(out, { recursive: true, force: true });
cpSync(SRC, out, { recursive: true });
console.log('[install] 已安装技能 ' + SKILL + ' → ' + out);
console.log('[install] 开一个新的 Claude 会话即可被发现；说“开发一个 ConfigNexus 创意工坊组件”触发。');
