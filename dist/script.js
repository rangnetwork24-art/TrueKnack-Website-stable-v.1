document.addEventListener('DOMContentLoaded', () => {

  // === HEADER SCROLL EFFECT ===
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // === MOBILE NAVIGATION ===
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');
      if (isActive) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      }
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = 'none';
        s.style.opacity = '1';
      });
    });
  });

  // === DROPDOWN NAV (mobile click / accordion) ===
  document.querySelectorAll('.nav-menu .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        toggle.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });

  // === ACTIVE NAV LINK ON SCROLL ===
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(section => navObserver.observe(section));

  // === SCROLL REVEAL ANIMATIONS (IPB-style) ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // === STATS COUNTER ANIMATION ===
  const stats = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('#stats');
  let countStarted = false;

  const startCount = () => {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const suffix = stat.getAttribute('data-suffix') || '';
      const decimals = +stat.getAttribute('data-decimals') || 0;
      let count = 0;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      const stepTime = duration / steps;
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          stat.innerText = count.toFixed(decimals) + suffix;
          setTimeout(updateCount, stepTime);
        } else {
          stat.innerText = target.toFixed(decimals) + suffix;
        }
      };
      updateCount();
    });
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countStarted) {
          startCount();
          countStarted = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }
  // === SMOOTH SCROLL FOR ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // === SKELETON IMAGE LOADING ===
  document.querySelectorAll('img.lazy-img').forEach(img => {
    const reveal = () => {
      img.classList.add('loaded');
      const wrap = img.closest('.has-skeleton');
      if (wrap) wrap.classList.add('loaded');
    };
    if (img.complete && img.naturalWidth > 0) reveal();
    else { img.addEventListener('load', reveal); img.addEventListener('error', reveal); }
  });

  // === VIDEO LIGHTBOX MODAL ===
  const videoCards = document.querySelectorAll('.testimonial-video-card');
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const closeModal = document.querySelector('.close-modal');
  const modalBackdrop = document.querySelector('.video-modal-backdrop');

  if (videoCards.length > 0 && videoModal && modalIframe) {
    videoCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.getAttribute('data-video-id');
        if (videoId) {
          modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
          videoModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
      });
    });

    const hideModal = () => {
      videoModal.classList.remove('active');
      modalIframe.src = '';
      document.body.style.overflow = ''; // Restore background scrolling
    };

    if (closeModal) closeModal.addEventListener('click', hideModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', hideModal);

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        hideModal();
      }
    });
  }

});
