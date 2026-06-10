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
    if (!nav) return;
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

  /* active section highlight (only on pages with in-page anchors) */
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

  /* ---------- REVEAL engine ---------- */
  function revealAll() {
    document.querySelectorAll('[data-reveal], [data-reveal-stagger], .wipe').forEach(function (el) { el.classList.add('in'); });
  }
  if (reduce) {
    revealAll();
  } else if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, delay);
        // stagger children
        if (el.hasAttribute('data-reveal-stagger')) {
          var step = parseInt(el.getAttribute('data-reveal-stagger') || '90', 10) || 90;
          Array.prototype.slice.call(el.children).forEach(function (child, i) {
            child.style.transitionDelay = (i * step) + 'ms';
          });
        }
        revObs.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal], [data-reveal-stagger], .wipe').forEach(function (el) { revObs.observe(el); });
  } else {
    revealAll();
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
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('drawn'); tObs.unobserve(e.target); } });
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    transects.forEach(function (t) { tObs.observe(t); });
  } else {
    transects.forEach(function (t) { t.classList.add('drawn'); });
  }

  /* ---------- COUNTERS ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var dur = 1500, start = null;
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
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); } });
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

  /* ---------- DEPTH GAUGE ---------- */
  var gauge = document.querySelector('.depth-gauge');
  if (gauge) {
    var read = gauge.querySelector('.dg-read');
    var fill = gauge.querySelector('.dg-fill');
    var maxDepth = parseFloat(gauge.getAttribute('data-max') || '40');
    function onGauge() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      var depth = (p * maxDepth);
      if (read) read.textContent = depth.toFixed(1) + ' m';
      if (fill) fill.style.height = (p * 100) + '%';
      if (window.scrollY > 80) gauge.classList.add('show'); else gauge.classList.remove('show');
    }
    window.addEventListener('scroll', onGauge, { passive: true });
    window.addEventListener('resize', onGauge);
    onGauge();
  }

  /* ---------- LIGHTBOX (gallery) ---------- */
  var lbItems = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (lbItems.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous">&#8249;</button><img alt=""><button class="lb-next" aria-label="Next">&#8250;</button><div class="lb-cap"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap'), idx = 0;
    function show(i) {
      idx = (i + lbItems.length) % lbItems.length;
      var el = lbItems[idx];
      var src = el.getAttribute('data-lightbox') || (el.querySelector('img') && el.querySelector('img').src);
      lbImg.src = src;
      lbCap.textContent = el.getAttribute('data-caption') || '';
    }
    function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    lbItems.forEach(function (el, i) { el.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  document.body.classList.add('loaded');
})();
