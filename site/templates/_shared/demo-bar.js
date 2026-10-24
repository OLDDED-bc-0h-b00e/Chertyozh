/* Полоска поверх демо: «Демо шаблона Chertyozh · ← К шаблону · RU/EN · Купить».
   Язык и корзина — те же ключи localStorage, что у основного сайта (ch.lang, ch.cart).
   Переводит страницу демо по data-i18n / data-i18n-attr из window.I18N_DEMO + I18N_BAR. */
(() => {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* без сохранения */ } },
  };
  const subs = [];
  let lang = store.get('ch.lang') === 'en' ? 'en' : 'ru';

  const dict = () => Object.assign({}, (window.I18N_BAR || {})[lang], (window.I18N_DEMO || {})[lang]);
  const t = key => dict()[key] || key;

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    if (document.body.dataset.title) document.title = t(document.body.dataset.title);
    document.querySelectorAll('.demo-bar [data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    subs.forEach(fn => fn(lang));
  }

  function addToCart(id) {
    let ids = [];
    try { const v = JSON.parse(store.get('ch.cart') || '[]'); if (Array.isArray(v)) ids = v.filter(x => typeof x === 'string'); } catch (e) { ids = []; }
    if (!ids.includes(id)) ids.push(id);
    store.set('ch.cart', JSON.stringify(ids));
  }

  window.DemoBar = {
    t,
    lang: () => lang,
    onLang(fn) { subs.push(fn); },
    init({ id, sheet, price }) {
      const bar = document.createElement('div');
      bar.className = 'demo-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('data-i18n-attr', 'aria-label:bar.label');
      const money = () => (lang === 'en' ? '$' + price.usd : String(price.rub).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽');
      bar.innerHTML = `
        <a class="demo-bar__brand" href="../../index.html">Chertyozh</a>
        <span class="demo-bar__label"><span data-i18n="bar.label"></span> · ${sheet}</span>
        <a class="demo-bar__back" href="../../template.html?id=${encodeURIComponent(id)}">← <span data-i18n="bar.back"></span></a>
        <span class="demo-bar__lang" role="group" data-i18n-attr="aria-label:bar.lang">
          <button type="button" data-lang="ru">RU</button><button type="button" data-lang="en">EN</button>
        </span>
        <button class="demo-bar__buy" type="button"><span data-i18n="bar.buy"></span><span class="demo-bar__price"></span></button>`;
      document.body.prepend(bar);
      document.body.classList.add('has-demo-bar');

      bar.addEventListener('click', e => {
        const l = e.target.closest('[data-lang]');
        if (l) { lang = l.dataset.lang; store.set('ch.lang', lang); apply(); }
        if (e.target.closest('.demo-bar__buy')) { addToCart(id); location.href = '../../cart.html'; }
      });
      subs.push(() => { bar.querySelector('.demo-bar__price').textContent = ' · ' + money(); });
      apply();
    },
  };
})();
