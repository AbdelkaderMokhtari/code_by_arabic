/* ===================================
   مدونة تقنية عربية - JavaScript
   =================================== */

// ══ ضع مفتاح Brevo الجديد هنا (بعد ما تجدده في لوحة Brevo) ══

// ── إدارة الثيم ──────────────────────
const ThemeManager = {
  key: 'blog-theme',

  init() {
    const saved      = localStorage.getItem(this.key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme      = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    const btn  = document.getElementById('theme-toggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ── نشرة Brevo الحقيقية ──────────────────────
const NewsletterForm = {
  init() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      const msg   = form.querySelector('.nl-message');
      const email = input.value.trim();
      if (!email) return;

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جارٍ الاشتراك...';

      try {
        const res = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY
          },
          body: JSON.stringify({
            email,
            listIds: [BREVO_LIST_ID],
            updateEnabled: true
          })
        });

        if (res.ok || res.status === 204) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> تم الاشتراك!';
          btn.style.background = 'linear-gradient(135deg,#00C896,#00A080)';
          input.value = '';
          if (msg) { msg.textContent = 'أهلاً بك! ستصلك المقالات كل أسبوع.'; msg.style.color = 'var(--accent-2)'; }
        } else if (res.status === 400) {
          const data = await res.json();
          if (data.code === 'duplicate_parameter') {
            btn.innerHTML = '<i class="fa-solid fa-circle-info"></i> أنت مشترك بالفعل';
            btn.style.background = 'linear-gradient(135deg,var(--accent-3),#e0a000)';
          } else throw new Error(data.message);
        } else throw new Error('فشل الاشتراك');

      } catch (err) {
        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> خطأ، حاول مجدداً';
        btn.style.background = 'linear-gradient(135deg,var(--accent-1),#c0392b)';
        console.error('Brevo error:', err);
      } finally {
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> اشتراك';
          btn.disabled  = false;
          btn.style.background = '';
        }, 4000);
      }
    });
  }
};

// ── كشف العناصر عند التمرير ──────────────────────
const RevealObserver = {
  init() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }
};

// ── عداد متحرك ──────────────────────
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { this.animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  },
  animate(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const start  = performance.now();
    const update = (time) => {
      const p = Math.min((time - start) / 1500, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
};

// ── تأثير الكتابة التدريجية ──────────────────────
const TypeWriter = {
  init() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const texts = ['JavaScript', 'Python', 'CSS', 'HTML', 'Git', 'APIs'];
    let ti = 0, ci = 0, del = false;
    const type = () => {
      const cur = texts[ti];
      el.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
      del ? ci-- : ci++;
      let speed = del ? 60 : 120;
      if (!del && ci === cur.length) { speed = 2000; del = true; }
      else if (del && ci === 0) { del = false; ti = (ti + 1) % texts.length; speed = 300; }
      setTimeout(type, speed);
    };
    setTimeout(type, 1000);
  }
};

// ── هيدر يختفي عند الإنزال ──────────────────────
const StickyHeader = {
  init() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let lastY = 0;
    header.style.transition = 'transform 0.3s ease, background 0.6s ease';
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.style.transform = (y > lastY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
      lastY = y;
    }, { passive: true });
  }
};

// ── إمالة البطاقات ──────────────────────
const CardTilt = {
  init() {
    document.querySelectorAll('.article-card, .tool-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x*4}deg) rotateX(${y*-4}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }
};

// ── نسخ الكود (متاح عالمياً للمقالات) ──────────────────────
window.copyCode = function(btn) {
  const code = btn.closest('.code-block').querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-check';
    btn.classList.add('copied');
    setTimeout(() => {
      if (icon) icon.className = 'fa-regular fa-copy';
      btn.classList.remove('copied');
    }, 2000);
  });
};

// ── تشغيل كل شيء ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RevealObserver.init();
  CounterAnimation.init();
  NewsletterForm.init();
  TypeWriter.init();
  StickyHeader.init();
  setTimeout(() => CardTilt.init(), 500);
});
