/* Корзина в localStorage: уникальные id шаблонов. Любая ошибка хранилища → пустая корзина. */
(() => {
  const KEY = 'ch.cart';

  function read() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
    } catch (e) { return []; }
  }

  function write(ids) {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) { /* приватный режим — живём без сохранения */ }
    window.dispatchEvent(new CustomEvent('cart:change', { detail: { ids: ids.slice() } }));
  }

  window.Cart = {
    ids: () => [...new Set(read())],
    has: id => read().includes(id),
    count: () => new Set(read()).size,
    add(id) { const ids = window.Cart.ids(); if (!ids.includes(id)) { ids.push(id); write(ids); } },
    remove(id) { write(window.Cart.ids().filter(x => x !== id)); },
    clear() { write([]); },
  };

  // корзина, изменённая в другой вкладке (например, кнопкой «Купить» в демо)
  window.addEventListener('storage', e => {
    if (e.key === KEY) window.dispatchEvent(new CustomEvent('cart:change', { detail: { ids: window.Cart.ids() } }));
  });
})();
