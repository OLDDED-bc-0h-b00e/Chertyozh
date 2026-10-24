/* Светлая / тёмная тема. Подключается в <head>, чтобы тема применилась до отрисовки.
   По умолчанию — как в системе; выбор пользователя хранится в ch.theme (общий для сайта и демо). */
(() => {
  const root = document.documentElement;
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const subs = [];
  let saved = null;
  try { saved = localStorage.getItem('ch.theme'); } catch (e) { /* без хранилища — как в системе */ }
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  const current = () => root.dataset.theme || (dark.matches ? 'dark' : 'light');
  const notify = () => subs.forEach(fn => fn(current()));
  dark.addEventListener('change', () => { if (!root.dataset.theme) notify(); });

  window.Theme = {
    current,
    onChange(fn) { subs.push(fn); },
    toggle() {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('ch.theme', next); } catch (e) { /* без сохранения */ }
      notify();
    },
  };
})();
