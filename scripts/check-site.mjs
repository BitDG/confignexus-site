import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'features.html', 'download.html', 'workshop.html', 'docs.html'];
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const htmlByPage = Object.fromEntries(pages.map((page) => [page, read(page)]));

for (const [page, html] of Object.entries(htmlByPage)) {
  expect(html.includes('class="mobile-menu"'), `${page}: 缺少原生移动菜单`);
  expect(html.includes('data-i18n="nav.menu"'), `${page}: 移动菜单缺少多语言标签`);
}

const home = htmlByPage['index.html'];
expect(home.includes('data-product-demo'), 'index.html: 缺少真实产品演示媒体');
expect(!home.includes('product-preview'), 'index.html: 仍在使用手绘产品界面');
expect((home.match(/data-real-proof/g) || []).length === 4, 'index.html: 首页应有 4 条真实工作流证明');

const features = htmlByPage['features.html'];
for (const id of ['core-workflow', 'engineering', 'extensions']) {
  expect(features.includes(`id="${id}"`), `features.html: 缺少 #${id} 功能分组`);
}
expect((features.match(/data-real-proof/g) || []).length === 8, 'features.html: 功能页应有 8 条真实录制证明');
expect((home.match(/class="focus-detail"/g) || []).length === 4, 'index.html: 首页应有 4 张局部放大图');
expect((features.match(/class="focus-detail"/g) || []).length === 8, 'features.html: 功能页应有 8 张局部放大图');

const download = htmlByPage['download.html'];
expect((download.match(/class="download-choice(?:\s|")/g) || []).length === 1, 'download.html: 下载页应只保留一个 Steam 主卡片');
expect(download.includes('class="download-choice recommended steam-download-choice"'), 'download.html: 缺少 Steam 主下载卡片');
expect(download.includes('class="btn btn-primary" href="https://store.steampowered.com/app/4400360/ConfigNexus___AI/"'), 'download.html: 主按钮未指向当前 Steam 商店页');
expect(download.includes('class="itch-fallback"'), 'download.html: 缺少弱化的 itch.io 备用入口');

const css = read('site.css');
expect(/\.real-proof-card\{[^}]*background:transparent/s.test(css), 'site.css: 实录分镜外层仍是实体卡片');
expect(/\.proof-visual>\.product-media\{[^}]*background:#11160f/s.test(css), 'site.css: 实录视频缺少深色影院画布');
expect(/\.focus-detail\{[^}]*border:1px/s.test(css), 'site.css: 局部放大仍在使用厚重边框');

const referencedAssets = new Set();
for (const html of Object.values(htmlByPage)) {
  for (const match of html.matchAll(/(?:src|poster)="(assets\/product\/[^"]+)"/g)) {
    referencedAssets.add(match[1]);
  }
}
expect(referencedAssets.size >= 6, '页面引用的真实产品素材少于 6 个');
for (const asset of referencedAssets) {
  expect(fs.existsSync(path.join(root, asset)), `缺少被页面引用的素材: ${asset}`);
}

for (const asset of [...referencedAssets].filter((name) => name.includes('/focus-'))) {
  if (!fs.existsSync(path.join(root, asset))) continue;
  const png = fs.readFileSync(path.join(root, asset));
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  expect(width >= 960 && height >= 540, `局部放大图低于 960x540: ${asset} (${width}x${height})`);
}

const i18n = read('i18n.js');
for (const key of ['nav.menu', 'idx.proofImport', 'idx.workflowH', 'feat.groupCore', 'proof.realTitle', 'proof.focusLabel', 'dl.itchFallback']) {
  const count = i18n.split(`'${key}'`).length - 1;
  expect(count === 4, `i18n.js: ${key} 应在四种语言中各出现一次，当前 ${count} 次`);
}

if (failures.length) {
  console.error(`站点检查失败（${failures.length} 项）:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`站点检查通过：${pages.length} 个页面，${referencedAssets.size} 个真实产品素材。`);
