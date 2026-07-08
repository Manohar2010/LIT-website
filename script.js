/* ============================================================
   CIE — Centre for Innovation & Entrepreneurship
   MLR Institute of Technology
   script.js — All interactions and animations
   ============================================================
   TABLE OF CONTENTS
   1.  Lucide Icons Init
   2.  Navigation (scroll blur, mobile toggle, active link)
   3.  Scroll Progress Bar
   4.  Reveal on Scroll (IntersectionObserver)
   5.  Animated Counters
   6.  Button Ripple
   7.  Domain Cards (modal)
   8.  Gallery + Lightbox
   9.  Testimonials Carousel
   10. FAQ Accordion (native details enhancement)
   11. Contact Form
   12. Back to Top
   13. Footer Year
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ============ 1. LUCIDE ICONS ============ */
  if (window.lucide) lucide.createIcons();

  /* ============ 2. NAVIGATION ============ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  // Blur on scroll
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    // Progress bar
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scrollProgress').style.width = (window.scrollY / h * 100) + '%';
    // Back to top
    document.getElementById('backTop').classList.toggle('show', window.scrollY > 500);
    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  // Close menu on link click
  links.forEach(l => l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }));

  /* ============ 4. REVEAL ON SCROLL ============ */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ============ 5. ANIMATED COUNTERS ============ */
  const counters = document.querySelectorAll('.stat__num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 2000;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ============ 6. BUTTON RIPPLE ============ */
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ============ 7. DOMAIN CARDS ============ */
  const domainData = {
    'Technical': { desc: 'Build with modern technologies — web, mobile, AI/ML, cloud, and IoT. Turn ideas into working products.', skills: ['Web & App Dev', 'AI / ML', 'Cloud & DevOps', 'IoT', 'Blockchain'] },
    'Design': { desc: 'Craft beautiful, intuitive experiences. From wireframes to polished interfaces and brand identity.', skills: ['UI / UX', 'Figma', 'Branding', 'Motion Design', 'Prototyping'] },
    'Marketing': { desc: 'Drive growth and tell our story. Manage campaigns, social media, and community engagement.', skills: ['Growth Strategy', 'Social Media', 'SEO', 'Analytics', 'Campaigns'] },
    'Content': { desc: 'Words that move people. Write copy, stories, newsletters, and documentation that connects.', skills: ['Copywriting', 'Blogging', 'Storytelling', 'Newsletters', 'Documentation'] },
    'Photography': { desc: 'Capture moments that matter. Event coverage, product shoots, and visual storytelling.', skills: ['Event Coverage', 'Product Photography', 'Portrait', 'Editing', 'Composition'] },
    'Videography': { desc: 'Bring stories to life through motion. Reels, aftermovies, and cinematic content.', skills: ['Cinematography', 'Video Editing', 'Reels', 'Documentaries', 'Motion Graphics'] },
    'Operations': { desc: 'The engine behind everything. Logistics, planning, and processes that keep CIE running.', skills: ['Planning', 'Logistics', 'Process Design', 'Tools', 'Resource Management'] },
    'Events': { desc: 'Create unforgettable experiences. Organize hackathons, meetups, and flagship events.', skills: ['Hackathons', 'Meetups', 'Summits', 'Webinars', 'Event Marketing'] },
    'Startup Research': { desc: 'Validate ideas and explore markets. Research, analyze, and de-risk ventures before launch.', skills: ['Market Research', 'Competitor Analysis', 'Validation', 'Strategy', 'Business Models'] }
  };

  const domainDetail = document.getElementById('domainDetail');
  const domainTitle = document.getElementById('domainTitle');
  const domainDesc = document.getElementById('domainDesc');
  const domainSkills = document.getElementById('domainSkills');
  const domainClose = document.getElementById('domainClose');

  document.querySelectorAll('.domain').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.domain;
      const data = domainData[key];
      if (!data) return;
      domainTitle.textContent = key;
      domainDesc.textContent = data.desc;
      domainSkills.innerHTML = data.skills.map(s => `<li>${s}</li>`).join('');
      domainDetail.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  const closeDomain = () => {
    domainDetail.hidden = true;
    document.body.style.overflow = '';
  };
  domainClose.addEventListener('click', closeDomain);
  domainDetail.addEventListener('click', (e) => { if (e.target === domainDetail) closeDomain(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !domainDetail.hidden) closeDomain();
  });

  /* ============ 8. GALLERY + LIGHTBOX ============ */
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIdx = 0;
  const sources = Array.from(galleryItems).map(i => i.dataset.src);

  const openLightbox = (idx) => {
    currentIdx = idx;
    lightboxImg.src = sources[currentIdx];
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };
  const navLightbox = (dir) => {
    currentIdx = (currentIdx + dir + sources.length) % sources.length;
    lightboxImg.src = sources[currentIdx];
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navLightbox(-1));
  lightboxNext.addEventListener('click', () => navLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  /* ============ 9. TESTIMONIALS CAROUSEL ============ */
  const track = document.getElementById('carouselTrack');
  const slides = track.children;
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let current = 0;
  let autoTimer;

  // Build dots
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.children;

  const goTo = (idx) => {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === current));
    resetAuto();
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  };

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  resetAuto();
  goTo(0);

  // Pause on hover
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', resetAuto);

  // Touch swipe
  let touchStart = 0;
  carousel.addEventListener('touchstart', (e) => { touchStart = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  /* ============ 11. CONTACT FORM ============ */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form__status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form__status error';
      return;
    }

    status.textContent = 'Sending...';
    status.className = 'form__status';

    // Simulate send (no backend in this static build)
    setTimeout(() => {
      status.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
      status.className = 'form__status success';
      form.reset();
    }, 800);
  });

  /* ============ 12. BACK TO TOP ============ */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ 13. FOOTER YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Re-init icons after any dynamic content */
  setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 100);
});
