(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('navigation');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
  function syncThemeControl() {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (!themeToggle) return;
    const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
    themeToggle.setAttribute('aria-pressed', String(dark));
    const text = themeToggle.querySelector('span');
    if (text) text.textContent = dark ? 'Light' : 'Dark';
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#171d19' : '#f3f0e8');
  }
  syncThemeControl();
  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
    syncThemeControl();
  });

  function closeMenu(restoreFocus = false) {
    document.body.classList.remove('menu-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (open) navigation.querySelector('a').focus();
  });
  navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('menu-open')) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const first = navigation.querySelector('a');
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); menu.focus(); }
      else if (!event.shiftKey && document.activeElement === menu) { event.preventDefault(); first.focus(); }
    }
  });
  matchMedia('(min-width: 541px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches) entry.target.classList.add('is-entering');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }

  const search = document.getElementById('project-search');
  if (search) {
    const projects = [...document.querySelectorAll('.project-row')];
    const filters = [...document.querySelectorAll('.filter')];
    let category = 'all';
    function updateProjects() {
      const query = search.value.trim().toLowerCase();
      let count = 0;
      projects.forEach(project => {
        const matchesCategory = category === 'all' || project.dataset.category.split(' ').includes(category);
        const matchesSearch = project.textContent.toLowerCase().includes(query);
        project.hidden = !(matchesCategory && matchesSearch);
        if (!project.hidden) count++;
      });
      document.getElementById('project-count').textContent = `${count} of ${projects.length} projects and lab collections`;
      document.getElementById('empty-state').hidden = count !== 0;
    }
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      filters.forEach(filter => { filter.classList.toggle('active', filter === button); filter.setAttribute('aria-pressed', String(filter === button)); });
      updateProjects();
    }));
    search.addEventListener('input', updateProjects);
    document.getElementById('reset-filters').addEventListener('click', () => { search.value = ''; filters[0].click(); search.focus(); });
    updateProjects();
  }

  const copyButton = document.getElementById('copy-email');
  copyButton?.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText('alirayyancyber@gmail.com');
      copyButton.textContent = 'Email address copied';
      status.textContent = 'Email address copied to clipboard.';
    } catch {
      copyButton.textContent = 'Select the email address to copy';
      status.textContent = 'Automatic copying is unavailable. Select the email address and copy it.';
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
