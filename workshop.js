/* 创意工坊页：从 workshop-components.js（window.WORKSHOP_COMPONENTS）渲染组件卡片。
   - 语言取 window.CN_LANG（由 i18n.js 在 head 同步设好）；组件名用 metadata 四语 displayName。
   - 简介只有中文，故仅在中文界面显示；其余语言只显示组件名，避免中英混排。
   - 图标：metadata 里是 lucide 图标名，这里映射成 emoji 以贴合站点卡片风格。 */
(function () {
  'use strict';
  var ICONS = {
    'backpack': '🎒', 'castle': '🏰', 'message-square': '💬', 'circle-dot': '🔵',
    'gamepad-2': '🎮', 'gift': '🎁', 'blocks': '🧱', 'mail': '✉️', 'map': '🗺️',
    'book-open': '📖', 'shield': '🛡️', 'crosshair': '🎯', 'map-pin': '📍',
    'list-checks': '✅', 'sparkles': '✨'
  };
  function emoji(name) { return ICONS[name] || '🧩'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render() {
    var box = document.getElementById('ws-cards');
    var empty = document.getElementById('ws-empty');
    var list = window.WORKSHOP_COMPONENTS;
    if (!box) return;
    if (!list || !list.length) { if (empty) empty.style.display = ''; return; }
    if (empty) empty.style.display = 'none';

    var lang = window.CN_LANG || 'zh';
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var name = (c.displayName && (c.displayName[lang] || c.displayName.zh)) || c.id;
      var descHtml = (lang === 'zh' && c.desc) ? '<p>' + esc(c.desc) + '</p>' : '';
      html += '<a class="card" href="' + esc(c.repoPath) + '" target="_blank" rel="noopener">'
        + '<div class="ic">' + emoji(c.icon) + '</div>'
        + '<h3>' + esc(name) + '</h3>'
        + descHtml
        + '</a>';
    }
    box.innerHTML = html;
  }

  // 插件 Mod 区：数据来自 window.WORKSHOP_PLUGINS。
  // 插件 metadata 只有中文名，故标题各语言统一显示 manifest 原名；简介仅中文显示。
  // icon 字段已是 emoji 字符串（manifest runtime.icon 或按 form 兜底），直接输出，不走 lucide 映射。
  function renderPlugins() {
    var box = document.getElementById('ws-plugins');
    var sec = document.getElementById('ws-plugins-sec');
    var list = window.WORKSHOP_PLUGINS;
    if (!box) return;
    if (!list || !list.length) { if (sec) sec.style.display = 'none'; return; }
    if (sec) sec.style.display = '';

    var lang = window.CN_LANG || 'zh';
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var descHtml = (lang === 'zh' && p.desc) ? '<p>' + esc(p.desc) + '</p>' : '';
      html += '<a class="card" href="' + esc(p.repoPath) + '" target="_blank" rel="noopener">'
        + '<div class="ic">' + esc(p.icon || '🧩') + '</div>'
        + '<h3>' + esc(p.name) + '</h3>'
        + descHtml
        + '</a>';
    }
    box.innerHTML = html;
  }

  // 同步 GitHub 按钮地址到数据文件里的真源（若存在）
  function syncRepoLinks() {
    if (!window.WORKSHOP_REPO) return;
    var btns = document.querySelectorAll('.ws-repo-link');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('href', window.WORKSHOP_REPO);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { syncRepoLinks(); render(); renderPlugins(); });
  } else { syncRepoLinks(); render(); renderPlugins(); }
})();
