/* ============================================================
   AVELINA, PER SEA — shared motion + interaction engine
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV: scrolled state, mobile toggle, active section ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  function onScrollNav() {
    if (!nav || nav.classList.contains('always-solid')) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); toggle.classList.remove('open'); });
    });
  }

  /* active section highlight */
  var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (sectionLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    sectionLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          sectionLinks.forEach(function (a) { a.classList.remove('active'); });
          if (map[e.target.id]) map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { secObs.observe(document.getElementById(id)); });
  }

  /* ---------- REVEAL engine (re-triggers in BOTH directions) ---------- */
  function applyStagger(el) {
    if (el.hasAttribute('data-reveal-stagger')) {
      var step = parseInt(el.getAttribute('data-reveal-stagger') || '90', 10) || 90;
      Array.prototype.slice.call(el.children).forEach(function (child, i) {
        child.style.transitionDelay = (i * step) + 'ms';
      });
    }
  }
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger], .wipe');
  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    revealEls.forEach(applyStagger);
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;
        if (e.isIntersecting) {
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay) { setTimeout(function () { el.classList.add('in'); }, delay); }
          else { el.classList.add('in'); }
        } else {
          // reset only when it leaves past the TOP or well below, so re-scroll replays it
          el.classList.remove('in');
        }
      });
    }, { threshold: 0.14, rootMargin: '-2% 0px -10% 0px' });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- TRANSECT dividers ---------- */
  var transects = document.querySelectorAll('[data-transect]');
  transects.forEach(function (t) {
    var label = t.getAttribute('data-label') || '';
    var ticks = '';
    for (var i = 0; i < 25; i++) ticks += '<span></span>';
    t.innerHTML = '<div class="transect-inner"><div class="transect-line"></div><div class="transect-ticks">' + ticks + '</div><div class="transect-dot"></div><div class="transect-label">' + label + '</div></div>';
  });
  if (reduce) {
    transects.forEach(function (t) { t.classList.add('drawn'); });
  } else if ('IntersectionObserver' in window) {
    var tObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('drawn');
        else e.target.classList.remove('drawn');
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
    transects.forEach(function (t) { tObs.observe(t); });
  } else {
    transects.forEach(function (t) { t.classList.add('drawn'); });
  }

  /* ---------- COUNTERS (replay each time they enter) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) animateCount(e.target); });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- PARALLAX ---------- */
  var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (pEls.length && !reduce) {
    var ticking = false;
    function parallax() {
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var host = el.closest('[data-parallax-host]') || el.parentElement;
        var rect = host.getBoundingClientRect();
        if (rect.bottom > -200 && rect.top < vh + 200) {
          var center = rect.top + rect.height / 2 - vh / 2;
          el.style.transform = 'translate3d(0,' + (-center * speed) + 'px,0)';
        }
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } }, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }

  /* ---------- PROGRESS GAUGE (% scrolled + the ocean zone you've "descended" into) ----------
     The number is an honest scroll percentage. The label maps that percentage to a real
     pelagic depth zone — so reading the page feels like descending the water column,
     without inventing fake meter numbers. */
  var gauge = document.querySelector('.depth-gauge');
  if (gauge) {
    var read = gauge.querySelector('.dg-read');
    var zoneEl = gauge.querySelector('.dg-zone');
    var fill = gauge.querySelector('.dg-fill');
    // ordered top -> bottom; each zone covers everything up to its threshold
    var OCEAN_ZONES = [
      { upTo: 0.16, name: 'Sunlight zone' },
      { upTo: 0.38, name: 'Twilight zone' },
      { upTo: 0.62, name: 'Midnight zone' },
      { upTo: 0.84, name: 'Abyssal zone' },
      { upTo: 1.01, name: 'Hadal zone' }
    ];
    function zoneFor(p) {
      for (var i = 0; i < OCEAN_ZONES.length; i++) { if (p <= OCEAN_ZONES[i].upTo) return OCEAN_ZONES[i].name; }
      return OCEAN_ZONES[OCEAN_ZONES.length - 1].name;
    }
    function renderGauge() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(Math.max(window.scrollY / h, 0), 1) : 0;
      if (read) read.textContent = Math.round(p * 100) + '%';
      if (zoneEl) zoneEl.textContent = zoneFor(p);
      if (fill) fill.style.height = (p * 100) + '%';
      if (window.scrollY > 80) gauge.classList.add('show'); else gauge.classList.remove('show');
    }
    window.addEventListener('scroll', renderGauge, { passive: true });
    window.addEventListener('resize', renderGauge);
    renderGauge();
  }

  /* ---------- LIGHTBOX (reusable; bind any unbound [data-lightbox]) ---------- */
  var lb, lbImg, lbCap, lbList = [], lbIdx = 0;
  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous">&#8249;</button><img alt=""><button class="lb-next" aria-label="Next">&#8250;</button><div class="lb-cap"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img'); lbCap = lb.querySelector('.lb-cap');
    function show(i) {
      lbIdx = (i + lbList.length) % lbList.length;
      var el = lbList[lbIdx];
      lbImg.src = el.getAttribute('data-lightbox') || (el.querySelector('img') && el.querySelector('img').src);
      lbCap.textContent = el.getAttribute('data-caption') || '';
    }
    lb.__show = show;
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(lbIdx + 1); });
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(lbIdx - 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') show(lbIdx + 1);
      if (e.key === 'ArrowLeft') show(lbIdx - 1);
    });
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function initLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!items.length) return;
    if (!lb) buildLightbox();
    lbList = items;
    items.forEach(function (el, i) {
      if (el.__lbBound) return;
      el.__lbBound = true;
      el.addEventListener('click', function () {
        // scope prev/next to the nearest album group if one is present, else the whole page
        var group = el.closest('[data-lb-group]') || document;
        lbList = Array.prototype.slice.call(group.querySelectorAll('[data-lightbox]'));
        lb.__show(lbList.indexOf(el));
        lb.classList.add('open'); document.body.style.overflow = 'hidden';
      });
    });
  }
  window.__perSeaInitLightbox = initLightbox;
  initLightbox();

  /* ---------- soft anchor scroll (lands target comfortably below the nav, then
                 blinks the destination so the jump is legible) ---------- */
  document.querySelectorAll('[data-soft-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: 'smooth' });
      var sel = a.getAttribute('data-pulse');
      var pulseEl = sel ? document.querySelector(sel) : target;
      if (pulseEl && !reduce) {
        setTimeout(function () {
          pulseEl.classList.remove('attn-pulse');
          void pulseEl.offsetWidth;
          pulseEl.classList.add('attn-pulse');
          setTimeout(function () { pulseEl.classList.remove('attn-pulse'); }, 1700);
        }, 520);
      }
    });
  });

  /* ---------- FOOTER: copyright + discreet "report a problem" (every page) ---------- */
  (function () {
    var foot = document.querySelector('.site-foot .wrap');
    if (!foot || foot.querySelector('.foot-meta')) return;
    var year = new Date().getFullYear();
    var bar = document.createElement('div');
    bar.className = 'foot-meta';
    bar.innerHTML =
      '<span class="foot-copy">&copy; ' + year + ' Avelina Axonov. All rights reserved. ' +
      'Words, images &amp; code are mine \u2014 please ask before reusing.</span>' +
      '<a class="foot-report" href="mailto:avelaxonov@gmail.com' +
      '?subject=per%20sea%20%E2%80%94%20something%20looks%20off&body=Page%3A%20' +
      encodeURIComponent(location.pathname.split('/').pop() || 'index.html') +
      '%0AWhat%20I%20saw%3A%20">Spot a problem? Tell me \u2192</a>';
    foot.appendChild(bar);
  })();

  /* ---------- EASTER EGGS ---------- */
  // 1) a quiet note for anyone who opens the console
  try {
    console.log('%c  per sea  ', 'background:#0D2B2E;color:#6BBFBE;font:600 14px/1.8 monospace;padding:2px 6px;');
    console.log('%cReef-search, per sea. If you are reading this, you went deep enough to find the console. Hello. \uD83D\uDC19', 'color:#C49A5A;font:italic 12px/1.6 serif;');
  } catch (e) {}

  // 2) a WATER RIPPLE — concentric rings spreading from a point, the way a drop
  //    lands on a still surface: a quick splash, then rings released one after
  //    another and softened with a faint glow. Event-driven and self-removing
  //    (it animates only transform/opacity), so it's idle-free and can't lag the
  //    page or break it.
  function pageRipple(x, y, opts) {
    opts = opts || {};
    if (reduce) return;
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--aqua').trim() || '#6BBFBE';
    var R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 1.08;
    var rings = opts.rings || 4;
    var layer = document.createElement('div');
    layer.setAttribute('style', 'position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;');
    // the splash where the drop lands
    var splash = document.createElement('div');
    splash.setAttribute('style', 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:radial-gradient(circle,' + accent + '99,' + accent + '11 58%,transparent 72%);will-change:transform,opacity;');
    layer.appendChild(splash);
    splash.animate([{ transform: 'scale(0.4)', opacity: 0.85 }, { transform: 'scale(8)', opacity: 0 }], { duration: 680, easing: 'ease-out', fill: 'forwards' });
    // concentric wavefronts, each released a beat after the last
    for (var i = 0; i < rings; i++) {
      var seed = 28;
      var ring = document.createElement('div');
      ring.setAttribute('style', 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + seed + 'px;height:' + seed + 'px;margin:' + (-seed / 2) + 'px 0 0 ' + (-seed / 2) + 'px;border-radius:50%;border:1.5px solid ' + accent + ';box-shadow:0 0 13px ' + accent + '55, inset 0 0 9px ' + accent + '2e;opacity:0.5;filter:blur(0.3px);will-change:transform,opacity;');
      layer.appendChild(ring);
      ring.animate(
        [{ transform: 'scale(0.3)', opacity: 0.6 }, { offset: 0.12, opacity: 0.5 }, { transform: 'scale(' + ((R * 2) / seed) + ')', opacity: 0 }],
        { duration: 1750, delay: i * 240, easing: 'cubic-bezier(0.16,0.75,0.3,1)', fill: 'forwards' }
      );
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 1750 + rings * 240 + 300);
  }
  window.__perSeaRipple = pageRipple;

  // ---------- shared sound module (sfx toggle persists; used by ripple + game) ----------
  var SND = (function () {
    var on = true; try { on = localStorage.getItem('perSea.snd') !== '0'; } catch (e) {}
    var cache = {};
    function get(k) { if (!cache[k]) { var a = new Audio('assets/sfx/' + k + '.mp3'); a.preload = 'auto'; a.volume = (k === 'ripple') ? 0.3 : 0.4; cache[k] = a; } return cache[k]; }
    return {
      isOn: function () { return on; },
      set: function (v) { on = !!v; try { localStorage.setItem('perSea.snd', on ? '1' : '0'); } catch (e) {} },
      toggle: function () { this.set(!on); return on; },
      play: function (k) { if (!on) return; try { var b = get(k); var a = b.cloneNode(); a.volume = b.volume; a.play().catch(function () {}); } catch (e) {} }
    };
  })();
  window.__perSeaSound = SND;
  window.__perSeaPlaySfx = function (k) { SND.play(k); };

  // 3) DISCOVERABLE TRIGGERS (and they all work on mobile):
  //    • tap the little dot in the logo            → a ripple from the dot
  //    • tap a [data-tug] title (e.g. the writing
  //      page's "Weaver's Cradle")                  → ripple + the title shivers
  (function () {
    var dot = document.querySelector('.nav-logo .dot');
    if (dot) {
      dot.style.cursor = 'pointer';
      dot.setAttribute('title', 'drop a stone');
      dot.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();   // ripple instead of navigating home
        var r = dot.getBoundingClientRect();
        pageRipple(r.left + r.width / 2, r.top + r.height / 2, { rings: 4 });
        SND.play('ripple');
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-tug]'), function (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () {
        var r = el.getBoundingClientRect();
        pageRipple(r.left + r.width / 2, r.top + r.height / 2, { rings: 4 });
        el.classList.remove('tugged'); void el.offsetWidth; el.classList.add('tugged');
        setTimeout(function () { el.classList.remove('tugged'); }, 1300);
      });
    });
  })();

  document.body.classList.add('loaded');

  /* ---------- FOOTNOTE TOOLTIPS (essay pages; no-op elsewhere) ---------- */
  (function () {
    var fns = document.querySelectorAll('.fn[data-fn]');
    if (!fns.length) return;
    var tip = document.createElement('div'); tip.className = 'fn-tip'; document.body.appendChild(tip);
    var hideT;
    function show(el) {
      var n = el.getAttribute('data-fn');
      var note = document.getElementById('fn-' + n + '-note');
      if (!note) return;
      clearTimeout(hideT);
      tip.innerHTML = note.innerHTML.replace(/^<span class="fn-bk">[\s\S]*?<\/span>\s*/, '');
      tip.classList.add('show');
      var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 8);
      var y = r.bottom + 8; if (y + th > window.innerHeight - 8) y = r.top - th - 8;
      tip.style.left = x + 'px'; tip.style.top = Math.max(8, y) + 'px';
    }
    function hide() { hideT = setTimeout(function () { tip.classList.remove('show'); }, 90); }
    Array.prototype.forEach.call(fns, function (el) {
      el.addEventListener('mouseenter', function () { show(el); });
      el.addEventListener('mouseleave', hide);
      el.addEventListener('focus', function () { show(el); });
      el.addEventListener('blur', hide);
      el.addEventListener('click', function (e) { e.preventDefault(); show(el); });
    });
    tip.addEventListener('mouseenter', function () { clearTimeout(hideT); });
    tip.addEventListener('mouseleave', hide);
    window.addEventListener('scroll', function () { tip.classList.remove('show'); }, { passive: true });
  })();
})();
