/* ConfigNexus 官网文档页：四语侧边栏导航 + Markdown 渲染（移植自软件欢迎页 parseMarkdown）。
   - 结构来自 docs-manifest.js（稳定 ID 有序），按 window.CN_LANG 渲染分类/篇目标题。
   - 正文优先用当前语言翻译；该语言缺这篇时回退中文并在顶部挂"暂无翻译"提示条。
   - 深链用稳定 ID（如 #table-xlsx）；同时兼容旧的中文 hash（如 #表格编辑体验/xlsx文件）。 */
(function () {
  'use strict';
  var DOCS = window.DOCS || {};
  var MANIFEST = window.DOC_MANIFEST || [];
  var CATS = window.DOC_CATS || {};
  var lang = window.CN_LANG || 'zh';

  // 文档页 UI 文案（按当前语言）
  var UI = {
    zh: { empty: '暂无文档内容。', dlc: 'DLC', fallback: '⚠ 该教程暂无对应语言翻译，以下为中文原文。' },
    en: { empty: 'No documentation yet.', dlc: 'DLC', fallback: '⚠ This tutorial is not available in English yet — the Chinese version is shown below.' },
    ja: { empty: 'ドキュメントがまだありません。', dlc: 'DLC', fallback: '⚠ このチュートリアルはまだ日本語訳がありません。以下は中国語版です。' },
    ko: { empty: '문서가 아직 없습니다.', dlc: 'DLC', fallback: '⚠ 이 튜토리얼은 아직 한국어 번역이 없습니다. 아래는 중국어 원문입니다.' }
  };
  var ui = UI[lang] || UI.zh;

  // ---------- 由 manifest 派生：分组 / 别名 / 索引 ----------
  var groups = [], byCat = {}, BYID = {}, ALIAS = {};
  MANIFEST.forEach(function (it) {
    if (!byCat[it.cat]) { byCat[it.cat] = { cat: it.cat, items: [] }; groups.push(byCat[it.cat]); }
    byCat[it.cat].items.push(it);
    BYID[it.id] = it;
    if (it.keys) Object.keys(it.keys).forEach(function (l) {
      var k = it.keys[l];
      if (!k) return;
      if (!ALIAS[k]) ALIAS[k] = it.id;
      var b = base(k);
      if (b && !ALIAS[b]) ALIAS[b] = it.id;
    });
    if (it.keys && it.keys.zh) ALIAS[it.keys.zh] = it.id;   // 旧中文 hash 兼容
  });

  function base(k) { var p = String(k == null ? '' : k).split('/'); return p[p.length - 1]; }
  function catLabel(cat) { var c = CATS[cat]; return c ? (c[lang] || c.zh || cat) : cat; }
  function titleOf(it) { var k = (it.keys && it.keys[lang]); if (k == null) k = it.keys && it.keys.zh; return base(k); }
  // 返回 {md, contentLang}；contentLang 标明正文实际语言（用于 lang 属性），fallback 时为 zh
  function resolveContent(it) {
    var k = it.keys && it.keys[lang];
    if (k != null && DOCS[lang] && DOCS[lang][k] != null) return { md: DOCS[lang][k], contentLang: lang, fallback: false };
    var zk = it.keys && it.keys.zh;
    if (zk != null && DOCS.zh && DOCS.zh[zk] != null) return { md: DOCS.zh[zk], contentLang: 'zh', fallback: true };
    return null;
  }

  // ---------- Markdown 渲染（移植自 welcome.js parseMarkdown） ----------
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function parse(md) {
    var html = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // 媒体路径改写到官网目录（按 md 内引用的语言前缀，zh/en/ja/ko 通用）
    html = html.replace(/Res\/(zh|en|ja|ko)\//g, 'docs/Res-$1/');
    // 桌面端专属指令在网页上去掉
    html = html.replace(/^createtab:.*$/gim, '');

    // 1) 代码块占位
    var codeBlocks = [];
    html = html.replace(/(```+)([^\n]*)\r?\n([\s\S]*?)\1/g, function (m, fence, lang, code) {
      var ph = '___CODE_BLOCK_' + codeBlocks.length + '___';
      codeBlocks.push({ lang: (lang || '').trim().split(/\s+/)[0] || 'text', code: code.trim() });
      return '\n\n' + ph + '\n\n';
    });

    // 2) 视频
    html = html.replace(/video:(.+?)(?:\|(.+?))?$/gm, function (m, path, cap) {
      var p = path.trim(), c = cap ? cap.trim() : '';
      return '<div class="video-player-container"><div class="video-player-wrapper">' +
        '<video class="video-player" controls loop muted playsinline preload="metadata" ' +
        'onerror="this.parentElement.innerHTML=\'<div class=&quot;video-error&quot;>📹</div>\'">' +
        '<source src="' + p + '" type="video/webm"></video></div>' +
        (c ? '<p class="video-caption">' + c + '</p>' : '') + '</div>';
    });

    // 3) 图片
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, function (m, alt, src) {
      return '<div class="gif-demo-container"><img src="' + src + '" alt="' + alt + '" class="gif-demo" ' +
        'onerror="this.parentElement.innerHTML=\'<p class=&quot;image-error&quot;>⚠️</p>\'" />' +
        (alt ? '<p class="gif-caption">' + alt + '</p>' : '') + '</div>';
    });

    // 4) 标题（长→短）
    html = html.replace(/^###### (.*$)/gim, '<h6 class="nt-h6">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="nt-h5">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="nt-h4">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="nt-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="nt-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="nt-h1">$1</h1>');

    // 5) 表格
    html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, function (m, header, body) {
      var hs = header.split('|').filter(function (h) { return h.trim(); }).map(function (h) { return '<th>' + h.trim() + '</th>'; }).join('');
      var rows = body.trim().split('\n').map(function (row) {
        var cs = row.split('|').filter(function (c) { return c.trim(); }).map(function (c) { return '<td>' + c.trim() + '</td>'; }).join('');
        return '<tr>' + cs + '</tr>';
      }).join('');
      return '<div class="nt-table-wrap"><table class="nt-table"><thead><tr>' + hs + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
    });

    // 6) Callout [!TYPE]
    html = html.replace(/^> \[!(TIP|WARNING|NOTE|INFO|IMPORTANT|CAUTION|DANGER)\]\s*\n((?:> .*\n?)+)/gim, function (m, type, content) {
      var map = { TIP: ['💡', 'green'], WARNING: ['⚠️', 'yellow'], NOTE: ['ℹ️', 'blue'], INFO: ['ℹ️', 'blue'], IMPORTANT: ['❗', 'red'], CAUTION: ['⚠️', 'yellow'], DANGER: ['🚫', 'red'] };
      var cfg = map[type.toUpperCase()] || map.INFO;
      var lines = content.split('\n').map(function (l) { return l.replace(/^>\s*/, '').trim(); }).filter(function (l) { return l.length; });
      var inList = false, body = '';
      lines.forEach(function (line) {
        var isLi = line.indexOf('- ') === 0;
        var text = (isLi ? line.substring(2) : line).replace(/`([^`]+)`/g, '<code class="nt-code-inline">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (isLi) { if (!inList) { body += '<ul>'; inList = true; } body += '<li>' + text + '</li>'; }
        else { if (inList) { body += '</ul>'; inList = false; } body += '<p>' + text + '</p>'; }
      });
      if (inList) body += '</ul>';
      return '<div class="nt-callout nt-' + cfg[1] + '"><div class="nt-callout-ic">' + cfg[0] + '</div><div class="nt-callout-body">' + body + '</div></div>';
    });

    // 7) 列表
    html = html.replace(/^\d+\. (.*$)/gim, '<oli>$1</oli>');
    html = html.replace(/(?:<oli>[\s\S]*?<\/oli>\s*)+/g, function (m) {
      return '<ol class="nt-list">' + m.trim().replace(/<\/oli>\s*<oli>/g, '</li><li>').replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>') + '</ol>';
    });
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(?:<li>.*?<\/li>\s*)+/g, function (m) { return '<ul class="nt-list">' + m.trim() + '</ul>'; });

    // 8) 粗体 / 行内代码
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`([^`]+)`/g, '<code class="nt-code-inline">$1</code>');
    html = html.replace(/\[\[([^\]]+)\]\]/g, function (m, label) {
      var text = label.trim();
      var id = toId(text);
      if (!id) return escapeHtml(text);
      return '<a class="nt-link" href="#' + encodeURIComponent(id) + '">' + escapeHtml(text) + '</a>';
    });

    // 9) 段落
    html = html.split('\n\n').map(function (para) {
      var t = para.trim();
      if (!t) return '';
      if (t.charAt(0) === '<') return para;
      if (t.indexOf('___CODE_BLOCK_') === 0) return para;
      return '<p class="nt-p">' + para + '</p>';
    }).join('\n');

    // 10) 恢复代码块
    codeBlocks.forEach(function (b, i) {
      html = html.replace('___CODE_BLOCK_' + i + '___',
        '<div class="nt-code-wrap"><div class="nt-code-head">' + b.lang + '</div><pre class="nt-code"><code>' + escapeHtml(b.code) + '</code></pre></div>');
    });
    return html;
  }

  // ---------- 侧边栏 ----------
  var side = document.getElementById('docSide');
  var content = document.getElementById('docContent');

  function buildSide() {
    var h = '';
    groups.forEach(function (g) {
      h += '<div class="doc-group"><div class="doc-group-t">' + escapeHtml(catLabel(g.cat)) + '</div>';
      g.items.forEach(function (it) {
        var dlc = it.dlc ? ' <span class="doc-dlc">' + ui.dlc + '</span>' : '';
        h += '<a class="doc-link" data-id="' + it.id + '" href="#' + it.id + '">' + escapeHtml(titleOf(it)) + dlc + '</a>';
      });
      h += '</div>';
    });
    side.innerHTML = h;
  }

  function firstId() { return MANIFEST.length ? MANIFEST[0].id : null; }

  // 把 hash 解析成稳定 ID（兼容旧中文 hash）
  function toId(raw) {
    if (!raw) return null;
    if (BYID[raw]) return raw;
    if (ALIAS[raw]) return ALIAS[raw];
    return null;
  }

  function show(id) {
    var it = BYID[id] ? BYID[id] : (id ? BYID[firstId()] : BYID[firstId()]);
    if (!it) { content.innerHTML = '<p class="nt-p">' + ui.empty + '</p>'; return; }
    var r = resolveContent(it);
    if (!r) { content.innerHTML = '<p class="nt-p">' + ui.empty + '</p>'; return; }
    var note = r.fallback ? '<div class="doc-fallback-note">' + ui.fallback + '</div>' : '';
    content.innerHTML = note + parse(r.md);
    content.setAttribute('lang', r.contentLang === 'zh' ? 'zh-CN' : r.contentLang);
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var links = side.querySelectorAll('.doc-link');
    for (var i = 0; i < links.length; i++) links[i].classList.toggle('active', links[i].getAttribute('data-id') === it.id);
  }

  function fromHash() {
    var raw = '';
    try { raw = decodeURIComponent((location.hash || '').replace(/^#/, '')); }
    catch (e) { raw = (location.hash || '').replace(/^#/, ''); }   // 非法 % 时不抛错
    show(toId(raw) || firstId());
  }

  buildSide();
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
