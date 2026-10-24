/* Превью «чертёж → готово»: SVG-чертёж, поверх — скриншот демо, открываемый
   красной линией-сканером с процентами. Режимы: html[data-mode] = auto | blueprint | final. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const DURATION = 900;

  function setP(pv, p) {
    pv.style.setProperty('--p', String(p));
    const pct = pv.querySelector('.pv__pct');
    if (pct) pct.textContent = Math.round(p * 100) + '%';
    pv.classList.toggle('is-scanning', p > 0 && p < 1);
  }

  // плавно ведём --p к цели; одна анимация на превью
  function animateTo(pv, target) {
    cancelAnimationFrame(pv._raf);
    const from = parseFloat(pv.style.getPropertyValue('--p')) || 0;
    if (reduce.matches || from === target) { setP(pv, target); return; }
    const start = performance.now();
    const dur = DURATION * Math.abs(target - from);
    const step = now => {
      const k = Math.min(1, (now - start) / dur);
      const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      setP(pv, from + (target - from) * e);
      if (k < 1) pv._raf = requestAnimationFrame(step);
    };
    pv._raf = requestAnimationFrame(step);
  }

  // код листа и alt картинки следуют за языком
  const mounted = [];
  function translate({ pv, item, img }) {
    pv.querySelector('.pv__sheet').textContent = Ch.sheet(item.sheet);
    if (img) img.alt = item.title[Ch.lang()] || item.title.ru;
  }
  Ch.onLang(() => mounted.forEach(translate));

  function mount(host, item, opts = {}) {
    const pv = document.createElement('div');
    pv.className = 'pv' + (opts.big ? ' pv--big' : '');
    pv.dataset.id = item.id;
    pv._autoplay = !!opts.autoplay; // превью само прорисовывается при появлении (hero), без наведения
    pv.innerHTML = `
      <div class="pv__frame">
        <div class="pv__bp">${(window.BLUEPRINTS && BLUEPRINTS[item.id]) || ''}</div>
        <div class="pv__scan" aria-hidden="true"><span class="pv__pct">0%</span></div>
      </div>
      <div class="pv__meta"><span class="label pv__sheet"></span><span class="label">1:1</span></div>`;
    pv.querySelectorAll('.d').forEach((d, n) => d.style.setProperty('--i', n));
    setP(pv, 0);
    const entry = { pv, item, img: null };
    mounted.push(entry);
    translate(entry);

    if (item.ready && item.preview) {
      const img = new Image();
      img.className = 'pv__img';
      img.alt = '';
      img.decoding = 'async';
      img.onload = () => {
        entry.img = img;
        translate(entry);
        pv.querySelector('.pv__frame').insertBefore(img, pv.querySelector('.pv__scan'));
        pv.classList.add('has-img');
        touchReveal(pv);
      };
      img.src = item.preview;
      if (canHover.matches && !opts.autoplay) {
        const open = () => { if (Ch.mode() === 'auto') animateTo(pv, 1); };
        const close = () => { if (Ch.mode() === 'auto') animateTo(pv, 0); };
        pv.addEventListener('pointerenter', open);
        pv.addEventListener('pointerleave', close);
        // с клавиатуры лист прорисовывается, пока фокус внутри карточки
        const card = host.closest('.card');
        if (card) {
          card.addEventListener('focusin', open);
          card.addEventListener('focusout', e => { if (!card.contains(e.relatedTarget)) close(); });
        }
      }
    } else {
      pv.classList.add('is-soon');
      const soon = document.createElement('span');
      soon.className = 'pv__soon';
      soon.dataset.i18n = 'pv.soon';
      soon.textContent = Ch.t('pv.soon');
      pv.querySelector('.pv__frame').append(soon);
    }

    host.append(pv);
    if (observer) observer.observe(pv); else { pv.classList.add('is-drawn'); pv._visible = true; }
    return pv;
  }

  // на тач-экранах сканер запускается сам, когда превью в кадре и картинка загружена
  function touchReveal(pv) {
    if ((canHover.matches && !pv._autoplay) || pv._shown || !pv._visible || !pv.classList.contains('has-img') || Ch.mode() !== 'auto') return;
    pv._shown = true;
    setTimeout(() => animateTo(pv, 1), reduce.matches ? 0 : 450);
  }

  // прорисовка линий при появлении
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      const pv = e.target;
      pv._visible = e.isIntersecting;
      if (!e.isIntersecting) return;
      pv.classList.add('is-drawn');
      touchReveal(pv);
    });
  }, { threshold: .45 }) : null;

  window.Reveal = {
    mount,
    animateTo,
    observe(root = document) { root.querySelectorAll('.pv').forEach(pv => observer ? observer.observe(pv) : pv.classList.add('is-drawn')); },
  };
})();
