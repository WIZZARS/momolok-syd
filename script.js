/* =====================================================
   MO MOLOK — script.js
   Interactive prayer flags + all JS interactions
   ===================================================== */

(function () {
  'use strict';

  /* ── FLAG COLOURS ── */
  const FLAG_COLORS = [
    { fill: '#1B6CA8', label: 'Blue' },
    { fill: '#FFFFFF', label: 'White' },
    { fill: '#C8102E', label: 'Red' },
    { fill: '#2D8A4E', label: 'Green' },
    { fill: '#F5C518', label: 'Yellow' },
    { fill: '#9B3AC2', label: 'Purple' },
    { fill: '#F57C00', label: 'Orange' },
  ];

  /* Prayer flag symbols */
  const FLAG_SYMBOLS = ['ॐ', '☸', '✦', '◆', '❖', '✤', '✺'];

  /* ── MOUSE TRACKING ── */
  let mouseX = 0;
  let lastMouseVX = 0;
  let animFrame;

  document.addEventListener('mousemove', (e) => {
    const prevX = mouseX;
    mouseX = e.clientX;
    lastMouseVX = mouseX - prevX;
  });

  /* ── GENERATE SVG FLAGS ── */
  function createFlag(colorData, symbolChar, index) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '54');
    svg.setAttribute('height', '44');
    svg.setAttribute('viewBox', '0 0 54 44');
    svg.classList.add('prayer-flag');
    svg.setAttribute('aria-hidden', 'true');

    // Flag body
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', '54');
    rect.setAttribute('height', '44');
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', colorData.fill);
    rect.setAttribute('opacity', '0.92');
    svg.appendChild(rect);

    // Border
    const border = document.createElementNS(svgNS, 'rect');
    border.setAttribute('x', '1');
    border.setAttribute('y', '1');
    border.setAttribute('width', '52');
    border.setAttribute('height', '42');
    border.setAttribute('rx', '2');
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    border.setAttribute('stroke-width', '1');
    svg.appendChild(border);

    // Inner horizontal lines (mantra-like)
    for (let i = 0; i < 4; i++) {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', '6');
      line.setAttribute('y1', String(10 + i * 8));
      line.setAttribute('x2', '48');
      line.setAttribute('y2', String(10 + i * 8));
      line.setAttribute('stroke', 'rgba(255,255,255,0.25)');
      line.setAttribute('stroke-width', '0.8');
      svg.appendChild(line);
    }

    // Centre symbol
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', '27');
    text.setAttribute('y', '25');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', 'rgba(255,255,255,0.55)');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-family', 'serif');
    text.textContent = symbolChar;
    svg.appendChild(text);

    return svg;
  }

  /* ── BUILD FLAGS ON ROPE ── */
  function buildFlagRope(ropeId, count, startPct, endPct, verticalOffset) {
    const rope = document.getElementById(ropeId);
    if (!rope) return;

    for (let i = 0; i < count; i++) {
      const pct = startPct + (endPct - startPct) * (i / (count - 1));
      const colorData = FLAG_COLORS[i % FLAG_COLORS.length];
      const symbol = FLAG_SYMBOLS[i % FLAG_SYMBOLS.length];
      const flag = createFlag(colorData, symbol, i);

      // Catenary-like drape
      const catenarySag = Math.sin(Math.PI * (i / (count - 1))) * 60;
      const leftPos = pct * 100;

      flag.style.left = 'calc(' + leftPos + '% - 27px)';
      flag.style.top = (verticalOffset + catenarySag) + 'px';
      flag.style.position = 'absolute';

      // Each flag has a base rotation and physics metadata
      flag._baseAngle = (i % 2 === 0) ? -5 : 5;
      flag._index = i;
      flag._windPhase = (i / count) * Math.PI * 2;
      flag.style.transform = 'rotate(' + flag._baseAngle + 'deg)';
      flag.style.transformOrigin = 'top center';

      rope.appendChild(flag);
    }
  }

  /* ── WIND PHYSICS ANIMATION ── */
  let windIntensity = 0;
  let windTarget = 0;
  let time = 0;

  function animateFlags() {
    time += 0.025;

    // Build wind from mouse velocity
    windTarget = Math.max(-1, Math.min(1, lastMouseVX * 0.04));
    windIntensity += (windTarget - windIntensity) * 0.04;

    // Ambient gentle sway
    const ambientWind = Math.sin(time * 0.7) * 0.12 + Math.sin(time * 1.3) * 0.06;
    const totalWind = windIntensity + ambientWind;

    const allFlags = document.querySelectorAll('.prayer-flag');
    allFlags.forEach(function(flag) {
      const idx = flag._index || 0;
      const phase = flag._windPhase || 0;
      const base = flag._baseAngle || 0;

      // Each flag responds with a phase delay to simulate wave motion
      const phaseShift = Math.sin(time * 2.8 + phase + idx * 0.3) * 6;
      const windBend = totalWind * 18 * Math.sin(phase + idx * 0.2 + time * 1.1);
      const microFlutter = Math.sin(time * 5 + idx * 0.7) * 1.5;

      const finalAngle = base + phaseShift + windBend + microFlutter;
      const skewX = totalWind * 5;

      flag.style.transform = 'rotate(' + finalAngle + 'deg) skewX(' + skewX + 'deg)';
    });

    // Dampen wind naturally
    lastMouseVX *= 0.88;

    animFrame = requestAnimationFrame(animateFlags);
  }

  /* ── PRELOADER ── */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    function hidePreloader() {
      preloader.classList.add('hidden');
      setTimeout(function() {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 800);
    }

    // Hide after page loads + short delay for branding moment
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 1800);
    } else {
      window.addEventListener('load', function() {
        setTimeout(hidePreloader, 1800);
      });
    }
    // Failsafe: hide after 4 seconds
    setTimeout(hidePreloader, 4000);
  }

  /* ── NAVBAR SCROLL ── */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var scrolled = false;
    window.addEventListener('scroll', function() {
      var shouldScroll = window.pageYOffset > 80;
      if (shouldScroll !== scrolled) {
        scrolled = shouldScroll;
        navbar.classList.toggle('scrolled', scrolled);
      }
    }, { passive: true });

    // Hamburger
    var hamburger = document.getElementById('hamburger-btn');
    if (hamburger) {
      hamburger.addEventListener('click', function() {
        var isOpen = navbar.classList.toggle('menu-open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on nav link click
      document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
          navbar.classList.remove('menu-open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ── MENU FILTERING ── */
  function initMenuFilter() {
    var tabs = document.querySelectorAll('.tab-btn');
    var cards = document.querySelectorAll('.menu-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var filter = tab.getAttribute('data-filter');

        tabs.forEach(function(t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        cards.forEach(function(card) {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            var cat = card.getAttribute('data-cat');
            if (cat === filter) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          }
        });
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    var groups = [
      '.about-text', '.about-visual',
      '.dharan-fact', '.menu-card',
      '.contact-card', '.contact-map-wrap',
      '.dharan-img-wrap', '.dharan-facts',
      '.specials-text', '.specials-visual'
    ];

    groups.forEach(function(selector, i) {
      document.querySelectorAll(selector).forEach(function(el, j) {
        var type = (i + j) % 3;
        if (type === 0) el.classList.add('reveal-left');
        else if (type === 1) el.classList.add('reveal');
        else el.classList.add('reveal-right');
      });
    });

    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ── PARALLAX HERO BG ── */
  function initParallax() {
    var heroBg = document.getElementById('hero-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', function() {
      var scrolled = window.pageYOffset;
      var rate = scrolled * 0.35;
      heroBg.style.transform = 'scale(1.05) translateY(' + rate + 'px)';
    }, { passive: true });
  }

  /* ── NEON SIGN PULSE ── */
  function initNeonEffect() {
    var neon = document.getElementById('neon-sign-img');
    if (!neon) return;

    var t = 0;
    function flickerNeon() {
      t += 0.05;
      var intensity = 0.85 + Math.sin(t * 3) * 0.07 + Math.random() * 0.03;
      neon.style.filter = [
        'drop-shadow(0 0 ' + (12 * intensity) + 'px rgba(200, 16, 46, ' + (0.6 * intensity) + '))',
        'drop-shadow(0 0 ' + (24 * intensity) + 'px rgba(200, 16, 46, ' + (0.35 * intensity) + '))',
        'brightness(' + (intensity + 0.1) + ')'
      ].join(' ');
      requestAnimationFrame(flickerNeon);
    }
    flickerNeon();
  }

  /* ── ANIMATED COUNTER ── */
  function animateCounter(el, targetStr, suffix, duration) {
    var target = parseFloat(targetStr);
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = targetStr + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var statEls = [
      { id: 'stat-rating',  target: '4.8', suffix: '',  duration: 1200 },
      { id: 'stat-reviews', target: '67',  suffix: '+', duration: 1500 },
      { id: 'stat-items',   target: '30',  suffix: '+', duration: 1800 },
    ];

    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          var found = statEls.find(function(s) { return s.id === entry.target.id; });
          if (found) {
            var numEl = entry.target.querySelector('.stat-num');
            if (numEl) animateCounter(numEl, found.target, found.suffix, found.duration);
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach(function(s) {
      var el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  /* ── ACTIVE NAV LINK ── */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    var obs = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function(link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + entry.target.id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(function(s) { obs.observe(s); });
  }

  /* ── CARD HOVER TILT ── */
  function initCardTilt() {
    document.querySelectorAll('.menu-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        var rotX = -dy * 5;
        var rotY = dx * 5;
        card.style.transform = 'translateY(-6px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        card.style.transition = 'transform 0.1s ease';
        card.style.perspective = '800px';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
        card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ── SMOOTH SCROLL OFFSET FOR NAVBAR + TICKER ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = 32 + 80; // ticker height + navbar height
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── INIT ── */
  function init() {
    initPreloader();
    buildFlagRope('flag-rope-1', 14, 0.04, 0.96, 8);
    buildFlagRope('flag-rope-2', 11, 0.1, 0.9, 40);
    animateFlags();
    initNavbar();
    initMenuFilter();
    initScrollReveal();
    initParallax();
    initNeonEffect();
    initCounters();
    initActiveNav();
    initCardTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
