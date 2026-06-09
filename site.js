/* ===== ConfigNexus 官网 · 通用交互（正式页面，无俄罗斯方块）=====
   仅保留：卡片跟随鼠标的光斑。开场小游戏在 intro.js（只挂在首页）。
*/
(function () {
  'use strict';
  var cards = document.querySelectorAll('.card,.feat-row,.step,.dl-card');
  for (var n = 0; n < cards.length; n++) {
    (function (el) {
      el.addEventListener('pointermove', function (e) {
        var rc = el.getBoundingClientRect();
        el.style.setProperty('--cx', (e.clientX - rc.left) + 'px');
        el.style.setProperty('--cy', (e.clientY - rc.top) + 'px');
      });
    })(cards[n]);
  }
})();
