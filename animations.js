/* =====================================================
   MO MOLOK — GSAP Animation System
   Optimized for Performance: Lazy Loading & Deferred Animations
   ===================================================== */

(function () {
  'use strict';

  // Register ScrollTrigger with GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Performance: Reduce motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FAST_DURATION = prefersReducedMotion ? 0 : 0.5;
  const NORMAL_DURATION = prefersReducedMotion ? 0 : 0.8;
  const SLOW_DURATION = prefersReducedMotion ? 0 : 1.2;

  /* ════════════════════════════════════════════════════
     HERO ENTRANCE ANIMATIONS — Optimized Page Load
     ════════════════════════════════════════════════════ */
  function initHeroAnimations() {
    if (prefersReducedMotion) return;
    
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Simplified timeline - fewer elements to animate
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl.fromTo('.hero-status-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' }, 0);
    heroTl.fromTo('.title-line', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08, clearProps: 'all' }, 0.1);
    heroTl.fromTo('.hero-sub', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' }, 0.25);
    heroTl.fromTo('.hero-actions .btn', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06, clearProps: 'all' }, 0.35);

    // Scroll indicator - simpler animation
    gsap.to('.scroll-wheel', {
      duration: 1.2,
      y: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2
    });
  }

  /* ════════════════════════════════════════════════════
     HERO TITLE GLOW — Optimized Continuous Effect
     ════════════════════════════════════════════════════ */
  function initHeroTitleGlow() {
    if (prefersReducedMotion) return;
    
    const titleEm = document.querySelector('.hero-title em');
    if (!titleEm) return;

    gsap.to(titleEm, {
      textShadow: '0 4px 24px rgba(232, 184, 86, 0.6), 0 0 40px rgba(232, 184, 86, 0.3)',
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /* ════════════════════════════════════════════════════
     SCROLL REVEAL ANIMATIONS — Deferred & Optimized
     ════════════════════════════════════════════════════ */
  function initScrollRevealGSAP() {
    if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;

    const revealElements = document.querySelectorAll(
      '.about-text-col, .about-visual-col, .promise-card, .showcase-stage, .menu-card, ' +
      '.dharan-pillar-card, .insta-profile-card, .insta-card, .story-bubble, .review-card, .contact-card'
    );

    revealElements.forEach((el) => {
      // Graceful reveal that immediately clears properties so nothing stays stuck at opacity 0
      gsap.fromTo(el, 
        { opacity: 0.2, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => gsap.set(el, { clearProps: 'transform,opacity' })
          }
        }
      );
    });
  }

  /* ════════════════════════════════════════════════════
     BUTTON INTERACTIONS — Lightweight Micro-interactions
     ════════════════════════════════════════════════════ */
  function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function () {
        gsap.to(this, {
          scale: 1.06,
          duration: FAST_DURATION,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(this, {
          scale: 1,
          duration: FAST_DURATION,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      btn.addEventListener('click', function (e) {
        // Simpler ripple
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(232, 184, 86, 0.5)';
        ripple.style.pointerEvents = 'none';
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        gsap.to(ripple, {
          width: 250,
          height: 250,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════
     MENU CARD HOVER ANIMATIONS — Optimized
     ════════════════════════════════════════════════════ */
  function initMenuCardAnimations() {
    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach(card => {
      const img = card.querySelector('img');

      card.addEventListener('mouseenter', function () {
        gsap.to(this, {
          y: -10,
          duration: FAST_DURATION,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        if (img) {
          gsap.to(img, {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(this, {
          y: 0,
          duration: FAST_DURATION,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        if (img) {
          gsap.to(img, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════
     ORDER PLACEMENT ANIMATION — Simplified
     ════════════════════════════════════════════════════ */
  function initOrderPlacementAnimations() {
    const orderBtns = document.querySelectorAll('[id*="order"], [href*="ubereats"]');

    orderBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        if (this.tagName === 'A' && this.target === '_blank') {
          createOrderNotification();
        }
      });
    });
  }

  function createOrderNotification() {
    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.innerHTML = `
      <div class="order-notification-content">
        <div class="order-icon">🥟</div>
        <div class="order-text">
          <h4>Order Placed!</h4>
          <p>Fresh Dharane momos being prepared...</p>
        </div>
        <div class="order-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    const tl = gsap.timeline();

    tl.from(notification, {
      opacity: 0,
      x: 350,
      duration: FAST_DURATION,
      ease: 'back.out'
    });

    tl.to('.order-progress .progress-bar', {
      width: '100%',
      duration: 2.8,
      ease: 'power1.inOut'
    }, 0);

    tl.to(notification, {
      opacity: 0,
      x: 350,
      duration: FAST_DURATION,
      ease: 'power2.in',
      delay: 3,
      onComplete: () => notification.remove()
    });
  }

  /* ════════════════════════════════════════════════════
     NAVBAR ANIMATIONS — Deferred & Lightweight
     ════════════════════════════════════════════════════ */
  function initNavbarAnimations() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = 0;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        gsap.to(navbar, {
          y: -80,
          duration: FAST_DURATION,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else if (currentScrollY < lastScrollY) {
        gsap.to(navbar, {
          y: 0,
          duration: FAST_DURATION,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ════════════════════════════════════════════════════
     FORM FOCUS ANIMATIONS — Simplified
     ════════════════════════════════════════════════════ */
  function initFormAnimations() {
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      input.addEventListener('focus', function () {
        gsap.to(this, {
          borderColor: '#E8B856',
          duration: FAST_DURATION,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      });

      input.addEventListener('blur', function () {
        gsap.to(this, {
          borderColor: 'rgba(212, 165, 116, 0.2)',
          duration: FAST_DURATION,
          overwrite: 'auto'
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════
     LAZY INITIALIZATION — Defer Non-Critical Animations
     ════════════════════════════════════════════════════ */
  function initAllAnimations() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    function init() {
      // Critical animations
      initHeroAnimations();
      initHeroTitleGlow();
      initButtonAnimations();
      initOrderPlacementAnimations();

      // Defer non-critical animations
      setTimeout(() => {
        initScrollRevealGSAP();
        initMenuCardAnimations();
        initNavbarAnimations();
        initFormAnimations();
      }, 500);
    }
  }

  initAllAnimations();

})();
