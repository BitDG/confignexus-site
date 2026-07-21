import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliRoot = process.argv.find((arg) => arg.startsWith('--promo-root='))?.slice('--promo-root='.length);
const candidates = [
  cliRoot,
  process.env.CONFIGNEXUS_PROMO_ROOT,
  path.resolve(siteRoot, '..', 'confignexus-promo'),
  'F:\\VibeSpace\\confignexus-promo',
].filter(Boolean);
const promoRoot = candidates.find((candidate) => fs.existsSync(candidate));

if (!promoRoot) {
  console.error('找不到 confignexus-promo。请设置 CONFIGNEXUS_PROMO_ROOT 或传入 --promo-root=<path>。');
  process.exit(1);
}

const assets = [
  ['covers/campaign/01-main-promo-16x9-1080p.png', 'campaign-poster.png'],
  ['output/confignexus-promo-zh.mp4', 'overview-zh.mp4'],
  ['output/feature-videos/06-multi-format-import.mp4', 'multi-format-import.mp4'],
  ['output/feature-videos/01-data-validation.mp4', 'data-validation.mp4'],
  ['output/feature-videos/03-json-editor.mp4', 'json-editor.mp4'],
  ['welcome-res/Res/zh/images/引用关系图-整图.png', 'reference-graph.png'],
  ['welcome-res/Res/zh/images/脚本库面板.png', 'script-library.png'],
  ['welcome-res/Res/zh/videos/AI助手与AI自动化/AI工作表操作.webm', 'ai-worksheet.webm'],
  ['output/covers/screens/en-spreadsheet.png', 'spreadsheet-en.png'],
  ['output/covers/screens/en-json.png', 'json-en.png'],
  ['welcome-res/Res/zh/videos/批量编辑.webm', 'real/batch-edit.webm'],
  ['welcome-res/Res/zh/videos/验证规则DSL-规则组合.webm', 'real/validation-dsl.webm'],
  ['welcome-res/Res/zh/videos/导出数据.webm', 'real/export-data.webm'],
  ['welcome-res/Res/zh/videos/文件浏览器-打开与定位.webm', 'real/file-browser.webm'],
  ['welcome-res/Res/zh/videos/脚本库-保存复用.webm', 'real/script-library.webm'],
  ['welcome-res/Res/zh/videos/外部引用源-配置与引用.webm', 'real/external-reference.webm'],
  ['welcome-res/Res/zh/videos/引用关系图-定位引用.webm', 'real/reference-graph.webm'],
  ['welcome-res/Res/zh/videos/数据表对比-差异定位.webm', 'real/table-diff.webm'],
  ['welcome-res/Res/zh/videos/导出数据地址配置.webm', 'real/export-path.webm'],
  ['welcome-res/Res/zh/videos/整合多语言.webm', 'real/multilang.webm'],
  ['welcome-res/Res/zh/videos/ID生成.webm', 'real/id-generator.webm'],
];

const focusFrames = [
  ['output/feature-videos/06-multi-format-import.mp4', 'real/focus-import.png', '3.0', 'crop=1120:630:0:0'],
  ['welcome-res/Res/zh/videos/批量编辑.webm', 'real/focus-batch-edit.png', '6.6', 'crop=960:540:0:0'],
  ['welcome-res/Res/zh/videos/验证规则DSL-规则组合.webm', 'real/focus-validation-dsl.png', '1.0', 'crop=960:540:0:0'],
  ['welcome-res/Res/zh/videos/导出数据.webm', 'real/focus-export-data.png', '2.5', 'crop=960:540:0:180'],
  ['welcome-res/Res/zh/videos/文件浏览器-打开与定位.webm', 'real/focus-file-browser.png', '6.0', 'crop=960:540:0:0'],
  ['welcome-res/Res/zh/videos/脚本库-保存复用.webm', 'real/focus-script-library.png', '2.4', 'crop=960:540:0:0'],
  ['welcome-res/Res/zh/videos/外部引用源-配置与引用.webm', 'real/focus-external-reference.png', '2.6', 'crop=960:540:40:180'],
  ['welcome-res/Res/zh/videos/引用关系图-定位引用.webm', 'real/focus-reference-graph.png', '4.2', 'crop=1120:630:0:100'],
  ['welcome-res/Res/zh/videos/数据表对比-差异定位.webm', 'real/focus-table-diff.png', '3.3', 'crop=1120:630:0:60'],
  ['welcome-res/Res/zh/videos/导出数据地址配置.webm', 'real/focus-export-path.png', '2.3', 'crop=960:540:0:0'],
  ['welcome-res/Res/zh/videos/整合多语言.webm', 'real/focus-multilang.png', '2.4', 'crop=960:540:0:0'],
  ['welcome-res/Res/zh/videos/ID生成.webm', 'real/focus-id-generator.png', '2.8', 'crop=960:540:0:0'],
];

const missing = assets
  .map(([source]) => path.join(promoRoot, source))
  .filter((source) => !fs.existsSync(source));

if (missing.length) {
  console.error('素材同步已取消，以下白名单源文件不存在：');
  for (const source of missing) console.error(`- ${source}`);
  process.exit(1);
}

const targetRoot = path.join(siteRoot, 'assets', 'product');
fs.mkdirSync(targetRoot, { recursive: true });
for (const [source, target] of assets) {
  const targetPath = path.join(targetRoot, target);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(path.join(promoRoot, source), targetPath);
}

const ffmpeg = process.env.PROMO_FFMPEG || 'ffmpeg';
for (const [source, target, at, crop] of focusFrames) {
  const targetPath = path.join(targetRoot, target);
  const posterPath = path.join(targetRoot, target.replace('/focus-', '/poster-'));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  execFileSync(ffmpeg, [
    '-loglevel', 'error', '-y', '-ss', at, '-i', path.join(promoRoot, source),
    '-vf', 'scale=1280:720:flags=lanczos', '-frames:v', '1', posterPath,
  ]);
  execFileSync(ffmpeg, [
    '-loglevel', 'error', '-y', '-ss', at, '-i', path.join(promoRoot, source),
    '-vf', `${crop},scale=1280:720:flags=lanczos`, '-frames:v', '1', targetPath,
  ]);
}

console.log(`已同步 ${assets.length} 个白名单素材，并从真实录屏生成 ${focusFrames.length} 组完整海报与局部放大图。`);
