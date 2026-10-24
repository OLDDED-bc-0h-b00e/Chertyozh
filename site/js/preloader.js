/* Прелоадер главной: рамка листа рисуется линиями, красная линия-сканер с процентами.
   Один раз за сессию, ≤1,5 с; при prefers-reduced-motion не показывается. */
(() => {
  const el = document.querySelector('.pl');
  if (!el) return;
  let seen = false;
  try { seen = sessionStorage.getItem('ch.pl') === '1'; sessionStorage.setItem('ch.pl', '1'); } catch (e) { /* без хранилища — показываем */ }
  if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }

  document.documentElement.classList.add('is-loading');
  const pct = el.querySelector('.pl__pct');
  const DURATION = 1300;
  const start = performance.now();
  const step = now => {
    const k = Math.min(1, (now - start) / DURATION);
    const e = 1 - Math.pow(1 - k, 3);
    el.style.setProperty('--p', e.toFixed(4));
    pct.textContent = Math.round(e * 100) + '%';
    if (k < 1) requestAnimationFrame(step);
    else {
      el.classList.add('is-done');
      document.documentElement.classList.remove('is-loading');
      setTimeout(() => el.remove(), 450);
    }
  };
  requestAnimationFrame(step);
})();
