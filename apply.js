/* ============================================================
   CIE — Application Form Page
   apply.js — Form validation and submission handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Re-init icons for this page
  if (window.lucide) lucide.createIcons();

  // Mobile nav toggle (reuse from main script)
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  // Reveal observer
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Ripple
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

  /* ============ FORM HANDLING ============ */
  const form = document.getElementById('applyForm');
  const status = document.getElementById('formStatus');

  // Add success message element
  const successEl = document.createElement('div');
  successEl.className = 'apply__success';
  successEl.innerHTML = `
    <div class="apply__success-icon"><i data-lucide="check"></i></div>
    <h2>Application Submitted!</h2>
    <p>Thank you for applying to CIE. We've received your application and will reach out via email within a week for the next steps.</p>
    <a href="index.html" class="btn btn--ghost" data-ripple><i data-lucide="arrow-left"></i> Back to Home</a>
  `;
  form.appendChild(successEl);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[+]?[\d\s\-()]{10,15}$/.test(phone);

  const showError = (msg) => {
    status.textContent = msg;
    status.className = 'form__status error';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const fullName = data.get('fullName')?.trim();
    const email = data.get('email')?.trim();
    const phone = data.get('phone')?.trim();
    const rollNumber = data.get('rollNumber')?.trim();
    const year = data.get('year');
    const branch = data.get('branch');
    const domain1 = data.get('domain1');
    const skills = data.get('skills')?.trim();
    const experience = data.get('experience')?.trim();
    const why = data.get('why')?.trim();
    const availability = data.get('availability');

    // Validate required fields
    if (!fullName || !email || !phone || !rollNumber || !year || !branch) {
      showError('Please fill in all required personal information fields.');
      return;
    }
    if (!validateEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(phone)) {
      showError('Please enter a valid phone number.');
      return;
    }
    if (!domain1) {
      showError('Please select your first domain preference.');
      return;
    }
    if (!skills || !experience || !why) {
      showError('Please complete all required fields in the journey section.');
      return;
    }
    if (!availability) {
      showError('Please select your weekly availability.');
      return;
    }

    // Check domain1 and domain2 are not the same
    const domain2 = data.get('domain2');
    if (domain2 && domain2 === domain1) {
      showError('First and second domain preferences cannot be the same.');
      return;
    }

    // Simulate submission
    status.textContent = 'Submitting...';
    status.className = 'form__status';

    setTimeout(() => {
      form.classList.add('submitted');
      status.textContent = '';
      status.className = 'form__status';
      if (window.lucide) lucide.createIcons();
      // Scroll to top of form
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
  });

  // Clear error on input
  form.addEventListener('input', () => {
    if (status.className.includes('error')) {
      status.textContent = '';
      status.className = 'form__status';
    }
  });
});
