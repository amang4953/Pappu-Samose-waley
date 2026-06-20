/* ============================================
   PAPPU SAMOSE WALEY — Script
   Animations, Interactions & Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL BEHAVIOR ──
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  // ── HERO LOAD ANIMATION ──
  window.addEventListener('load', () => {
    hero.classList.add('loaded');
  });


  // ── MOBILE NAV TOGGLE ──
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });


  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── SCROLL REVEAL ANIMATIONS ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll(':scope > .reveal, :scope > .reveal-left, :scope > .reveal-right'));
          const index = siblings.indexOf(entry.target);
          if (index > 0) {
            entry.target.style.transitionDelay = `${index * 150}ms`;
          }
        }
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── ANIMATED COUNTERS ──
  const counters = document.querySelectorAll('.counter');
  let counterAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOutQuart(progress) * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterAnimated) {
        counterAnimated = true;
        counters.forEach(counter => animateCounter(counter));
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));


  // ── FULL MENU CATEGORY FILTER ──
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuCategories = document.querySelectorAll('.menu-category');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCategories.forEach((cat, index) => {
        const catType = cat.getAttribute('data-cat');

        if (filter === 'all' || catType === filter) {
          cat.classList.remove('hidden-cat');
          // Animate in
          cat.style.opacity = '0';
          cat.style.transform = 'translateY(20px)';
          setTimeout(() => {
            cat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
          }, index * 100);
        } else {
          cat.classList.add('hidden-cat');
        }
      });
    });
  });


  // ── GALLERY LIGHTBOX ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImage.src = ''; }, 300);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });


  // ── PARALLAX SUBTLE EFFECT ON HERO ──
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrollY < heroHeight) {
          const heroContent = hero.querySelector('.hero-content');
          if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
            heroContent.style.opacity = 1 - (scrollY / heroHeight) * 0.8;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  // ── ACTIVE NAV LINK HIGHLIGHTING ──
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = navLinks.querySelectorAll('a:not(.nav-cta)');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkItems.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--color-terracotta)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink, { passive: true });


  // ── CURSOR TRAIL EFFECT (desktop only) ──
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1.5px solid rgba(196, 112, 75, 0.25);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease-out, opacity 0.3s ease;
      opacity: 0;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(trail);

    document.addEventListener('mousemove', (e) => {
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      trail.style.opacity = '0';
    });

    document.querySelectorAll('a, button, .menu-card, .gallery-item, .art-card, .testimonial-card, .stat-item, .menu-list-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        trail.style.transform = 'translate(-50%, -50%) scale(1.8)';
        trail.style.borderColor = 'rgba(196, 112, 75, 0.5)';
      });
      el.addEventListener('mouseleave', () => {
        trail.style.transform = 'translate(-50%, -50%) scale(1)';
        trail.style.borderColor = 'rgba(196, 112, 75, 0.25)';
      });
    });
  }

});
