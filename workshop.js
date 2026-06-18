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

  // 同步 GitHub 按钮地址到数据文件里的真源（若存在）
  function syncRepoLinks() {
    if (!window.WORKSHOP_REPO) return;
    var btn = document.getElementById('ws-github');
    if (btn) btn.setAttribute('href', window.WORKSHOP_REPO);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { syncRepoLinks(); render(); });
  } else { syncRepoLinks(); render(); }
})();
