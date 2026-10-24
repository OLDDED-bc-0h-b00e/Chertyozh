/* Страница шаблона по ?id=. Неизвестный id → «Лист не найден». */
(() => {
  const id = new URLSearchParams(location.search).get('id');
  const item = id ? CATALOG.byId(id) : undefined;
  const $ = s => document.querySelector(s);

  if (!item) {
    $('#tpl-404').hidden = false;
    const setTitle = () => { document.title = Ch.t('tpl.notFound') + ' — Chertyozh'; };
    setTitle();
    Ch.onLang(setTitle);
    return;
  }

  $('#tpl').hidden = false;
  $('#tpl-cta').hidden = false;
  document.body.dataset.sheet = item.sheet;
  Reveal.mount($('#tpl-pv'), item, { big: true, autoplay: true });

  const demo = $('.tpl__demo');
  if (item.ready) { demo.href = item.demo; $('.tpl__soon').remove(); } else demo.remove();

  const add = $('.tpl__add');
  add.addEventListener('click', () => { if (Cart.has(item.id)) location.href = 'cart.html'; else Cart.add(item.id); });

  function render() {
    const lang = Ch.lang();
    const title = item.title[lang];
    document.title = title + ' — Chertyozh';
    $('.tpl__crumb').textContent = title;
    $('.tpl__type').textContent = Ch.t('type.' + item.type);
    $('.tpl__sheet').textContent = item.sheet;
    $('.tpl__title').textContent = title;
    $('.tpl__price').textContent = Ch.price(item);
    $('.tpl__desc').textContent = item.desc[lang];
    $('.tpl__fit').textContent = item.fit[lang];
    $('.tpl__list').innerHTML = item.inside[lang].map(s => `<li>${Ch.esc(s)}</li>`).join('');
    const inCart = Cart.has(item.id);
    add.textContent = Ch.t(inCart ? 'card.inCart' : 'card.add');
    add.setAttribute('aria-pressed', String(inCart));
    const img = $('.pv__img');
    if (img) img.alt = title;
  }

  render();
  Ch.onLang(render);
  window.addEventListener('cart:change', render);
})();
