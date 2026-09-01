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

  /* ════════════════════════════════════════════════════
     CIAO ENERGY-INSPIRED SIGNATURE GASTRONOMY STAGE
     ════════════════════════════════════════════════════ */
  function initSignatureShowcase() {
    const stage = document.getElementById('showcase-stage');
    if (!stage) return;

    const signatureDishes = [
      {
        cat: "SIGNATURE GASTRONOMY · 01/06",
        title1: "Chicken Steamed",
        title2: "Momo Platter",
        origin: "📍 Dharan Hill Recipe",
        spice: "Spice: 🌶️ Mild Warmth",
        desc: "Handcrafted daily with tender minced chicken, fresh mountain herbs, and a delicate touch of roasted Himalayan timur pepper. Served steaming hot with house sesame-chili achar.",
        price: "$16.50",
        img: "steamed_momo_gourmet.png",
        primary: "#E5A93C",
        secondary: "#FF2E2E",
        glow: "rgba(229, 169, 60, 0.45)"
      },
      {
        cat: "SIGNATURE SOUP BROTH · 02/06",
        title1: "Signature Chicken",
        title2: "Jhol Momo",
        origin: "📍 Bhanu Chowk Icon",
        spice: "Spice: 🌶️🌶️ Medium Spicy",
        desc: "Dharan's most coveted comfort dish. Hand-pleated juicy dumplings submerged in a warm, fragrant slow-simmered roasted sesame, tomato, and Timur chili broth.",
        price: "$18.99",
        img: "steamed_momo_gourmet.png",
        primary: "#FF3838",
        secondary: "#9E0E18",
        glow: "rgba(255, 56, 56, 0.5)"
      },
      {
        cat: "PLANT-BASED CRAFT · 03/06",
        title1: "Steamed Vegan",
        title2: "Mushroom Momo",
        origin: "📍 100% Himalayan Vegan",
        spice: "Spice: 🌿 Fresh & Mild",
        desc: "Delicately pleated translucent wrappers filled with finely minced wild mushrooms, mountain cabbage, ginger root, and Himalayan herbs.",
        price: "$15.50",
        img: "momo_dish.jpg",
        primary: "#38B07D",
        secondary: "#0E3D28",
        glow: "rgba(56, 176, 125, 0.45)"
      },
      {
        cat: "DHARAN STREET ICON · 04/06",
        title1: "Iconic Dharane",
        title2: "Egg Roll Wrap",
        origin: "📍 Dharan Night Market",
        spice: "Spice: 🌶️ Zesty Street Spice",
        desc: "Flaky golden paratha flatbread layered with fluffy farm egg, stuffed with wok-tossed chowmein noodles, crunchy red onions, and spiced tomato reduction.",
        price: "$12.99",
        img: "dharane_special_thali.png",
        primary: "#E89638",
        secondary: "#944208",
        glow: "rgba(232, 150, 56, 0.45)"
      },
      {
        cat: "WARMING NOODLE BROTH · 05/06",
        title1: "Himalayan Chicken",
        title2: "Thukpa Noodle Soup",
        origin: "📍 Eastern Hill Comfort",
        spice: "Spice: 🌶️ Warm Aromatic",
        desc: "Hearty mountain wheat noodles in rich aromatic chicken stock, garnished with slow-braised chicken shreds, crisp greens, coriander, and spiced chili oil.",
        price: "$15.99",
        img: "thukpa_gourmet.png",
        primary: "#DE5E34",
        secondary: "#5E1D0C",
        glow: "rgba(222, 94, 52, 0.45)"
      },
      {
        cat: "ARTISANAL REFRESHER · 06/06",
        title1: "Artisanal Alphonso",
        title2: "Mango Lassi",
        origin: "📍 House Spice Cooler",
        spice: "Flavor: 🥭 Sweet & Velvety",
        desc: "Rich, creamy cultured yogurt blended with sun-ripened Alphonso mango pulp, a whisper of Himalayan cardamom, and pistachio dust. The perfect spice balancer.",
        price: "$9.99",
        img: "panipuri_dish.jpg",
        primary: "#FFA834",
        secondary: "#7A3600",
        glow: "rgba(255, 168, 52, 0.45)"
      }
    ];

    let currentIndex = 0;
    const totalDishes = signatureDishes.length;

    // DOM Elements
    const catLabel = document.getElementById('showcase-cat-label');
    const titleLine1 = document.getElementById('showcase-title-line1');
    const titleLine2 = document.getElementById('showcase-title-line2');
    const imgActive = document.getElementById('img-plate-active');
    const imgPrev = document.getElementById('img-plate-prev');
    const imgNext = document.getElementById('img-plate-next');
    const tagPrev = document.getElementById('tag-plate-prev');
    const tagNext = document.getElementById('tag-plate-next');
    const plateActiveEl = document.getElementById('plate-active');
    const originEl = document.getElementById('showcase-origin');
    const spiceEl = document.getElementById('showcase-spice');
    const descEl = document.getElementById('showcase-desc');
    const priceEl = document.getElementById('showcase-price');
    const liquidDot = document.getElementById('liquid-dot');
    const prevBtn = document.getElementById('showcase-prev-btn');
    const nextBtn = document.getElementById('showcase-next-btn');
    const platePrevBtn = document.getElementById('plate-prev');
    const plateNextBtn = document.getElementById('plate-next');
    const checkpointBtns = document.querySelectorAll('.checkpoint-btn');

    function renderLetters(text, isEm = false) {
      const chars = text.split('').map(char => {
        if (char === ' ') return '&nbsp;';
        return `<span>${char}</span>`;
      }).join('');
      return isEm ? `<em>${chars}</em>` : chars;
    }

    function updateShowcase(index, direction = 1) {
      currentIndex = (index + totalDishes) % totalDishes;
      const prevIndex = (currentIndex - 1 + totalDishes) % totalDishes;
      const nextIndex = (currentIndex + 1) % totalDishes;

      const current = signatureDishes[currentIndex];
      const prevDish = signatureDishes[prevIndex];
      const nextDish = signatureDishes[nextIndex];

      // 1. Dynamic Color Scheme
      document.documentElement.style.setProperty('--dish-primary', current.primary);
      document.documentElement.style.setProperty('--dish-secondary', current.secondary);
      document.documentElement.style.setProperty('--dish-glow', current.glow);

      // 2. Update Header & Subtitles
      if (catLabel) catLabel.textContent = current.cat;
      if (originEl) originEl.textContent = current.origin;
      if (spiceEl) spiceEl.textContent = current.spice;
      if (descEl) descEl.textContent = current.desc;
      if (priceEl) priceEl.textContent = current.price;

      // 3. Kinetic Split-Letter Titles
      if (titleLine1 && titleLine2) {
        titleLine1.innerHTML = renderLetters(current.title1, false);
        titleLine2.innerHTML = renderLetters(current.title2, true);

        if (window.gsap) {
          gsap.fromTo('#showcase-title-line1 span', 
            { y: '110%', opacity: 0 }, 
            { y: '0%', opacity: 1, duration: 0.6, stagger: 0.025, ease: 'power3.out' }
          );
          gsap.fromTo('#showcase-title-line2 span', 
            { y: '110%', opacity: 0 }, 
            { y: '0%', opacity: 1, duration: 0.65, stagger: 0.03, delay: 0.1, ease: 'power3.out' }
          );
        }
      }

      // 4. Update Images & Preview Plates
      if (imgActive) {
        if (window.gsap) {
          gsap.fromTo(plateActiveEl, 
            { scale: 0.8, rotateY: direction * 15, opacity: 0.4 }, 
            { scale: 1, rotateY: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.3)' }
          );
        }
        imgActive.src = current.img;
        imgActive.alt = current.title1 + ' ' + current.title2;
      }

      if (imgPrev) imgPrev.src = prevDish.img;
      if (tagPrev) tagPrev.textContent = prevDish.title1;
      if (imgNext) imgNext.src = nextDish.img;
      if (tagNext) tagNext.textContent = nextDish.title1;

      // 5. Update Liquid Metaball Progress Dot
      if (liquidDot) {
        const startX = 83;
        const endX = 917;
        const targetX = startX + (currentIndex * (endX - startX) / (totalDishes - 1));
        liquidDot.setAttribute('cx', String(targetX));
      }

      // 6. Update Checkpoint Buttons
      checkpointBtns.forEach((btn, i) => {
        if (i === currentIndex) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      });
    }

    // Event Listeners
    if (prevBtn) prevBtn.addEventListener('click', () => updateShowcase(currentIndex - 1, -1));
    if (nextBtn) nextBtn.addEventListener('click', () => updateShowcase(currentIndex + 1, 1));
    if (platePrevBtn) platePrevBtn.addEventListener('click', () => updateShowcase(currentIndex - 1, -1));
    if (plateNextBtn) plateNextBtn.addEventListener('click', () => updateShowcase(currentIndex + 1, 1));

    checkpointBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
        updateShowcase(idx, idx > currentIndex ? 1 : -1);
      });
    });

    // Touch & Swipe Gestures
    let startTouchX = 0;
    let endTouchX = 0;
    const viewportEl = document.getElementById('showcase-viewport');

    if (viewportEl) {
      viewportEl.addEventListener('touchstart', (e) => {
        startTouchX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewportEl.addEventListener('touchend', (e) => {
        endTouchX = e.changedTouches[0].screenX;
        const diff = startTouchX - endTouchX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            updateShowcase(currentIndex + 1, 1); // Swipe left -> next
          } else {
            updateShowcase(currentIndex - 1, -1); // Swipe right -> prev
          }
        }
      }, { passive: true });
    }

    // Keyboard Arrow Navigation when viewport is hovered or focused
    window.addEventListener('keydown', (e) => {
      const rect = stage.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      if (e.key === 'ArrowLeft') {
        updateShowcase(currentIndex - 1, -1);
      } else if (e.key === 'ArrowRight') {
        updateShowcase(currentIndex + 1, 1);
      }
    });

    // Initialize initial view
    updateShowcase(0, 1);
  }

  /* ── INITIALIZE ALL COMPONENTS ── */
  function init() {
    initPreloader();
    initNavbar();
    updateLiveStatus();
    initSignatureShowcase();
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
