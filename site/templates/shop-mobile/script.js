/* Демо «Магазин: мобильная версия» — холст как в Figma: 5 кадров 375×812,
   панорама перетаскиванием и колесом, масштаб, увеличение кадра по клику.
   На узком экране — вертикальная лента кадров без панорамы. */
(() => {
  DemoBar.init({ id: 'shop-mobile', sheet: 'Л-04', price: { rub: 1490, usd: 19 } });
  const t = DemoBar.t;

  const W = 375, H = 812, GAP = 96, PAD = 80;
  const FRAMES = ['home', 'catalog', 'product', 'cart', 'checkout'];
  const P = {
    p1: { rub: 12990, usd: 179, c: ['#5b6b5a', '#2f3a2f'] },
    p2: { rub: 6490, usd: 89, c: ['#c9b79c', '#9c8565'] },
    p3: { rub: 9990, usd: 139, c: ['#6e4f3a', '#3e2b1f'] },
    p4: { rub: 1990, usd: 29, c: ['#c46a4a', '#8e3f27'] },
    p5: { rub: 8990, usd: 119, c: ['#2f3b52', '#1b2232'] },
    p6: { rub: 7490, usd: 99, c: ['#a7a59a', '#6f6d62'] },
  };
  const money = (rub, usd) => (DemoBar.lang() === 'en' ? '$' + usd : String(rub).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽');
  const price = k => money(P[k].rub, P[k].usd);
  const img = (k, cls = '') => `<div class="s-img ${cls}" style="--c1:${P[k].c[0]};--c2:${P[k].c[1]}"><span>IMG 3:4</span></div>`;

  // ---------- экраны ----------
  const status = '<div class="s-status"><span>9:41</span><span class="s-status__i"><i></i><i></i><i></i></span></div>';
  const icon = {
    menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-6 8 6v9H4z"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
  };
  const tabbar = active => `<nav class="s-tabbar">${[['home', 's.tHome'], ['grid', 's.tCat'], ['heart', 's.tFav'], ['user', 's.tMe']]
    .map(([i, k], n) => `<span class="${n === active ? 'is-on' : ''}">${icon[i]}<b>${t(k)}</b></span>`).join('')}</nav>`;
  const head = (left, title, right) => `<div class="s-head">${left}<span class="s-head__t">${title}</span>${right}</div>`;
  const tile = k => `<div class="s-tile">${img(k)}<p>${t('s.' + k)}</p><b>${price(k)}</b></div>`;

  const screens = {
    home: () => status + head(icon.menu, '<span class="s-logo">NORDA</span>', icon.bag) + `
      <div class="s-hero"><p>${t('s.heroSub')}</p><h4>${t('s.hero')}</h4><span class="s-btn s-btn--light">${t('s.shop')}</span></div>
      <div class="s-row"><h5>${t('s.cats')}</h5></div>
      <div class="s-chips">${['s.c1', 's.c2', 's.c3', 's.c4'].map((k, n) => `<span class="${n ? '' : 'is-on'}">${t(k)}</span>`).join('')}</div>
      <div class="s-row"><h5>${t('s.hits')}</h5><span class="s-link">${t('s.all')}</span></div>
      <div class="s-grid">${tile('p1')}${tile('p2')}</div>` + tabbar(0),

    catalog: () => status + head(icon.back, t('s.c1'), icon.bag) + `
      <div class="s-chips">${['s.f1', 's.f2', 's.f3'].map((k, n) => `<span class="${n ? '' : 'is-on'}">${t(k)}</span>`).join('')}</div>
      <div class="s-row s-row--meta"><span>${t('s.filter')} · 3</span><span>${t('s.sort')} ↓</span></div>
      <div class="s-grid">${['p1', 'p5', 'p6', 'p3'].map(tile).join('')}</div>` + tabbar(1),

    product: () => status + `<div class="s-pimg">${img('p1', 's-img--big')}<span class="s-float s-float--l">${icon.back}</span><span class="s-float s-float--r">${icon.heart}</span><span class="s-dots"><i class="is-on"></i><i></i><i></i></span></div>
      <div class="s-pad">
        <div class="s-row"><h4 class="s-ptitle">${t('s.p1')}</h4><b class="s-price">${price('p1')}</b></div>
        <p class="s-muted">${t('s.desc')}</p>
        <p class="s-label">${t('s.size')}</p>
        <div class="s-sizes">${['XS', 'S', 'M', 'L', 'XL'].map(s => `<span class="${s === 'M' ? 'is-on' : ''}">${s}</span>`).join('')}</div>
        <p class="s-label">${t('s.color')}</p>
        <div class="s-swatches"><i style="--c:#5b6b5a" class="is-on"></i><i style="--c:#2f3b52"></i><i style="--c:#1d1d1b"></i></div>
      </div>
      <div class="s-bottom"><span class="s-btn">${t('s.add')} · ${price('p1')}</span></div>`,

    cart: () => status + head(icon.back, t('s.cartTitle'), '<span></span>') + `
      <div class="s-pad s-cart">${['p1', 'p4'].map(k => `
        <div class="s-cline">${img(k, 's-img--sm')}<div><p>${t('s.' + k)}</p><span class="s-muted">${t('s.qty')}</span><b>${price(k)}</b></div><span class="s-qty">− 1 +</span></div>`).join('')}
        <div class="s-promo"><span>${t('s.promo')}</span><b>${t('s.apply')}</b></div>
        <div class="s-sumline"><span>${t('s.delivery')}</span><span>${t('s.free')}</span></div>
        <div class="s-sumline s-sumline--total"><span>${t('s.sum')}</span><span>${money(P.p1.rub + P.p4.rub, P.p1.usd + P.p4.usd)}</span></div>
      </div>
      <div class="s-bottom"><span class="s-btn">${t('s.checkout')}</span></div>`,

    checkout: () => status + head(icon.back, t('fr.checkout'), '<span></span>') + `
      <div class="s-pad">
        <p class="s-label">${t('s.step')}</p>
        <div class="s-progress"><i class="is-on"></i><i class="is-on"></i><i></i></div>
        <h5 class="s-h">${t('s.addr')}</h5>
        <div class="s-input"><span>${t('s.city')}</span><b>${t('s.cityV')}</b></div>
        <div class="s-input"><span>${t('s.street')}</span><b>${t('s.streetV')}</b></div>
        <h5 class="s-h">${t('s.how')}</h5>
        <div class="s-radio is-on"><i></i><span>${t('s.d1')}</span><b>${money(0, 0)}</b></div>
        <div class="s-radio"><i></i><span>${t('s.d2')}</span><b>${money(0, 0)}</b></div>
      </div>
      <div class="s-bottom"><span class="s-btn">${t('s.pay')} · ${money(P.p1.rub + P.p4.rub, P.p1.usd + P.p4.usd)}</span></div>`,
  };

  const world = document.getElementById('world');
  const canvas = document.getElementById('canvas');
  const layers = document.getElementById('layers');
  const zoomVal = document.getElementById('z-val');
  const wide = window.matchMedia('(min-width: 721px)');
  const view = { x: 0, y: 0, z: 1 };

  function render() {
    world.innerHTML = FRAMES.map((f, n) => `
      <div class="slot" data-frame="${f}">
        <p class="frame-label">iPhone 14 — ${t('fr.' + f)}</p>
        <div class="frame-box"><div class="frame" role="button" tabindex="0" aria-label="${t('f.open')}: ${t('fr.' + f)}">${screens[f]()}</div></div>
      </div>`).join('');
    layers.innerHTML = FRAMES.map(f => `<li><button type="button" data-goto="${f}"><span aria-hidden="true">#</span> iPhone 14 — ${t('fr.' + f)}</button></li>`).join('');
    layout();
  }

  // ---------- вид ----------
  function apply() {
    world.style.transform = wide.matches ? `translate(${view.x}px, ${view.y}px) scale(${view.z})` : '';
    zoomVal.textContent = Math.round(view.z * 100) + '%';
  }
  const worldW = () => FRAMES.length * W + (FRAMES.length - 1) * GAP;
  const worldH = () => H + 40;
  function fit() {
    const r = canvas.getBoundingClientRect();
    view.z = Math.min(1, (r.width - PAD * 2) / worldW(), (r.height - PAD) / worldH());
    view.x = (r.width - worldW() * view.z) / 2;
    view.y = (r.height - worldH() * view.z) / 2;
    apply();
  }
  function zoomAt(cx, cy, k) {
    const z = Math.min(2, Math.max(.1, view.z * k));
    view.x = cx - (cx - view.x) * (z / view.z);
    view.y = cy - (cy - view.y) * (z / view.z);
    view.z = z;
    apply();
  }
  function layout() {
    // узкий экран: лента кадров, каждый масштабирован под ширину
    // ширину кадра задаёт CSS (min(375px, 100vw - 32px)), отсюда берём масштаб содержимого
    const box = world.querySelector('.slot');
    const s = wide.matches || !box ? 1 : Math.min(1, box.clientWidth / W);
    world.style.setProperty('--s', s);
    if (wide.matches) fit(); else apply();
  }

  document.getElementById('z-in').addEventListener('click', () => { const r = canvas.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 1.25); });
  document.getElementById('z-out').addEventListener('click', () => { const r = canvas.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, .8); });
  document.getElementById('z-fit').addEventListener('click', fit);

  canvas.addEventListener('wheel', e => {
    if (!wide.matches) return;
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * .01));
    else { view.x -= e.deltaX; view.y -= e.deltaY; apply(); }
  }, { passive: false });

  // перетаскивание; клик без сдвига по кадру — увеличить его
  let drag = null;
  canvas.addEventListener('pointerdown', e => {
    if (!wide.matches || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false, frame: e.target.closest('.slot') };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    canvas.classList.add('is-panning');
    view.x = drag.vx + dx; view.y = drag.vy + dy; apply();
  });
  canvas.addEventListener('pointerup', () => {
    if (drag && !drag.moved && drag.frame) openZoom(drag.frame.dataset.frame);
    drag = null;
    canvas.classList.remove('is-panning');
  });
  // на узком экране — обычный клик; Enter/пробел — с клавиатуры
  canvas.addEventListener('click', e => { if (!wide.matches) { const s = e.target.closest('.slot'); if (s) openZoom(s.dataset.frame); } });
  canvas.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('frame')) { e.preventDefault(); openZoom(e.target.closest('.slot').dataset.frame); }
  });

  layers.addEventListener('click', e => {
    const b = e.target.closest('[data-goto]');
    if (!b || !wide.matches) return;
    const n = FRAMES.indexOf(b.dataset.goto);
    const r = canvas.getBoundingClientRect();
    view.z = Math.min(1, (r.height - PAD) / worldH());
    view.x = r.width / 2 - (n * (W + GAP) + W / 2) * view.z;
    view.y = (r.height - worldH() * view.z) / 2;
    apply();
  });

  // ---------- увеличенный кадр ----------
  const modal = document.getElementById('frame-zoom');
  const stage = document.getElementById('frame-zoom-stage');
  let lastFocus = null;
  let openFrame = null;
  // всё, что за окном, недоступно для Tab и скринридера, пока окно открыто
  const behind = () => document.querySelectorAll('.fg, .fg-top, .demo-bar');
  function fillZoom() {
    stage.innerHTML = `<p class="frame-label">iPhone 14 — ${t('fr.' + openFrame)}</p><div class="frame-box"><div class="frame">${screens[openFrame]()}</div></div>`;
    modal.setAttribute('aria-label', t('fr.' + openFrame));
  }
  function openZoom(f) {
    lastFocus = document.activeElement;
    openFrame = f;
    const s = Math.min(1.25, (window.innerHeight - 110) / H, (window.innerWidth - 32) / W);
    stage.style.setProperty('--zs', s);
    fillZoom();
    modal.hidden = false;
    behind().forEach(el => { el.inert = true; });
    modal.querySelector('.frame-zoom__close').focus();
  }
  function closeZoom() {
    if (modal.hidden) return;
    modal.hidden = true;
    stage.innerHTML = '';
    behind().forEach(el => { el.inert = false; });
    // кадр мог перерисоваться (смена языка) — тогда возвращаем фокус на тот же кадр или холст
    const back = lastFocus && lastFocus.isConnected ? lastFocus : document.querySelector(`.slot[data-frame="${openFrame}"] .frame`) || canvas;
    openFrame = null;
    back.focus();
  }
  DemoBar.onLang(() => { if (openFrame) fillZoom(); });
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.frame-zoom__close')) closeZoom(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

  wide.addEventListener('change', layout);
  window.addEventListener('resize', () => { if (!wide.matches) layout(); });
  DemoBar.onLang(render);
  render();
})();
