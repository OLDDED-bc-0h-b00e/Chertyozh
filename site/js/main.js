/* Общее для всех страниц: язык, режим превью, формат цен, шапка и подвал. */
(() => {
  const root = document.documentElement;
  const LANGS = ['ru', 'en'];
  const MODES = ['auto', 'blueprint', 'final'];
  const MOONLIGHT = 'https://oldded-bc-0h-b00e.github.io/SIte-Portfolio/';
  const langSubs = [];

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* без сохранения */ } },
  };

  let lang = LANGS.includes(store.get('ch.lang')) ? store.get('ch.lang') : 'ru';
  let mode = MODES.includes(store.get('ch.mode')) ? store.get('ch.mode') : 'auto';
  root.dataset.mode = mode;
  root.lang = lang;

  const t = key => (window.I18N && I18N[lang] && I18N[lang][key]) || (window.I18N && I18N.ru[key]) || key;

  // 4 900 ₽ (неразрывные пробелы) / $69
  const groups = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const money = (rub, usd) => (lang === 'en' ? '$' + Math.round(usd).toLocaleString('en-US') : groups(rub) + ' ₽');

  function applyLang() {
    root.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    const titleKey = document.body.dataset.title;
    if (titleKey) document.title = t(titleKey);
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t('meta.desc');
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    langSubs.forEach(fn => fn(lang));
  }

  function applyMode() {
    root.dataset.mode = mode;
    document.querySelectorAll('[data-mode-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modeSet === mode)));
  }

  window.Ch = {
    lang: () => lang,
    setLang(l) { if (!LANGS.includes(l)) return; lang = l; store.set('ch.lang', l); applyLang(); },
    t,
    onLang(fn) { langSubs.push(fn); },
    mode: () => mode,
    setMode(m) { if (!MODES.includes(m)) return; mode = m; store.set('ch.mode', m); applyMode(); window.dispatchEvent(new CustomEvent('mode:change', { detail: { mode: m } })); },
    price: item => money(item.price.rub, item.price.usd),
    sum: items => money(items.reduce((s, i) => s + i.price.rub, 0), items.reduce((s, i) => s + i.price.usd, 0)),
    esc: s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  };

  // ---------- шапка и подвал ----------
  const cartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 4h2.5l2.2 11h10.6L20.5 7H7"/><circle cx="9.5" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/></svg>';
  const seg = (cls, label, items) => `<div class="seg ${cls}" role="group" data-i18n-attr="aria-label:${label}">${items}</div>`;
  const modeSeg = () => seg('seg--mode', 'mode.label', MODES.map(m => `<button type="button" data-mode-set="${m}" data-i18n="mode.${m}"></button>`).join(''));
  const langSeg = () => seg('seg--lang', 'lang.label', LANGS.map(l => `<button type="button" data-lang="${l}">${l.toUpperCase()}</button>`).join(''));
  const navLinks = current => [
    ['catalog', 'catalog.html', 'nav.catalog'],
    ['how', 'index.html#how', 'nav.how'],
    ['custom', 'index.html#custom', 'nav.custom'],
  ].map(([id, href, key]) => `<a href="${href}" data-i18n="${key}"${current === id ? ' aria-current="page"' : ''}></a>`).join('');

  function renderHeader(el) {
    const current = document.body.dataset.nav || '';
    el.innerHTML = `
      <div class="wrap hdr__in">
        <a class="hdr__logo" href="index.html" aria-label="Chertyozh">
          <picture><source srcset="assets/logo-light.svg" media="(prefers-color-scheme: dark)"><img src="assets/logo.svg" alt="" width="26" height="26"></picture>
          <span>Chertyozh</span>
        </a>
        <nav class="hdr__nav" data-i18n-attr="aria-label:nav.label">${navLinks(current)}</nav>
        <div class="hdr__tools">
          ${modeSeg()}
          ${langSeg()}
          <a class="cart-link" href="cart.html">${cartIcon}<span class="cart-link__text" data-i18n="cart.link"></span><span class="cart-link__count" hidden>0</span></a>
          <button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-menu" data-i18n="nav.menu"></button>
        </div>
      </div>
      <div class="hdr__menu" id="hdr-menu">
        <nav class="hdr__menu-nav" data-i18n-attr="aria-label:nav.label">${navLinks(current)}</nav>
        <div class="hdr__menu-row">${modeSeg()}${langSeg()}</div>
      </div>`;

    const burger = el.querySelector('.hdr__burger');
    const menu = el.querySelector('.hdr__menu');
    const setOpen = open => {
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.textContent = t(open ? 'nav.close' : 'nav.menu');
      burger.dataset.i18n = open ? 'nav.close' : 'nav.menu';
    };
    burger.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  function renderFooter(el) {
    const sheet = document.body.dataset.sheet || '01';
    el.innerHTML = `
      <div class="wrap">
        <div class="stamp">
          <div class="stamp__brand">Chertyozh</div>
          <div class="stamp__cell"><span class="label" data-i18n="ft.sheet"></span><b>${Ch.esc(sheet)}</b></div>
          <div class="stamp__cell"><span class="label" data-i18n="ft.scale"></span><b>1:1</b></div>
          <div class="stamp__cell"><span class="label" data-i18n="ft.made"></span><b><a href="${MOONLIGHT}" target="_blank" rel="noopener">MOONLIGHT ↗</a></b></div>
          <div class="stamp__cell"><span class="label" data-i18n="ft.date"></span><b data-i18n="ft.rights"></b></div>
        </div>
      </div>`;
  }

  function updateCartCount() {
    if (!window.Cart) return;
    const n = Cart.count();
    document.querySelectorAll('.cart-link__count').forEach(c => { c.textContent = n; c.hidden = n === 0; });
    document.querySelectorAll('.cart-link').forEach(a => a.setAttribute('aria-label', `${t('cart.aria')} ${n}`));
  }

  document.querySelectorAll('[data-chrome="header"]').forEach(renderHeader);
  document.querySelectorAll('[data-chrome="footer"]').forEach(renderFooter);

  document.addEventListener('click', e => {
    const l = e.target.closest('[data-lang]');
    if (l) Ch.setLang(l.dataset.lang);
    const m = e.target.closest('[data-mode-set]');
    if (m) Ch.setMode(m.dataset.modeSet);
  });
  window.addEventListener('cart:change', updateCartCount);
  Ch.onLang(updateCartCount);

  applyLang();
  applyMode();
  updateCartCount();
})();
