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

  /* ---------- PROGRESS GAUGE (honest % scrolled + real section name) ---------- */
  var gauge = document.querySelector('.depth-gauge');
  if (gauge) {
    var read = gauge.querySelector('.dg-read');
    var zoneEl = gauge.querySelector('.dg-zone');
    var fill = gauge.querySelector('.dg-fill');
    var stations = Array.prototype.slice.call(document.querySelectorAll('[data-zone]'));
    function currentZone() {
      var probe = window.innerHeight * 0.4;
      var cur = '';
      stations.forEach(function (s) { if (s.getBoundingClientRect().top <= probe) cur = s.getAttribute('data-zone'); });
      return cur || (stations[0] ? stations[0].getAttribute('data-zone') : '');
    }
    function renderGauge() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(Math.max(window.scrollY / h, 0), 1) : 0;
      if (read) read.textContent = Math.round(p * 100) + '%';
      if (zoneEl) zoneEl.textContent = currentZone();
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
        lbList = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
        lb.__show(lbList.indexOf(el));
        lb.classList.add('open'); document.body.style.overflow = 'hidden';
      });
    });
  }
  window.__perSeaInitLightbox = initLightbox;
  initLightbox();

  document.body.classList.add('loaded');
})();
