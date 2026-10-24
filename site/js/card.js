/* Карточка шаблона-листа: превью, тип, цена, «Демо» и «В корзину». Сама обновляется при смене языка и корзины. */
(() => {
  const cards = [];

  function update(card) {
    const { el, item } = card;
    const lang = Ch.lang();
    el.querySelector('.card__type').textContent = Ch.t('type.' + item.type);
    el.querySelector('.card__price').textContent = Ch.price(item);
    el.querySelector('.card__title a').textContent = item.title[lang];
    const demo = el.querySelector('.card__demo');
    demo.textContent = Ch.t(item.ready ? 'card.demo' : 'pv.soon');
    const add = el.querySelector('.card__add');
    const inCart = Cart.has(item.id);
    add.textContent = Ch.t(inCart ? 'card.inCart' : 'card.add');
    add.classList.toggle('btn--accent', !inCart);
    add.setAttribute('aria-pressed', String(inCart));
  }

  window.renderCard = function renderCard(item) {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.id = item.id;
    el.dataset.type = item.type;
    el.innerHTML = `
      <div class="card__pv"></div>
      <div class="card__body">
        <div class="card__row"><span class="label card__type"></span><span class="card__price"></span></div>
        <h3 class="h-card card__title"><a href="template.html?id=${encodeURIComponent(item.id)}"></a></h3>
        <div class="card__actions">
          ${item.ready
            ? `<a class="btn btn--sm btn--ghost card__demo" href="${Ch.esc(item.demo)}" target="_blank" rel="noopener"></a>`
            : `<span class="btn btn--sm btn--ghost card__demo is-off" aria-disabled="true"></span>`}
          <button class="btn btn--sm card__add" type="button"></button>
        </div>
      </div>`;
    Reveal.mount(el.querySelector('.card__pv'), item);
    el.querySelector('.card__add').addEventListener('click', () => {
      if (Cart.has(item.id)) location.href = 'cart.html';
      else Cart.add(item.id);
    });
    const card = { el, item };
    cards.push(card);
    update(card);
    return el;
  };

  const refresh = () => cards.forEach(c => { if (c.el.isConnected) update(c); });
  Ch.onLang(refresh);
  window.addEventListener('cart:change', refresh);
})();
