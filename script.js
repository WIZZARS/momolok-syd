/* =====================================================
   MO MOLOK — script.js
   Refactored JavaScript for Dharan Aesthetic & Interactive UX
   ===================================================== */

(function () {
  'use strict';

  /* ── PRELOADER DISMISSAL ── */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    function hidePreloader() {
      preloader.classList.add('hidden');
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 700);
    }

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hidePreloader, 1000);
      });
    }
    // Failsafe timer
    setTimeout(hidePreloader, 3000);
  }

  /* ── NAVBAR SCROLL & MOBILE DRAWER ── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-btn');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('menu-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navbar.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ── LIVE OPENING HOURS STATUS ── */
  function updateLiveStatus() {
    const statusTextEl = document.getElementById('live-status-text');
    if (!statusTextEl) return;

    const now = new Date();
    const hour = now.getHours();
    
    // Open roughly between 14:00 (2 PM) and 23:00 (11 PM)
    if (hour >= 14 && hour < 23) {
      statusTextEl.textContent = '● Open Now · Serving Fresh Dharane Momos in Ashfield';
    } else {
      statusTextEl.textContent = 'Opening Today at 2:00 PM · Ashfield, Sydney';
    }
  }

  /* ── MENU FILTERING & LIVE SEARCH ── */
  function initMenuSearchAndFilter() {
    const searchInput = document.getElementById('menu-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    const tabs = document.querySelectorAll('#menu-tabs .tab-btn');
    const cards = document.querySelectorAll('.menu-card');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterMenu() {
      cards.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        const searchTerms = (card.getAttribute('data-name') || '') + ' ' + (card.textContent || '');

        const matchesCat = (activeFilter === 'all' || cat === activeFilter);
        const matchesSearch = (!searchQuery || searchTerms.toLowerCase().includes(searchQuery.toLowerCase()));

        if (matchesCat && matchesSearch) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    // Tab buttons
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        activeFilter = tab.getAttribute('data-filter') || 'all';
        filterMenu();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (clearBtn) {
          clearBtn.style.display = searchQuery ? 'block' : 'none';
        }
        filterMenu();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        filterMenu();
      });
    }
  }

  /* ── RESERVATION MODAL LOGIC ── */
  function initReservationModal() {
    const modal = document.getElementById('reservation-modal');
    const openBtns = [
      document.getElementById('open-reserve-btn'),
      document.getElementById('hero-reserve-btn')
    ];
    const closeBtn = document.getElementById('close-modal-btn');
    const form = document.getElementById('reservation-form');
    const formContent = document.getElementById('modal-form-content');
    const successState = document.getElementById('modal-success-state');
    const successCloseBtn = document.getElementById('success-close-btn');

    if (!modal) return;

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (formContent) formContent.classList.remove('hidden');
        if (successState) successState.classList.add('hidden');
        if (form) form.reset();
      }, 300);
    }

    openBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('res-name')?.value || 'Guest';
        const dateVal = document.getElementById('res-date')?.value || 'Today';
        const timeVal = document.getElementById('res-time')?.value || 'Evening';
        const guestsVal = document.getElementById('res-guests')?.value || '2';

        document.getElementById('success-guest-name').textContent = nameVal;
        document.getElementById('success-details').textContent = `${guestsVal} guests on ${dateVal} at ${timeVal}`;

        if (formContent) formContent.classList.add('hidden');
        if (successState) successState.classList.remove('hidden');
      });
    }
  }

  /* ── SCROLL REVEAL INTERSECTION OBSERVER ── */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.about-text-col, .about-visual-col, .promise-card, .menu-card, .dharan-pillar-card, .gallery-item, .review-card, .contact-card'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  /* ── SMOOTH SCROLL OFFSET FOR ANCHORS ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        const navbarOffset = 34 + 70; // Ticker + Navbar
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarOffset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ── TRON ARES AMBIENT LASER GLOW EFFECT ── */
  function initTronGlowEffect() {
    const laserCanvas = document.createElement('canvas');
    laserCanvas.id = 'tron-laser-canvas';
    laserCanvas.style.position = 'fixed';
    laserCanvas.style.top = '0';
    laserCanvas.style.left = '0';
    laserCanvas.style.width = '100vw';
    laserCanvas.style.height = '100vh';
    laserCanvas.style.pointerEvents = 'none';
    laserCanvas.style.zIndex = '999';
    laserCanvas.style.opacity = '0.7';
    document.body.appendChild(laserCanvas);

    const ctx = laserCanvas.getContext('2d');
    let width = laserCanvas.width = window.innerWidth;
    let height = laserCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = laserCanvas.width = window.innerWidth;
      height = laserCanvas.height = window.innerHeight;
    });

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const particles = [];
    const maxParticles = 24;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: mouseX,
        y: mouseY,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        life: Math.random() * 60 + 30
      });
    }

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetX - mouseX) * 0.15;
      mouseY += (targetY - mouseY) * 0.15;

      // Draw subtle crimson ambient glow follow
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 250);
      gradient.addColorStop(0, 'rgba(255, 0, 51, 0.18)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 51, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 250, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ── INITIALIZE ALL COMPONENTS ── */
  function init() {
    initPreloader();
    initNavbar();
    updateLiveStatus();
    initMenuSearchAndFilter();
    initReservationModal();
    initScrollReveal();
    initSmoothScroll();
    initTronGlowEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
