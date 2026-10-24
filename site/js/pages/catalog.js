/* Каталог: вкладки-фильтр по типу, состояние в ?type=. */
(() => {
  const TYPES = ['all', 'landing', 'figma', 'bot'];
  const grid = document.getElementById('catalog-grid');
  const tabs = [...document.querySelectorAll('.tabs [data-type]')];
  const cards = CATALOG.map(item => renderCard(item));

  // на тач-экранах наводить нечем — подзаголовок без «наведите»
  const sub = document.querySelector('[data-i18n="cat.sub"]');
  if (sub && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    sub.dataset.i18n = 'cat.subTouch';
    sub.textContent = Ch.t('cat.subTouch');
  }
  cards.forEach(c => grid.append(c));

  tabs.forEach(b => {
    const n = b.dataset.type === 'all' ? CATALOG.length : CATALOG.filter(i => i.type === b.dataset.type).length;
    b.querySelector('.tabs__n').textContent = n;
  });

  function apply(type, push) {
    if (!TYPES.includes(type)) type = 'all';
    cards.forEach(c => { c.hidden = type !== 'all' && c.dataset.type !== type; });
    tabs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.type === type)));
    if (push) {
      const url = new URL(location.href);
      if (type === 'all') url.searchParams.delete('type'); else url.searchParams.set('type', type);
      history.replaceState(null, '', url.pathname.split('/').pop() + url.search);
    }
  }

  tabs.forEach(b => b.addEventListener('click', () => apply(b.dataset.type, true)));
  apply(new URLSearchParams(location.search).get('type') || 'all', false);
})();
