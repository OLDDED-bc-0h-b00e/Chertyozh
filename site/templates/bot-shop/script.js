/* Демо «Бот-магазин»: макет чата с ботом по заранее заданному сценарию. */
(() => {
  DemoBar.init({ id: 'bot-shop', sheet: 'Л-06', price: { rub: 6900, usd: 99 } });
  const t = DemoBar.t;

  // сценарий: узел → текст бота и кнопки (переходы)
  const FLOW = {
    start: {
      text: { ru: 'Привет! Я бот магазина «Полка» 👋\nПомогу выбрать подарок и оформить заказ.', en: 'Hi! I am the Polka store bot 👋\nI will help you pick a gift and place an order.' },
      buttons: [
        { label: { ru: '🛍 Каталог', en: '🛍 Catalog' }, to: 'catalog' },
        { label: { ru: '🔥 Акции', en: '🔥 Deals' }, to: 'deals' },
        { label: { ru: '💬 Помощь', en: '💬 Help' }, to: 'help' },
      ],
    },
    catalog: {
      text: { ru: 'Выберите категорию:', en: 'Choose a category:' },
      buttons: [
        { label: { ru: 'Свечи', en: 'Candles' }, to: 'candles' },
        { label: { ru: 'Посуда', en: 'Tableware' }, to: 'dishes' },
        { label: { ru: '← Назад', en: '← Back' }, to: 'start' },
      ],
    },
    candles: {
      text: { ru: 'Свечи ручной работы из соевого воска:', en: 'Handmade soy wax candles:' },
      buttons: [
        { label: { ru: 'Свеча «Лес» · 890 ₽', en: 'Forest candle · $12' }, to: 'p_forest' },
        { label: { ru: 'Свеча «Цитрус» · 790 ₽', en: 'Citrus candle · $11' }, to: 'p_citrus' },
        { label: { ru: '← Каталог', en: '← Catalog' }, to: 'catalog' },
      ],
    },
    dishes: {
      text: { ru: 'Керамика небольшой мастерской:', en: 'Ceramics from a small studio:' },
      buttons: [
        { label: { ru: 'Кружка «Глина» · 1 290 ₽', en: 'Clay mug · $18' }, to: 'p_mug' },
        { label: { ru: '← Каталог', en: '← Catalog' }, to: 'catalog' },
      ],
    },
    order: {
      text: { ru: 'Как доставить заказ?', en: 'How should we deliver?' },
      buttons: [
        { label: { ru: '🚚 Курьером', en: '🚚 Courier' }, to: 'done' },
        { label: { ru: '📦 Самовывоз', en: '📦 Pickup' }, to: 'done' },
      ],
    },
    done: {
      text: { ru: 'Заказ №1024 оформлен 🎉\nНапишем, когда он будет в пути.', en: 'Order #1024 placed 🎉\nWe will message you when it ships.' },
      buttons: [{ label: { ru: 'В начало', en: 'Start over' }, to: 'start' }],
    },
    deals: {
      text: { ru: 'Сегодня −15% на все свечи по коду POLKA15 🔥', en: 'Today: 15% off all candles with code POLKA15 🔥' },
      buttons: [
        { label: { ru: 'К свечам', en: 'See candles' }, to: 'candles' },
        { label: { ru: '← Назад', en: '← Back' }, to: 'start' },
      ],
    },
    help: {
      text: { ru: 'Напишите вопрос — менеджер ответит в течение 15 минут.', en: 'Send your question — a manager replies within 15 minutes.' },
      buttons: [{ label: { ru: '← Назад', en: '← Back' }, to: 'start' }],
    },
  };

  // карточка товара и «добавлено в корзину» — своя пара узлов на каждый товар
  [
    { id: 'forest', back: 'candles', photo: 'forest', price: { ru: '890 ₽', en: '$12' },
      text: { ru: 'Свеча «Лес» 🌲\nСоевый воск, хвоя и дым, 40 часов горения.', en: 'Forest candle 🌲\nSoy wax, pine and smoke, 40 hours of burn time.' } },
    { id: 'citrus', back: 'candles', photo: 'citrus', price: { ru: '790 ₽', en: '$11' },
      text: { ru: 'Свеча «Цитрус» 🍊\nСоевый воск, апельсин и бергамот, 35 часов горения.', en: 'Citrus candle 🍊\nSoy wax, orange and bergamot, 35 hours of burn time.' } },
    { id: 'mug', back: 'dishes', photo: 'mug', price: { ru: '1 290 ₽', en: '$18' },
      text: { ru: 'Кружка «Глина» ☕\nРучная лепка, 350 мл, можно в посудомойку.', en: 'Clay mug ☕\nHandmade, 350 ml, dishwasher safe.' } },
  ].forEach(p => {
    FLOW['p_' + p.id] = {
      image: p.photo,
      text: { ru: p.text.ru + '\n\n' + p.price.ru, en: p.text.en + '\n\n' + p.price.en },
      buttons: [
        { label: { ru: '🛒 В корзину', en: '🛒 Add to cart' }, to: 'c_' + p.id },
        { label: { ru: '← Назад', en: '← Back' }, to: p.back },
      ],
    };
    FLOW['c_' + p.id] = {
      text: { ru: 'Добавлено ✅\nВ корзине: 1 товар на ' + p.price.ru, en: 'Added ✅\nCart: 1 item, ' + p.price.en },
      buttons: [
        { label: { ru: 'Оформить заказ', en: 'Check out' }, to: 'order' },
        { label: { ru: 'Продолжить покупки', en: 'Keep shopping' }, to: 'catalog' },
      ],
    };
  });

  const msgs = document.getElementById('msgs');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const time = () => new Date().toTimeString().slice(0, 5);

  // история: { from: 'bot', node } | { from: 'me', node, btn }
  let history = [];
  let busy = false;
  let timer = null;

  // HTML одной записи истории; active — у последнего сообщения бота кнопки живые
  function item(h, active) {
    const lang = DemoBar.lang();
    if (h.from === 'me') return `<div class="b-msg b-msg--me"><p>${esc(FLOW[h.node].buttons[h.btn].label[lang])}</p><time>${h.time}</time></div>`;
    const n = FLOW[h.node];
    return `<div class="b-msg b-msg--bot">
        ${n.image ? `<div class="b-photo b-photo--${n.image}" aria-hidden="true"><span></span></div>` : ''}
        <p>${esc(n.text[lang]).replace(/\n/g, '<br>')}</p><time>${h.time}</time>
      </div>
      <div class="b-kbd${active ? '' : ' is-old'}">${n.buttons.map((b, k) =>
        `<button type="button" data-node="${h.node}" data-btn="${k}"${active ? '' : ' disabled'}>${esc(b.label[lang])}</button>`).join('')}</div>`;
  }
  const typing = () => `<div class="b-msg b-msg--bot b-typing"><p>${esc(t('b.typing'))}</p></div>`;

  // полная перерисовка — только при смене языка и перезапуске
  function render() {
    msgs.innerHTML = history.map((h, i) => item(h, i === history.length - 1 && !busy)).join('') + (busy ? typing() : '');
    msgs.scrollTop = msgs.scrollHeight;
  }

  // по ходу диалога только дописываем, чтобы не терять фокус и не мигать
  function append(html) {
    msgs.insertAdjacentHTML('beforeend', html);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function press(node, btn) {
    if (busy) return;
    const hadFocus = msgs.contains(document.activeElement);
    busy = true;
    msgs.querySelectorAll('.b-kbd:not(.is-old)').forEach(k => {
      k.classList.add('is-old');
      k.querySelectorAll('button').forEach(b => { b.disabled = true; });
    });
    const me = { from: 'me', node, btn, time: time() };
    history.push(me);
    append(item(me) + typing());
    if (hadFocus) msgs.focus();
    timer = setTimeout(() => {
      busy = false;
      const bot = { from: 'bot', node: FLOW[node].buttons[btn].to, time: time() };
      history.push(bot);
      const tp = msgs.querySelector('.b-typing');
      if (tp) tp.remove();
      append(item(bot, true));
      if (hadFocus) msgs.querySelector('.b-kbd:last-child button').focus();
    }, reduce ? 0 : 500);
  }

  function restart() {
    clearTimeout(timer);
    busy = false;
    history = [{ from: 'bot', node: 'start', time: time() }];
    render();
  }

  msgs.addEventListener('click', e => {
    const b = e.target.closest('button[data-node]');
    if (b && !b.disabled) press(b.dataset.node, Number(b.dataset.btn));
  });
  document.querySelectorAll('.b-restart').forEach(b => b.addEventListener('click', restart));
  DemoBar.onLang(render);

  window.BotDemo = { FLOW, restart };
  restart();
})();
