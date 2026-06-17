/* ============================================================
   PER SEA — a tiny time-killer, two skins of one game.
     • sea   : a cuttlefish gathers bubbles, jets backward and
               stuns jellyfish with a blob of ink.
     • cradle: a silkworm gathers leaves, flicks a thread back
               to stun beetles.
   Plain canvas shapes. The loop runs only while open (cancelled
   on close / pause / tab-hidden), so it's idle-free. Secret:
   drop 3–6 stones on the logo dot.
   ============================================================ */
(function () {
  var W = 460, H = 330;
  var CRADLE = !!document.querySelector('link[href*="cradle.css"]');

  // neon palettes — hero + matching "good" pickups + ink share a hue
  var PRESETS = [
    { id: 'gold', label: 'gold', hero: '#FFC64B', glow: '#FFB200', good: '#FFD66B', ink: '#FFE49A' },
    { id: 'rose', label: 'rose', hero: '#FF6FA5', glow: '#FF3D86', good: '#FF8FBC', ink: '#FFC2DC' },
    { id: 'blue', label: 'blue', hero: '#4FB8FF', glow: '#1E90FF', good: '#7FCEFF', ink: '#BEE6FF' },
    { id: 'teal', label: 'teal', hero: '#3FE0D0', glow: '#12C9B6', good: '#7DEDE1', ink: '#BFF6EF' },
    { id: 'white', label: 'white', hero: '#F4F4F4', glow: '#FFFFFF', good: '#FFFFFF', ink: '#E6E8F0' }
  ];
  var presetIdx = CRADLE ? 1 : 0;
  try { var sp = localStorage.getItem('perSea.gcolor'); if (sp) { var pi = PRESETS.findIndex(function (p) { return p.id === sp; }); if (pi >= 0) presetIdx = pi; } } catch (e) {}

  var ctrl = 'cursor';
  try { var sc = localStorage.getItem('perSea.gctrl'); if (sc === 'keys' || sc === 'cursor') ctrl = sc; } catch (e) {}

  var FIELD = CRADLE ? '#160712' : '#071C24';   // play field, a touch off the card
  var T = CRADLE
    ? { title: 'Silk<b>worm</b>', name: 'Silkworm', good: 'leaves', shootWord: 'thread',
        instr: ['Gather the <b>leaves</b>.', 'Dodge the <b>beetles</b> — flick a <b>thread</b> to stun them.'],
        overs: ['the worm curls away.', 'spun out — for now.', 'back to the mulberry leaf.', 'a tangled thread.'] }
    : { title: 'Cuttle<b>fish</b>', name: 'Cuttlefish', good: 'bubbles', shootWord: 'ink',
        instr: ['Gather the <b>bubbles</b>.', 'Dodge the <b>jellyfish</b> — <b>ink</b> them to stun.'],
        overs: ['the cuttlefish slips away.', 'inked and gone.', 'lost in the blue.', 'she jets off backward.'] };
  var WINMSG = ['not bad at all.', 'a tidy haul.', 'the reef approves.', 'nicely done.', 'one for the logbook.'];

  var overlay, canvas, ctx, scoreEl, bestEl, heartsEl, hint, retry, inkBtn, pauseBtn, sndBtn, ctrlBtn, fireBtn, swatchWrap, raf, last;
  var hero, goods, bads, ink, keys, score, lives, spawnT, badT, playing, paused, dead, started, invuln, cooldown;
  var pointer = { x: W / 2, y: H / 2, active: false };
  var best = 0, BKEY = CRADLE ? 'perSea.silkBest' : 'perSea.cuttleBest';
  try { best = +(localStorage.getItem(BKEY) || 0) || 0; } catch (e) {}

  function P() { return PRESETS[presetIdx]; }

  function css() {
    if (document.getElementById('psg-style')) return;
    var s = document.createElement('style'); s.id = 'psg-style';
    s.textContent =
      '.psg-overlay{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;padding:1.2rem;background:rgba(6,18,22,0.82);font-family:"DM Mono",ui-monospace,monospace;}' +
      '.psg-overlay.open{display:flex;}' +
      '.psg-card{position:relative;background:#0b242a;border:1px solid rgba(120,190,200,0.22);border-radius:14px;padding:1.05rem;box-shadow:0 40px 90px -30px rgba(0,0,0,0.8);max-width:96vw;}' +
      '.psg-card.cradle{background:#1a0a10;border-color:rgba(203,164,106,0.28);}' +
      '.psg-top{display:flex;align-items:center;justify-content:space-between;gap:0.8rem;margin-bottom:0.55rem;}' +
      '.psg-title{font-family:"Raleway",sans-serif;font-weight:700;font-size:1.02rem;color:#EAF6F5;}' +
      '.psg-title b{color:#6BBFBE;} .psg-card.cradle .psg-title b{color:#CBA46A;}' +
      '.psg-hud{display:flex;align-items:center;gap:0.9rem;font-size:0.72rem;letter-spacing:0.06em;color:#9fc4c7;}' +
      '.psg-hud b{color:#E7B765;} .psg-hearts{letter-spacing:2px;font-size:1.15rem;line-height:1;color:#ff5d6c;}' +
      '.psg-hearts .dead{opacity:0.2;}' +
      '.psg-stage{position:relative;border-radius:9px;overflow:hidden;}' +
      '.psg-stage canvas{display:block;width:' + W + 'px;max-width:100%;height:auto;border-radius:9px;touch-action:none;}' +
      '.psg-fire{position:absolute;right:10px;bottom:10px;width:54px;height:54px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.35);background:rgba(255,255,255,0.10);color:#fff;font-size:1.1rem;display:none;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;backdrop-filter:blur(2px);}' +
      '.psg-fire:active{background:rgba(255,255,255,0.22);}' +
      '.psg-msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;text-align:center;color:#EAF6F5;background:rgba(8,22,26,0.74);padding:1.2rem;}' +
      '.psg-msg.hidden{display:none;}' +
      '.psg-msg .big{font-family:"Raleway",sans-serif;font-weight:700;font-size:1.4rem;}' +
      '.psg-rules{font-size:0.76rem;letter-spacing:0.01em;color:#bcdadb;line-height:1.5;list-style:none;padding:0;margin:0.2rem 0 0;text-align:left;max-width:32ch;}' +
      '.psg-rules li{position:relative;padding-left:1.1rem;margin:0.32rem 0;}' +
      '.psg-rules li::before{content:"";position:absolute;left:0;top:0.5em;width:5px;height:5px;border-radius:50%;background:#6BBFBE;}' +
      '.psg-card.cradle .psg-rules li::before{background:#CBA46A;}' +
      '.psg-rules b{color:#EAF6F5;font-weight:600;} .psg-rules kbd{font-family:"DM Mono",monospace;background:rgba(255,255,255,0.12);border-radius:4px;padding:0 0.32em;color:#fff;}' +
      '.psg-sub{font-size:0.74rem;color:#a9cccd;line-height:1.6;max-width:34ch;}' +
      '.psg-btn{margin-top:0.5rem;font-family:"DM Mono",monospace;font-size:0.76rem;letter-spacing:0.06em;color:#06212a;background:#6BBFBE;border:none;border-radius:100px;padding:0.55rem 1.2rem;cursor:pointer;}' +
      '.psg-card.cradle .psg-btn{background:#CBA46A;}' +
      '.psg-btn:hover{filter:brightness(1.1);}' +
      '.psg-foot{display:flex;align-items:center;justify-content:space-between;gap:0.6rem;margin-top:0.6rem;flex-wrap:wrap;}' +
      '.psg-tools{display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;}' +
      '.psg-ico{background:none;border:1px solid rgba(120,190,200,0.3);color:#cfe6e6;border-radius:8px;font-size:0.82rem;line-height:1;padding:0.4rem 0.55rem;cursor:pointer;min-width:32px;}' +
      '.psg-ico:hover{border-color:#6BBFBE;color:#fff;} .psg-ico[disabled]{opacity:0.4;cursor:default;}' +
      '.psg-sw{width:18px;height:18px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0;box-shadow:0 0 7px rgba(0,0,0,0.4);} .psg-sw.on{border-color:#fff;}' +
      '.psg-x{background:none;border:1px solid rgba(120,190,200,0.3);color:#9fc4c7;border-radius:100px;font-family:"DM Mono",monospace;font-size:0.66rem;letter-spacing:0.05em;padding:0.4rem 0.8rem;cursor:pointer;}' +
      '.psg-x:hover{border-color:#6BBFBE;color:#fff;}';
    document.head.appendChild(s);
  }

  function build() {
    css();
    overlay = document.createElement('div'); overlay.className = 'psg-overlay';
    var swatches = PRESETS.map(function (p, i) { return '<button class="psg-sw' + (i === presetIdx ? ' on' : '') + '" data-i="' + i + '" title="' + p.label + '" style="background:' + p.hero + ';box-shadow:0 0 8px ' + p.glow + '"></button>'; }).join('');
    overlay.innerHTML =
      '<div class="psg-card' + (CRADLE ? ' cradle' : '') + '" role="dialog" aria-label="' + T.name + ' game">' +
        '<div class="psg-top"><div class="psg-title">' + T.title + '</div>' +
          '<div class="psg-hud"><span class="psg-hearts" id="psg-hearts"></span><span>' + T.good + ' <b id="psg-score">0</b></span><span>best <span id="psg-best">' + best + '</span></span></div></div>' +
        '<div class="psg-stage"><canvas width="' + W + '" height="' + H + '"></canvas>' +
          '<button class="psg-fire" id="psg-fire" aria-label="ink">\u25C9</button>' +
          '<div class="psg-msg" id="psg-msg"><div class="big" id="psg-big">' + T.name + '</div>' +
          '<ul class="psg-rules" id="psg-rules"></ul><div class="psg-sub" id="psg-sub" style="display:none"></div>' +
          '<button class="psg-btn" id="psg-retry">dive in \u2192</button></div></div>' +
        '<div class="psg-foot"><div class="psg-tools">' +
          '<button class="psg-ico" id="psg-ctrl" title="controls"></button>' +
          '<button class="psg-ico" id="psg-pause" title="pause (P)">\u275A\u275A</button>' +
          '<button class="psg-ico" id="psg-snd" title="sound"></button>' +
          '<span class="psg-sw-wrap" style="display:inline-flex;gap:0.35rem;margin-left:0.25rem;">' + swatches + '</span>' +
          '</div><button class="psg-x" id="psg-close">close (esc)</button></div>' +
      '</div>';
    document.body.appendChild(overlay);
    canvas = overlay.querySelector('canvas'); ctx = canvas.getContext('2d');
    scoreEl = overlay.querySelector('#psg-score'); bestEl = overlay.querySelector('#psg-best');
    heartsEl = overlay.querySelector('#psg-hearts'); hint = overlay.querySelector('#psg-msg');
    retry = overlay.querySelector('#psg-retry'); pauseBtn = overlay.querySelector('#psg-pause');
    sndBtn = overlay.querySelector('#psg-snd'); ctrlBtn = overlay.querySelector('#psg-ctrl');
    fireBtn = overlay.querySelector('#psg-fire'); swatchWrap = overlay.querySelector('.psg-sw-wrap');

    retry.addEventListener('click', function () { if (paused) resume(); else startRun(); });
    overlay.querySelector('#psg-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    pauseBtn.addEventListener('click', function () { if (paused) resume(); else pause(); });
    sndBtn.addEventListener('click', function () { if (window.__perSeaSound) window.__perSeaSound.toggle(); syncSnd(); });
    ctrlBtn.addEventListener('click', function () { ctrl = (ctrl === 'cursor') ? 'keys' : 'cursor'; try { localStorage.setItem('perSea.gctrl', ctrl); } catch (e) {} syncCtrl(); });
    fireBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); shoot(); });
    swatchWrap.addEventListener('click', function (e) {
      var b = e.target.closest('.psg-sw'); if (!b) return;
      presetIdx = +b.getAttribute('data-i');
      try { localStorage.setItem('perSea.gcolor', P().id); } catch (er) {}
      Array.prototype.forEach.call(swatchWrap.children, function (s, i) { s.classList.toggle('on', i === presetIdx); });
      if (!playing) render();
    });
    syncSnd(); syncCtrl();

    var coarse = matchMedia('(pointer:coarse)').matches;
    function toLocal(e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) * (W / r.width);
      // on touch, lift the target above the fingertip so you can see the hero
      pointer.y = (e.clientY - r.top) * (H / r.height) - (coarse ? 46 : 0);
      pointer.active = true;
    }
    // pointer tracked on document so heading persists past the field edge
    document.addEventListener('pointermove', function (e) { if (overlay.classList.contains('open') && playing && ctrl === 'cursor') toLocal(e); });
    canvas.addEventListener('pointerdown', function (e) {
      if (ctrl === 'cursor') toLocal(e);   // click steers in cursor mode
      shoot();                              // ...and always fires
    });
  }

  function syncSnd() { if (!sndBtn) return; var on = window.__perSeaSound ? window.__perSeaSound.isOn() : false; sndBtn.textContent = on ? '\u266A' : '\u00D7\u266A'; sndBtn.title = on ? 'sound on' : 'sound off'; }
  function syncCtrl() {
    if (!ctrlBtn) return;
    ctrlBtn.textContent = ctrl === 'cursor' ? '\u2316 cursor' : '\u2328 keys';
    ctrlBtn.title = ctrl === 'cursor' ? 'control: cursor (click to ink)' : 'control: keys (space to ink)';
    var touch = matchMedia('(pointer:coarse)').matches;
    if (fireBtn) fireBtn.style.display = (ctrl === 'cursor' && touch) ? 'flex' : 'none';
  }
  function sfx(k) { if (window.__perSeaPlaySfx) window.__perSeaPlaySfx(k); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function spawnGood() { goods.push({ x: rnd(24, W - 24), y: rnd(24, H - 24), r: 8, vy: rnd(-0.5, -0.1), ph: Math.random() * 6 }); }
  function spawnBad() { var L = Math.random() < 0.5; bads.push({ x: L ? -28 : W + 28, y: rnd(30, H - 50), r: rnd(16, 20), vx: (L ? 1 : -1) * rnd(0.5, 0.85) * (1 + score * 0.015), ph: Math.random() * 6, stun: 0 }); }

  function startRun() {
    hero = { x: W / 2, y: H - 50, ang: -Math.PI / 2, t: 0 };   // ang = facing radians
    goods = []; bads = []; ink = []; keys = {};
    score = 0; lives = 3; spawnT = 0; badT = 2.2; cooldown = 0; invuln = 0;
    dead = false; started = true; playing = true; paused = false;
    pointer.active = false;
    scoreEl.textContent = '0'; drawHearts(); pauseBtn.textContent = '\u275A\u275A';
    for (var i = 0; i < 4; i++) spawnGood();
    hint.classList.add('hidden');
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function drawHearts() { var s = ''; for (var i = 0; i < 3; i++) s += '<span class="' + (i < lives ? '' : 'dead') + '">\u2665</span>'; heartsEl.innerHTML = s; }

  function shoot() {
    if (!playing || paused || dead || cooldown > 0) return;
    cooldown = 1.4;
    // fires forward, from the arm/head side (the facing direction)
    var fx = Math.cos(hero.ang), fy = Math.sin(hero.ang);
    ink.push({ x: hero.x + fx * 18, y: hero.y + fy * 18, vx: fx * 330, vy: fy * 330, life: 0.8, r: 7, seed: Math.random() * 6 });
    sfx('ink');
  }

  function loop(now) { var dt = Math.min(0.05, (now - last) / 1000); last = now; if (!paused) { update(dt); render(); } if (playing) raf = requestAnimationFrame(loop); }

  function update(dt) {
    hero.t += dt; if (cooldown > 0) cooldown -= dt; if (invuln > 0) invuln -= dt;
    var sp = 235, tx = 0, ty = 0, want = false;
    var mx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), my = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
    if (ctrl === 'keys') { if (mx || my) { var ml = Math.hypot(mx, my); tx = mx / ml; ty = my / ml; want = true; } }
    else if (pointer.active) { var dx = pointer.x - hero.x, dy = pointer.y - hero.y, d = Math.hypot(dx, dy); if (d > 3) { tx = dx / d; ty = dy / d; want = true; } }
    if (want) {
      hero.x += tx * sp * dt; hero.y += ty * sp * dt;
      var ta = Math.atan2(ty, tx), da = Math.atan2(Math.sin(ta - hero.ang), Math.cos(ta - hero.ang));
      hero.ang += da * Math.min(1, 15 * dt);   // smooth rotation -> any angle, not just 8
    }
    hero.x = Math.max(18, Math.min(W - 18, hero.x)); hero.y = Math.max(16, Math.min(H - 16, hero.y));

    for (var i = goods.length - 1; i >= 0; i--) {
      var g = goods[i]; g.y += g.vy * 60 * dt; g.x += Math.sin((hero.t * 60 + g.ph) * 0.04) * 0.3 * 60 * dt * 0.5;
      if (g.y < -14) { goods.splice(i, 1); continue; }
      if (Math.hypot(g.x - hero.x, g.y - hero.y) < g.r + 14) { goods.splice(i, 1); score++; scoreEl.textContent = score; sfx('collect'); }
    }
    spawnT -= dt; if (spawnT <= 0 && goods.length < 6) { spawnGood(); spawnT = Math.max(0.5, 1.4 - score * 0.02); }

    badT -= dt; if (badT <= 0 && bads.length < 2 + Math.min(3, (score / 6) | 0)) { spawnBad(); badT = Math.max(1.1, 2.6 - score * 0.04); }
    for (var j = bads.length - 1; j >= 0; j--) {
      var b = bads[j];
      if (b.stun > 0) { b.stun -= dt; b.y += Math.sin(hero.t * 2 + b.ph) * 4 * dt; }
      else { b.x += b.vx * 60 * dt; b.y += Math.sin(hero.t * 1.6 + b.ph) * 8 * dt; }
      if (b.x < -40 || b.x > W + 40) { bads.splice(j, 1); continue; }
      if (b.stun <= 0 && invuln <= 0 && Math.hypot(b.x - hero.x, b.y - hero.y) < b.r + 11) { lives--; drawHearts(); invuln = 1.3; sfx('hurt'); if (lives <= 0) return gameOver(); }
    }
    for (var k = ink.length - 1; k >= 0; k--) {
      var p = ink[k]; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0 || p.x < -12 || p.x > W + 12 || p.y < -12 || p.y > H + 12) { ink.splice(k, 1); continue; }
      for (var b2 = 0; b2 < bads.length; b2++) { if (bads[b2].stun <= 0 && Math.hypot(bads[b2].x - p.x, bads[b2].y - p.y) < bads[b2].r + p.r) { bads[b2].stun = 2.8; ink.splice(k, 1); sfx('stun'); break; } }
    }
  }

  function render() {
    ctx.fillStyle = FIELD; ctx.fillRect(0, 0, W, H);
    var pal = P(), i;
    for (i = 0; i < goods.length; i++) drawGood(goods[i], pal);
    for (i = 0; i < ink.length; i++) drawInk(ink[i], pal);
    for (i = 0; i < bads.length; i++) drawBad(bads[i]);
    if (hero) drawHero(pal);
  }
  function neon(c, glow, blur) { ctx.shadowColor = glow; ctx.shadowBlur = blur; }
  function darken(hex, f) { var n = parseInt(hex.slice(1), 16); return 'rgb(' + Math.round(((n >> 16) & 255) * f) + ',' + Math.round(((n >> 8) & 255) * f) + ',' + Math.round((n & 255) * f) + ')'; }
  function drawGood(g, pal) {
    if (CRADLE) {   // mulberry leaf — always green
      ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(Math.sin(g.ph) * 0.5);
      neon(0, '#3f7d1e', 5); ctx.beginPath(); ctx.ellipse(0, 0, g.r, g.r * 0.58, 0, 0, 7); ctx.fillStyle = '#84C23A'; ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#3f6b1e'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-g.r, 0); ctx.lineTo(g.r, 0); ctx.stroke(); ctx.restore();
    } else {   // bubble — matches hero hue
      neon(0, pal.glow, 6); ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 7); ctx.lineWidth = 2.4; ctx.strokeStyle = pal.good; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(g.x - g.r * 0.32, g.y - g.r * 0.32, g.r * 0.24, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
    }
  }
  function drawInk(p, pal) {
    ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 2.2); neon(0, CRADLE ? pal.glow : '#6c63c4', 6);
    ctx.fillStyle = CRADLE ? pal.ink : '#3a3470';
    ctx.beginPath();
    for (var a = 0; a < 7; a++) { var ang = a / 7 * Math.PI * 2, rr = p.r * (0.78 + 0.3 * Math.sin(ang * 3 + p.seed + p.life * 6)); var x = p.x + Math.cos(ang) * rr, y = p.y + Math.sin(ang) * rr; if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    ctx.lineWidth = 1; ctx.strokeStyle = CRADLE ? 'rgba(0,0,0,0.25)' : '#8a82d6'; ctx.stroke();
    ctx.restore();
  }
  function drawBad(b) {
    var st = b.stun > 0, pal = P(); ctx.save(); ctx.translate(b.x, b.y); ctx.globalAlpha = st ? 0.55 : 1;
    if (CRADLE) {   // beetle — hero hue, darker & dimmer
      neon(0, st ? '#888' : pal.glow, st ? 0 : 2);
      ctx.beginPath(); ctx.ellipse(0, 0, b.r, b.r * 0.8, 0, 0, 7); ctx.fillStyle = st ? '#6a6858' : darken(pal.hero, 0.34); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = darken(pal.hero, 0.18); ctx.lineWidth = 1.6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -b.r * 0.8); ctx.lineTo(0, b.r * 0.8); ctx.stroke();
      ctx.lineWidth = 1.3; for (var L = -1; L <= 1; L += 2) for (var s = -1; s <= 1; s++) { ctx.beginPath(); ctx.moveTo(L * b.r * 0.5, s * 4); ctx.lineTo(L * (b.r + 5), s * 5 + (st ? 0 : Math.sin(hero.t * 6 + s) * 2)); ctx.stroke(); }
    } else {   // jellyfish — neon pink
      neon(0, st ? '#9aa6b8' : '#FF5D9E', st ? 0 : 7);
      ctx.beginPath(); ctx.arc(0, 0, b.r, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = st ? 'rgba(150,160,175,0.6)' : 'rgba(255,93,158,0.4)'; ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = st ? 'rgba(200,210,225,0.95)' : '#FF7FB2'; ctx.lineWidth = 2; ctx.stroke();
      ctx.lineWidth = 1.6; for (var k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * b.r * 0.32, 0); ctx.quadraticCurveTo(k * b.r * 0.32 + (st ? 0 : Math.sin(hero.t * 3 + k) * 3), b.r * 0.9, k * b.r * 0.32, b.r * 1.5); ctx.stroke(); }
    }
    ctx.restore();
  }
  function drawHero(pal) {
    ctx.save(); ctx.translate(hero.x, hero.y);
    ctx.rotate(hero.ang);
    if (Math.cos(hero.ang) < 0) ctx.scale(1, -1);   // keep belly/eye oriented
    // when a life was just lost: desaturate + blink translucent (stronger blink)
    var blinking = invuln > 0 && Math.floor(hero.t * 11) % 2 === 0;
    if (blinking) { ctx.globalAlpha = 0.28; ctx.filter = 'grayscale(0.85)'; }
    if (CRADLE) {   // silkworm — segmented, head (+x) leads so you can read direction
      var N = 6;
      for (var sg = 0; sg < N; sg++) {
        var px = (sg - (N - 1) / 2) * 8.4, py = Math.sin(hero.t * 7 - sg * 0.6) * 2.1;
        var rr = (sg === N - 1) ? 8.4 : 6 + 2.8 * Math.sin(sg / (N - 1) * Math.PI);
        neon(0, pal.glow, 7); ctx.beginPath(); ctx.arc(px, py, rr, 0, 7); ctx.fillStyle = pal.hero; ctx.fill(); ctx.shadowBlur = 0;
        ctx.lineWidth = 1.3; ctx.strokeStyle = darken(pal.hero, 0.5); ctx.stroke();
      }
      var hx = ((N - 1) - (N - 1) / 2) * 8.4;
      ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(hx + 2, -2.5, 2, 0, 7); ctx.fill();   // eye
      ctx.strokeStyle = pal.hero; ctx.lineWidth = 1.5; ctx.lineCap = 'round';   // antennae point forward
      ctx.beginPath(); ctx.moveTo(hx + 4, -4); ctx.lineTo(hx + 10, -10); ctx.moveTo(hx + 4, -1.5); ctx.lineTo(hx + 11, -5); ctx.stroke();
    } else {   // cuttlefish — rounder mantle, arm crown at front (+x)
      neon(0, pal.glow, 6);
      ctx.beginPath(); ctx.moveTo(22, 0);
      ctx.bezierCurveTo(19, -16, -14, -16, -27, -5);
      ctx.bezierCurveTo(-31, -1.5, -31, 1.5, -27, 5);
      ctx.bezierCurveTo(-14, 16, 19, 16, 22, 0); ctx.closePath();
      ctx.fillStyle = pal.hero; ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0,0,0,0.32)'; ctx.lineWidth = 1.8; ctx.stroke();   // crisp outline
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;   // fin frill
      ctx.beginPath(); for (var fx = -24; fx <= 17; fx += 2) { var y = 13.5 + Math.sin(fx * 0.6 + hero.t * 8) * 2.4; if (fx === -24) ctx.moveTo(fx, y); else ctx.lineTo(fx, y); } ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 1; for (var bnd = -16; bnd <= 12; bnd += 5) { ctx.beginPath(); ctx.moveTo(bnd, -11); ctx.lineTo(bnd, 11); ctx.stroke(); }
      ctx.strokeStyle = pal.hero; ctx.lineWidth = 2.2; ctx.lineCap = 'round';   // arm crown
      for (var t = -2; t <= 2; t++) { ctx.beginPath(); ctx.moveTo(21, t * 2.6); ctx.quadraticCurveTo(29, t * 2.6 + Math.sin(hero.t * 7 + t) * 2.5, 34 + Math.sin(hero.t * 5 + t) * 2, t * 4.2); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(8, -5, 4.6, 0, 7); ctx.fillStyle = '#fbf4e2'; ctx.fill();   // eye
      ctx.strokeStyle = '#06212a'; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(6, -5); ctx.lineTo(7, -3.5); ctx.lineTo(8, -5); ctx.lineTo(9, -3.5); ctx.lineTo(10, -5); ctx.stroke();   // W pupil
    }
    ctx.restore(); ctx.shadowBlur = 0;
  }

  function showMsg(big, rulesHTML, subHTML, btn) {
    overlay.querySelector('#psg-big').textContent = big;
    var r = overlay.querySelector('#psg-rules'), su = overlay.querySelector('#psg-sub');
    if (rulesHTML) { r.innerHTML = rulesHTML; r.style.display = ''; } else r.style.display = 'none';
    if (subHTML) { su.innerHTML = subHTML; su.style.display = ''; } else su.style.display = 'none';
    retry.textContent = btn; hint.classList.remove('hidden');
  }
  function gameOver() {
    playing = false; dead = true; cancelAnimationFrame(raf);
    if (score > best) { best = score; try { localStorage.setItem(BKEY, best); } catch (e) {} }
    bestEl.textContent = best;
    var msg = score >= best && score > 0 ? 'a new best — ' + score + ' ' + T.good + '!' : WINMSG[Math.floor(Math.random() * WINMSG.length)];
    showMsg(T.overs[Math.floor(Math.random() * T.overs.length)], '', '<b style="color:#EAF6F5">' + msg + '</b><br>' + score + ' ' + T.good + ' gathered \u00b7 press space or tap to play again.', 'again \u2192');
    render();
  }
  function startRules() {
    var fire = '<kbd>space</kbd> or <kbd>click</kbd>';
    return '<li>' + T.instr[0] + '</li><li>' + T.instr[1] + '</li>' +
      '<li>Move with <kbd>\u2190\u2191\u2193\u2192</kbd> / <kbd>WASD</kbd>, or your cursor.</li>' +
      '<li>' + fire + ' to release ' + T.shootWord + ' \u00b7 you have <b>3</b> \u2665</li>';
  }
  function pause() {
    if (!playing || dead || !started || paused) return;
    paused = true; pauseBtn.textContent = '\u25B6';
    showMsg('paused', '', 'press <kbd>P</kbd> or tap resume.', 'resume \u2192');
  }
  function resume() {
    if (!paused) return;
    paused = false; pauseBtn.textContent = '\u275A\u275A'; hint.classList.add('hidden');
    last = performance.now();
  }

  function setKey(e, on) {
    var k = e.key.toLowerCase(), hit = true;
    if (k === 'arrowup' || k === 'w') keys.up = on; else if (k === 'arrowdown' || k === 's') keys.down = on;
    else if (k === 'arrowleft' || k === 'a') keys.left = on; else if (k === 'arrowright' || k === 'd') keys.right = on; else hit = false;
    if (hit && ctrl === 'keys') e.preventDefault(); return hit;
  }
  document.addEventListener('keydown', function (e) {
    if (!overlay || !overlay.classList.contains('open')) return;
    var k = e.key.toLowerCase();
    if (k === 'escape') { close(); return; }
    if (k === 'p') { if (paused) resume(); else pause(); return; }
    if (k === ' ') { e.preventDefault(); if (dead || !started) startRun(); else if (paused) resume(); else shoot(); return; }
    if (k === 'enter') { if (dead || !started) { e.preventDefault(); startRun(); } return; }
    setKey(e, true);
  });
  document.addEventListener('keyup', function (e) { if (overlay && overlay.classList.contains('open')) setKey(e, false); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && playing && !paused && !dead && started) pause(); });

  function open() {
    if (!overlay) build();
    overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false');
    started = false; dead = false; playing = false; paused = false;
    syncSnd(); syncCtrl(); drawHearts();
    showMsg(T.name, startRules(), '', 'dive in \u2192');
    pauseBtn.textContent = '\u275A\u275A';
    ctx.fillStyle = FIELD; ctx.fillRect(0, 0, W, H);
  }
  function close() { playing = false; paused = false; cancelAnimationFrame(raf); if (overlay) { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); } }

  // secret: keep dropping stones on the logo dot (3–6 ripples) and it surfaces
  (function () {
    var dot = document.querySelector('.nav-logo .dot');
    if (!dot) return;
    var n = 0, target = 3 + Math.floor(Math.random() * 4), t;
    dot.addEventListener('click', function () {
      n++; clearTimeout(t); t = setTimeout(function () { n = 0; target = 3 + Math.floor(Math.random() * 4); }, 1300);
      if (n >= target) { n = 0; target = 3 + Math.floor(Math.random() * 4); open(); }
    });
  })();

  window.PerSeaGame = { open: open, close: close };
})();
