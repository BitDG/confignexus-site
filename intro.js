/* ===== ConfigNexus 开场小游戏（仅首页） =====
   进站先玩一局俄罗斯方块：
     - 每落一块冒一句“感悟”气泡
     - 消掉一行 → 揭示「沉稳型」（耐心看下去的人）
     - 双击 / 点跳过 → 揭示「急脾气」（原来你是个急躁的人啊）
   两套揭示内容不同；揭示后进入正式官网（无俄罗斯方块）。
*/
(function () {
  'use strict';

  // 尊重“减少动态效果”偏好：直接跳过开场
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var CELL = 30, COLS = 12, ROWS = 18;

  var MUSINGS = [
    '每一块，都要落在它该在的地方。',
    '空着的格子，迟早要补上。',
    '对齐，是一种耐心。',
    '凑齐一整行，才算数。',
    '急着落下，未必落得稳。',
    '混乱，只是还没被整理。',
    '你在等一个刚好的位置吗？',
    '一格一格来，急不得。',
    '位置错了，整行都难清。',
    '稳一点，下一块会更好放。',
    '看似乱，其实有规律。',
    '把它放对，比放快更重要。'
  ];

  var SHAPES = [
    { m: [[1, 1, 1, 1]], c: '56,189,248' },
    { m: [[1, 1], [1, 1]], c: '234,179,8' },
    { m: [[1, 1, 1], [0, 1, 0]], c: '167,139,250' },
    { m: [[0, 1, 1], [1, 1, 0]], c: '52,211,153' },
    { m: [[1, 1, 0], [0, 1, 1]], c: '251,113,133' },
    { m: [[1, 0, 0], [1, 1, 1]], c: '96,165,250' },
    { m: [[0, 0, 1], [1, 1, 1]], c: '251,146,60' }
  ];

  // ---------- 构建覆盖层 ----------
  var overlay = document.createElement('div');
  overlay.className = 'intro-overlay';
  overlay.innerHTML =
    '<div class="intro-skip">跳过 →</div>' +
    '<div class="intro-brand">Config<span>Nexus</span></div>' +
    '<div class="intro-hint">把方块放进合适的位置，凑满一行试试 —— 或 <b>双击任意处</b>直接跳过</div>';
  var board = document.createElement('canvas');
  board.className = 'intro-board';
  board.width = COLS * CELL; board.height = ROWS * CELL;
  board.style.width = (COLS * CELL) + 'px'; board.style.height = (ROWS * CELL) + 'px';
  overlay.appendChild(board);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  var ctx = board.getContext('2d');

  // ---------- 游戏状态 ----------
  var grid = empty(), piece = null, last = 0, vAcc = 0, hAcc = 0;
  var V_STEP = 150, H_STEP = 60, running = true, done = false;
  var mouseCol = COLS >> 1, raf = 0;

  function empty() { var g = []; for (var r = 0; r < ROWS; r++) g.push(new Array(COLS).fill(null)); return g; }
  function rot(m) { var h = m.length, w = m[0].length, o = []; for (var x = 0; x < w; x++) { o.push([]); for (var y = h - 1; y >= 0; y--) o[x].push(m[y][x]); } return o; }
  function cells(m) { var o = []; for (var y = 0; y < m.length; y++) for (var x = 0; x < m[0].length; x++) if (m[y][x]) o.push([x, y]); return o; }
  function pw(cs) { var w = 0; for (var i = 0; i < cs.length; i++) if (cs[i][0] > w) w = cs[i][0]; return w + 1; }
  function ph(cs) { var h = 0; for (var i = 0; i < cs.length; i++) if (cs[i][1] > h) h = cs[i][1]; return h + 1; }
  function hit(cs, col, top) {
    for (var i = 0; i < cs.length; i++) {
      var c = col + cs[i][0], r = top + cs[i][1];
      if (c < 0 || c >= COLS || r >= ROWS) return true;
      if (r >= 0 && grid[r][c]) return true;
    }
    return false;
  }
  function drop(cs, col) { var t = -4; while (!hit(cs, col, t + 1)) t++; return t; }
  function evaluate(cs, col, top) {
    var occ = grid.map(function (row) { return row.map(function (x) { return !!x; }); });
    for (var i = 0; i < cs.length; i++) { var r = top + cs[i][1], c = col + cs[i][0]; if (r >= 0) occ[r][c] = true; else return -1e9; }
    var hgt = new Array(COLS).fill(0), holes = 0, lines = 0, agg = 0, bump = 0;
    for (var cc = 0; cc < COLS; cc++) { var seen = false; for (var rr = 0; rr < ROWS; rr++) { if (occ[rr][cc]) { if (!seen) { hgt[cc] = ROWS - rr; seen = true; } } else if (seen) holes++; } agg += hgt[cc]; }
    for (var r2 = 0; r2 < ROWS; r2++) { var f = true; for (var c2 = 0; c2 < COLS; c2++) if (!occ[r2][c2]) { f = false; break; } if (f) lines++; }
    for (var k = 0; k < COLS - 1; k++) bump += Math.abs(hgt[k] - hgt[k + 1]);
    return -0.51 * agg + 0.76 * lines - 0.36 * holes - 0.18 * bump;
  }
  function spawn() {
    var best = null;
    for (var s = 0; s < SHAPES.length; s++) {
      var m = SHAPES[s].m;
      for (var rr = 0; rr < 4; rr++) {
        var cs = cells(m), w = m[0].length, lo = Math.max(0, mouseCol - w + 1), hi = Math.min(COLS - w, mouseCol);
        for (var col = lo; col <= hi; col++) { var top = drop(cs, col); var sc = evaluate(cs, col, top); if (!best || sc > best.sc) best = { sc: sc, cs: cs, col: col, color: SHAPES[s].c }; }
        m = rot(m);
      }
    }
    if (!best) { best = { cs: cells(SHAPES[0].m), col: mouseCol, color: SHAPES[0].c }; }
    piece = { cs: best.cs, col: best.col, color: best.color, ry: -ph(best.cs) };
    vAcc = 0; hAcc = 0;
    bubble();
  }
  function lock() {
    var full = [];
    for (var i = 0; i < piece.cs.length; i++) { var c = piece.col + piece.cs[i][0], r = piece.ry + piece.cs[i][1]; if (r >= 0) grid[r][c] = piece.color; }
    piece = null;
    for (var r2 = 0; r2 < ROWS; r2++) { var f = true; for (var c2 = 0; c2 < COLS; c2++) if (!grid[r2][c2]) { f = false; break; } if (f) full.push(r2); }
    if (full.length) { finish('A'); return; }   // 消掉一行 → 沉稳型
    if (gridTopHit()) { grid = empty(); }
  }
  function gridTopHit() { for (var c = 0; c < COLS; c++) if (grid[0][c]) return true; return false; }

  function block(x, y, color, a) {
    var s = CELL; ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(' + color + ')'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    ctx.fillStyle = 'rgba(255,255,255,.34)'; ctx.fillRect(x + 1, y + 1, s - 2, 3); ctx.fillRect(x + 1, y + 1, 3, s - 2);
    ctx.fillStyle = 'rgba(0,0,0,.20)'; ctx.fillRect(x + 1, y + s - 4, s - 2, 3); ctx.fillRect(x + s - 4, y + 1, 3, s - 2);
    ctx.globalAlpha = 1;
  }
  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min(80, t - last) : 16; last = t;
    ctx.clearRect(0, 0, board.width, board.height);
    // 网格底纹
    ctx.strokeStyle = 'rgba(0,0,0,.05)'; ctx.lineWidth = 1;
    for (var gx = 0; gx <= COLS; gx++) { ctx.beginPath(); ctx.moveTo(gx * CELL, 0); ctx.lineTo(gx * CELL, ROWS * CELL); ctx.stroke(); }
    for (var gy = 0; gy <= ROWS; gy++) { ctx.beginPath(); ctx.moveTo(0, gy * CELL); ctx.lineTo(COLS * CELL, gy * CELL); ctx.stroke(); }

    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) if (grid[r][c]) block(c * CELL, r * CELL, grid[r][c], 0.9);

    if (!piece) spawn();
    if (piece) {
      hAcc += dt;
      if (hAcc >= H_STEP) { hAcc = 0; var w = pw(piece.cs), d = Math.max(0, Math.min(COLS - w, mouseCol - (w >> 1))); if (piece.col < d && !hit(piece.cs, piece.col + 1, piece.ry)) piece.col++; else if (piece.col > d && !hit(piece.cs, piece.col - 1, piece.ry)) piece.col--; }
      vAcc += dt;
      if (vAcc >= V_STEP) { vAcc = 0; if (!hit(piece.cs, piece.col, piece.ry + 1)) piece.ry++; else lock(); }
      if (piece) for (var i = 0; i < piece.cs.length; i++) { var px = (piece.col + piece.cs[i][0]) * CELL, py = (piece.ry + piece.cs[i][1]) * CELL; if (py > -CELL) block(px, py, piece.color, 1); }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  // ---------- 感悟气泡 ----------
  function bubble() {
    if (done) return;
    var rect = board.getBoundingClientRect();
    var w = piece ? pw(piece.cs) : 1;
    var col = piece ? piece.col + (w >> 1) : mouseCol;
    var b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = MUSINGS[(Math.random() * MUSINGS.length) | 0];
    b.style.left = (rect.left + (col + 0.5) * CELL) + 'px';
    b.style.top = (rect.top - 16) + 'px';
    document.body.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 2900);
  }

  // ---------- 鼠标列控制 ----------
  overlay.addEventListener('pointermove', function (e) {
    var rect = board.getBoundingClientRect();
    var col = Math.floor((e.clientX - rect.left) / CELL);
    mouseCol = Math.max(0, Math.min(COLS - 1, col));
  });

  // ---------- 揭示 ----------
  var REVEAL = {
    A: {
      cls: 'A', tag: '沉稳型', title: '你是个沉得住气的人',
      text: '你愿意等每一块落到对的位置。配置也该如此 —— 不急于一时，对齐、校验、稳稳交付。ConfigNexus 陪这样的你，把每一张表都做扎实。',
      btn: '进入 ConfigNexus', btnCls: 'btn-primary'
    },
    B: {
      cls: 'B', tag: '急脾气', title: '原来你是个急躁的人啊',
      text: '懒得慢慢摆？我们也一样。所以 ConfigNexus 把整理、校验、导出统统自动化 —— 急性子，也能三两下把配置搞定。',
      btn: '直接开始 →', btnCls: 'btn-orange'
    }
  };
  function finish(path) {
    if (done) return; done = true; running = false; cancelAnimationFrame(raf);
    var d = REVEAL[path];
    var rv = document.createElement('div');
    rv.className = 'reveal-screen ' + d.cls;
    rv.innerHTML =
      '<div class="reveal-tag">' + d.tag + '</div>' +
      '<div class="reveal-title">' + d.title + '</div>' +
      '<div class="reveal-text">' + d.text + '</div>' +
      '<button class="btn ' + d.btnCls + ' reveal-btn">' + d.btn + '</button>';
    overlay.appendChild(rv);
    rv.querySelector('.reveal-btn').addEventListener('click', enterSite);
  }
  function enterSite() {
    overlay.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 650);
  }

  // 双击 / 跳过 → 急脾气
  overlay.addEventListener('dblclick', function () { finish('B'); });
  overlay.querySelector('.intro-skip').addEventListener('click', function () { finish('B'); });
})();
