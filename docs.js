/* ConfigNexus 官网文档页：侧边栏导航 + Markdown 渲染（移植自软件欢迎页 parseMarkdown） */
(function () {
  'use strict';
  var DOCS = window.DOCS || {};

  // 目录结构（分类 → 教程页），顺序与软件欢迎页一致
  var STRUCTURE = [
    { cat: '表格编辑体验', label: '表格编辑体验', pages: ['xlsx文件', 'xls文件', 'json文件', 'csv文件', 'cnx工程文件', '多页签管理'] },
    { cat: 'CT列类型', label: 'CT 列类型', pages: ['JSON编辑器', '富文本编辑', '多数据编辑', '日期编辑', '资源编辑'] },
    { cat: '数据验证', label: '数据验证', pages: ['验证规则DSL', '数据验证'] },
    { cat: '数据导出', label: '数据导出', pages: ['数据导出'] },
    { cat: 'Python集成', label: 'Python 集成', pages: ['Python脚本编辑器', 'Python公式集成', '持久化脚本库'] },
    { cat: '实用工具箱', label: '实用工具箱', pages: ['多语言工作流', '多语言字符提取', '字体子集化', '批量编辑', '多数据批量修改', '数据拼接', '数据转换', 'ID生成器', '智能粘贴', '自定义公式', '自动保存'] },
    { cat: '扩展生态', label: '扩展生态', pages: ['文件浏览器', '外部引用源', '引用关系图', '创意工坊', '源代码管理', '数据表对比'] }
  ];
  var DLC = { '扩展生态/数据表对比': 1 };

  // ---------- Markdown 渲染（移植自 welcome.js parseMarkdown） ----------
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function parse(md) {
    var html = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // 媒体路径改写到官网目录
    html = html.replace(/Res\/zh\//g, 'docs/Res-zh/');
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
        'onerror="this.parentElement.innerHTML=\'<div class=&quot;video-error&quot;>📹 视频暂未提供</div>\'">' +
        '<source src="' + p + '" type="video/webm">您的浏览器不支持视频播放。</video></div>' +
        (c ? '<p class="video-caption">' + c + '</p>' : '') + '</div>';
    });

    // 3) 图片
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, function (m, alt, src) {
      return '<div class="gif-demo-container"><img src="' + src + '" alt="' + alt + '" class="gif-demo" ' +
        'onerror="this.parentElement.innerHTML=\'<p class=&quot;image-error&quot;>⚠️ 图片加载失败</p>\'" />' +
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
    STRUCTURE.forEach(function (g) {
      h += '<div class="doc-group"><div class="doc-group-t">' + g.label + '</div>';
      g.pages.forEach(function (p) {
        var key = g.cat + '/' + p;
        if (!DOCS[key]) return;
        var dlc = DLC[key] ? ' <span class="doc-dlc">DLC</span>' : '';
        h += '<a class="doc-link" data-key="' + key + '" href="#' + encodeURIComponent(key) + '">' + p + dlc + '</a>';
      });
      h += '</div>';
    });
    side.innerHTML = h;
  }

  function firstKey() {
    for (var i = 0; i < STRUCTURE.length; i++) {
      var g = STRUCTURE[i];
      for (var j = 0; j < g.pages.length; j++) { var k = g.cat + '/' + g.pages[j]; if (DOCS[k]) return k; }
    }
    return null;
  }

  function show(key) {
    if (!DOCS[key]) { key = firstKey(); }
    if (!key) { content.innerHTML = '<p class="nt-p">暂无文档内容。</p>'; return; }
    content.innerHTML = parse(DOCS[key]);
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var links = side.querySelectorAll('.doc-link');
    for (var i = 0; i < links.length; i++) links[i].classList.toggle('active', links[i].getAttribute('data-key') === key);
  }

  function fromHash() {
    var h = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    show(h || firstKey());
  }

  buildSide();
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
