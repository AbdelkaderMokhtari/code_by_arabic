/* ===================================
   كود بالعربي — main.js v2.0
   =================================== */

(function () {
  'use strict';

  /* ── Theme Toggle ──────────────────── */
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('theme-toggle');
  const mobileTheme  = document.getElementById('mobile-theme-toggle');

  function getTheme() {
    return localStorage.getItem('theme') || 'light';
  }
  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    const icon = t === 'dark' ? 'fa-sun' : 'fa-moon';
    [themeToggle, mobileTheme].forEach(btn => {
      if (btn) btn.querySelector('i').className = `fa-solid ${icon}`;
    });
  }
  applyTheme(getTheme());
  [themeToggle, mobileTheme].forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  /* ── Mobile Menu ───────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav  = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // إغلاق عند الضغط على رابط
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // إغلاق عند الضغط خارج المنيو
    document.addEventListener('click', e => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Header Scroll Shadow ──────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Reveal on Scroll ──────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Counter Animation ─────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur    = 1200;
        const step   = dur / target || 1;
        let current  = 0;
        const timer  = setInterval(() => {
          current++;
          el.textContent = current + suffix;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          }
        }, step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ── Typewriter ────────────────────── */
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const words = ['JavaScript', 'Python', 'CSS', 'HTML', 'React', 'Node.js'];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      if (deleting) {
        typeEl.textContent = word.slice(0, --ci);
      } else {
        typeEl.textContent = word.slice(0, ++ci);
      }

      let delay = deleting ? 60 : 110;
      if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
      else if (deleting && ci === 0)       { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(type, delay);
    }
    setTimeout(type, 800);
  }

  /* ── Copy Code ─────────────────────── */
  window.copyCode = function (btn) {
    const block = btn.closest('.code-block');
    if (!block) return;
    const code = block.querySelector('pre code');
    if (!code) return;
    navigator.clipboard.writeText(code.innerText).then(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> نسخ';
        btn.classList.remove('copied');
      }, 2000);
    });
  };

  /* ── Newsletter Form ───────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const msg = form.querySelector('.nl-message');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري...';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (msg) { msg.style.color = 'var(--accent-2)'; msg.textContent = '✓ تم الاشتراك بنجاح! سنراسلك قريباً.'; }
          form.reset();
        } else {
          if (msg) { msg.style.color = 'var(--accent-1)'; msg.textContent = '⚠ حدث خطأ، حاول مرة أخرى.'; }
        }
      } catch {
        if (msg) { msg.style.color = 'var(--accent-1)'; msg.textContent = '⚠ تأكد من اتصالك بالإنترنت.'; }
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> اشتراك';
      }
    });
  });

})();