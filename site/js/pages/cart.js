/* Корзина и оформление (демо). Неизвестные id удаляются из корзины. */
(() => {
  const $ = s => document.querySelector(s);
  const rows = $('#cart-rows');

  // рендер ничего не пишет в хранилище: иначе при сбое записи cart:change зацикливается
  const items = () => Cart.ids().map(id => CATALOG.byId(id)).filter(Boolean);

  // неизвестные id (шаблон убрали из каталога) чистим один раз при загрузке
  Cart.ids().filter(id => !CATALOG.byId(id)).forEach(id => Cart.remove(id));

  function render() {
    if (!$('#cart-done').hidden) return;
    const list = items();
    const lang = Ch.lang();
    rows.innerHTML = list.map(i => `
      <li class="cart-row">
        <span class="label">${Ch.esc(Ch.sheet(i.sheet))}</span>
        <div class="cart-row__main">
          <a class="h-card" href="template.html?id=${encodeURIComponent(i.id)}">${Ch.esc(i.title[lang])}</a>
          <span class="label">${Ch.esc(Ch.t('type.' + i.type))}</span>
        </div>
        <span class="cart-row__price">${Ch.price(i)}</span>
        <button class="btn btn--sm btn--ghost" type="button" data-remove="${Ch.esc(i.id)}" aria-label="${Ch.esc(Ch.t('cartp.removeAria') + ' ' + i.title[lang])}">${Ch.esc(Ch.t('cartp.remove'))}</button>
      </li>`).join('');
    const empty = list.length === 0;
    $('#cart-empty').hidden = !empty;
    $('#cart-side').hidden = empty;
    $('#cart-sum').textContent = Ch.sum(list);
    $('.cartp__count').textContent = `${Ch.t('cartp.items')}: ${list.length}`;
  }

  rows.addEventListener('click', e => {
    const b = e.target.closest('[data-remove]');
    if (b) Cart.remove(b.dataset.remove);
  });

  FormUI.bind($('#order'), data => Forms.submitOrder({ ...data, items: Cart.ids() }), () => {
    $('#cartp').hidden = true;
    $('#cart-done').hidden = false;
    Cart.clear();
    $('#cart-done').scrollIntoView({ block: 'start' });
    const title = $('#cart-done h2');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  });

  render();
  Ch.onLang(render);
  window.addEventListener('cart:change', render);
})();
