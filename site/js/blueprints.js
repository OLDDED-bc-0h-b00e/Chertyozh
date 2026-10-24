/* Чертежи шаблонов: линейные SVG-схемы 320×200 по структуре каждого демо.
   Все элементы — штрихи с pathLength=1 (класс d), чтобы их можно было «прорисовать».
   Штриховка — отдельные отрезки, обрезанные по прямоугольнику (без <pattern> и id). */
(() => {
  let i = 0;
  const el = (tag, attrs, cls = 'd') => `<${tag} class="${cls}" pathLength="1" style="--i:${i++}" ${attrs}/>`;
  const r = (x, y, w, h, cls) => el('rect', `x="${x}" y="${y}" width="${w}" height="${h}"`, cls);
  const l = (x1, y1, x2, y2, cls) => el('line', `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`, cls);
  const c = (cx, cy, rr, cls) => el('circle', `cx="${cx}" cy="${cy}" r="${rr}"`, cls);
  const txt = (x, y, w, cls = 'd t') => l(x, y, x + w, y, cls);           // строка текста
  const head = (x, y, w) => txt(x, y, w, 'd th');                          // заголовок
  const btn = (x, y, w, h = 9) => r(x, y, w, h, 'd a');                    // кнопка-акцент

  function hatch(x, y, w, h, step = 7) {
    let out = r(x, y, w, h);
    for (let k = x - h + step; k < x + w; k += step) {
      const t0 = Math.max(0, (x - k) / h), t1 = Math.min(1, (x + w - k) / h);
      if (t1 <= t0) continue;
      out += l((k + t0 * h).toFixed(1), (y + h - t0 * h).toFixed(1), (k + t1 * h).toFixed(1), (y + h - t1 * h).toFixed(1), 'd hl');
    }
    return out;
  }

  const dim = (x1, x2, y, label) =>
    l(x1, y, x2, y, 'd dm') + l(x1, y - 3, x1, y + 3, 'd dm') + l(x2, y - 3, x2, y + 3, 'd dm') +
    `<text class="dt" x="${(x1 + x2) / 2}" y="${y - 3}" text-anchor="middle">${label}</text>`;

  const nav = (x, y, w) => r(x, y, w, 12) + txt(x + 6, y + 6, 26, 'd th') + txt(x + w - 80, y + 6, 14) + txt(x + w - 60, y + 6, 14) + txt(x + w - 40, y + 6, 14);

  function phone(x, y, w = 72, h = 150) {
    return r(x, y, w, h) + l(x + w / 2 - 10, y + 5, x + w / 2 + 10, y + 5);
  }

  const svg = body => `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;

  const B = {};

  B.vitrina = svg(
    dim(20, 300, 10, '1280') + r(20, 18, 280, 172) + nav(20, 18, 280) +
    hatch(28, 38, 140, 70) + head(180, 52, 100) + head(180, 62, 80) + txt(180, 76, 96) + txt(180, 83, 84) + btn(180, 94, 44) +
    hatch(28, 118, 84, 46) + hatch(118, 118, 84, 46) + hatch(208, 118, 84, 46) +
    txt(28, 172, 50) + txt(118, 172, 50) + txt(208, 172, 50) + txt(28, 179, 24) + txt(118, 179, 24) + txt(208, 179, 24)
  );

  B.kofeynya = svg(
    dim(20, 300, 10, '1280') + r(20, 18, 280, 172) + nav(20, 18, 280) +
    head(36, 50, 130) + head(36, 61, 104) + txt(36, 76, 118) + txt(36, 83, 96) + btn(36, 94, 46) +
    c(232, 72, 30) + c(232, 72, 20) + l(262, 64, 274, 64) + l(274, 64, 274, 80) + l(274, 80, 262, 80) +
    r(36, 120, 34, 8) + r(74, 120, 34, 8, 'd a') + r(112, 120, 34, 8) + r(150, 120, 34, 8) +
    txt(36, 140, 100) + l(150, 140, 170, 140, 'd t') + txt(36, 150, 90) + l(150, 150, 170, 150, 'd t') + txt(36, 160, 110) + l(150, 160, 170, 160, 'd t') +
    txt(186, 140, 90) + l(284, 140, 264, 140, 'd t') + txt(186, 150, 80) + l(284, 150, 264, 150, 'd t') + txt(186, 160, 70) + l(284, 160, 264, 160, 'd t') +
    hatch(36, 168, 248, 16, 6)
  );

  B.studiya = svg(
    dim(20, 300, 10, '1280') + r(20, 18, 280, 172) + nav(20, 18, 280) +
    head(32, 48, 180) + head(32, 60, 150) + head(32, 72, 110) + hatch(220, 40, 70, 78) + btn(32, 86, 52) +
    l(32, 128, 288, 128) + txt(32, 138, 80) + txt(220, 138, 30) + l(32, 146, 288, 146) + txt(32, 156, 96) + txt(220, 156, 30) +
    l(32, 164, 288, 164) + txt(32, 174, 70) + txt(220, 174, 30) + l(32, 182, 288, 182)
  );

  B['shop-mobile'] = svg(
    dim(16, 88, 12, '375') +
    [16, 124, 232].map((x, n) =>
      phone(x, 22, 72, 150) +
      (n === 0 ? hatch(x + 6, 34, 60, 40) + head(x + 6, 82, 44) + txt(x + 6, 90, 52) + hatch(x + 6, 98, 28, 28) + hatch(x + 38, 98, 28, 28) + btn(x + 6, 158, 60) :
       n === 1 ? r(x + 6, 32, 60, 8) + [0, 1, 2].map(k => hatch(x + 6, 46 + k * 34, 24, 28) + txt(x + 34, 52 + k * 34, 30) + txt(x + 34, 60 + k * 34, 18)).join('') + btn(x + 6, 158, 60) :
       hatch(x + 6, 32, 60, 56) + head(x + 6, 98, 50) + txt(x + 6, 108, 56) + txt(x + 6, 115, 40) + r(x + 6, 124, 26, 9) + r(x + 36, 124, 30, 9) + btn(x + 6, 158, 60))
    ).join('') +
    `<text class="dt" x="16" y="186">Home</text><text class="dt" x="124" y="186">Catalog</text><text class="dt" x="232" y="186">Product</text>`
  );

  B['company-site'] = svg(
    dim(14, 214, 10, '1440') +
    r(14, 18, 200, 128) + nav(14, 18, 200) + head(26, 48, 110) + head(26, 58, 90) + txt(26, 72, 100) + btn(26, 82, 40) + hatch(150, 40, 54, 54) +
    r(26, 104, 54, 34) + r(88, 104, 54, 34) + r(150, 104, 54, 34) +
    r(14, 154, 200, 36) + txt(26, 166, 60) + txt(26, 174, 90) + txt(26, 182, 40) +
    dim(232, 304, 10, '375') + phone(232, 18, 72, 172) + head(240, 50, 50) + txt(240, 60, 56) + hatch(240, 70, 56, 40) + r(240, 118, 56, 20) + r(240, 142, 56, 20) + btn(240, 172, 56)
  );

  function chat(x, y) {
    return phone(x, y, 96, 176) + r(x, y + 12, 96, 14) + c(x + 10, y + 19, 4) + txt(x + 18, y + 19, 30);
  }
  const bubble = (x, y, w, h, me) => r(me ? x + 96 - 8 - w : x + 8, y, w, h);

  B['bot-shop'] = svg(
    chat(112, 12) +
    bubble(112, 34, 60, 18) + txt(124, 41, 44) + txt(124, 47, 30) +
    r(120, 56, 38, 9, 'd a') + r(162, 56, 38, 9, 'd a') + r(120, 68, 80, 9, 'd a') +
    bubble(112, 84, 44, 10, true) +
    bubble(112, 100, 70, 40) + hatch(124, 104, 58, 20, 6) + txt(124, 130, 40) + txt(124, 136, 24) +
    r(120, 146, 38, 9, 'd a') + r(162, 146, 38, 9, 'd a') + r(112, 172, 96, 16) +
    txt(16, 60, 70) + txt(16, 70, 56) + txt(16, 80, 64) + l(88, 65, 108, 45, 'd dm') +
    txt(236, 110, 70) + txt(236, 120, 50) + l(232, 115, 212, 150, 'd dm')
  );

  B['bot-booking'] = svg(
    chat(112, 12) +
    bubble(112, 34, 64, 16) + txt(124, 42, 44) +
    r(120, 56, 80, 9, 'd a') + r(120, 68, 80, 9, 'd a') +
    bubble(112, 84, 40, 10, true) +
    r(120, 102, 80, 56) + [0, 1, 2, 3].map(k => l(120, 116 + k * 11, 200, 116 + k * 11)).join('') +
    [1, 2, 3, 4, 5, 6].map(k => l(120 + k * 80 / 7, 102, 120 + k * 80 / 7, 158)).join('') + r(143, 127, 11, 11, 'd a') +
    r(112, 172, 96, 16) + txt(16, 90, 70) + txt(16, 100, 50) + l(88, 95, 118, 120, 'd dm')
  );

  window.BLUEPRINTS = B;
})();
