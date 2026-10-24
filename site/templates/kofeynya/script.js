/* Демо «Кофейня»: полоска демо, вкладки меню, бургер. */
(() => {
  DemoBar.init({ id: 'kofeynya', sheet: 'Л-02', price: { rub: 4900, usd: 69 } });

  // вкладки меню (клавиши ← → тоже работают)
  const tabs = [...document.querySelectorAll('.k-tabs [role="tab"]')];
  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      select(next); next.focus();
    });
  });

  // бургер на мобильном
  const burger = document.querySelector('.k-burger');
  const nav = document.getElementById('k-nav');
  const setOpen = open => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.dataset.i18nAttr = 'aria-label:' + (open ? 'k.navClose' : 'k.navOpen');
    burger.setAttribute('aria-label', DemoBar.t(open ? 'k.navClose' : 'k.navOpen'));
  };
  burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); burger.focus(); }
  });
})();
