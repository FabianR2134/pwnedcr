  const header  = document.getElementById('site-header')!;
  const toggle  = document.getElementById('nav-toggle')!;
  const navLinks = document.getElementById('nav-links')!;

  // Sticky scroll effect
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  // Mobile hamburger
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('open', open);
  });

  // Mobile dropdowns
  document.querySelectorAll<HTMLButtonElement>('.nav-dropdown-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      const dd = btn.closest('.nav-dropdown')!;
      const open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target as Node)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
