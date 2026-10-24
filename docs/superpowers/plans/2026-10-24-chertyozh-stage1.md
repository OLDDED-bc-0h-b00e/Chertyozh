# Chertyozh — этап 1: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сайт-магазин шаблонов Chertyozh в стиле «технический чертёж на бумаге»: главная, каталог, страница шаблона, демо-корзина, форма «Под ключ» и три живых демо (лендинг «Кофейня», Figma-макет «Магазин: мобильная версия», бот «Бот-магазин»).

**Architecture:** Многостраничный статический сайт в `site/`. Общие модули на `window` (без ES-модулей, чтобы работало без сервера сборки): `I18N` (тексты), `CATALOG` (данные товаров), `BLUEPRINTS` (SVG-схемы), `Ch` (язык/режим/формат цен), `Cart` (localStorage), `Reveal` (превью «чертёж → готово»), `Forms` (заглушки отправки). Каждая страница — свой HTML и маленький скрипт `js/pages/<page>.js`. Демо живут в `site/templates/<slug>/`, у каждого свой стиль и словарь, общая полоска демо — `site/templates/_shared/`.

**Tech Stack:** HTML, CSS (custom properties, clip-path, grid), vanilla JS (ES2019, без модулей), Google Fonts (Space Grotesk, JetBrains Mono), PowerShell `check.ps1`, встроенный браузер для проверок и скриншотов.

**Spec:** `docs/specs/2026-10-24-chertyozh-design.md`

## Global Constraints

- Без сборки и зависимостей; внешнее — только Google Fonts (Space Grotesk 400/500/700, JetBrains Mono 400/500), с фолбэком `system-ui` / `ui-monospace`.
- Все пути в `site/` относительные (`css/…`, `./`, `../`); никаких `/…` от корня.
- Каждый текст — в `i18n.js` на RU и EN; цены: RU в ₽ (`4 900 ₽`), EN в $ (`$69`).
- Цвета/размеры — переменные в `:root`; тёмная тема — `@media (prefers-color-scheme: dark)`.
- Палитра: бумага `#f1eee7`, тушь `#1c1b19`, линии `rgba(28,27,25,.18)`, акцент `#e5532d`; тёмная: фон `#141412`, светлые линии, тот же акцент.
- Адаптив от 360px без горизонтального скролла; `alt` у картинок; `prefers-reduced-motion` отключает анимации.
- Анти-цели: детскость, «школьная тетрадка» (клетка, линейки), много каракулей, рукописные шрифты.
- Реальной отправки данных нет: `Forms.submitOrder` / `Forms.submitLead` — заглушки.
- Ссылка на MOONLIGHT: `https://oldded-bc-0h-b00e.github.io/SIte-Portfolio/`.
- Правило проекта: **не коммитить без просьбы пользователя** — шагов commit в плане нет.
- Превью сервер: `powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1 -Port 3001` (из корня проекта), http://localhost:3001.

## Как здесь «тестируем»

Node/Python нет. Тест = (1) `check.ps1` (код 0) и (2) JS-утверждения, выполняемые во встроенном браузере (`javascript_tool`) на открытой странице; ожидаемый результат — `true`/конкретное значение. Плюс скриншоты 360/1280.

## Review Focus

1. Неизвестный или пустой `?id` на `template.html` → экран «Лист не найден» со ссылкой в каталог, без ошибок в консоли. (Task 5)
2. `localStorage` недоступен или в `cart` лежит мусор (не JSON, не массив, id которого нет в каталоге) → корзина пустая/очищенная, страница работает. (Task 1, Task 6)
3. Переключение RU↔EN на странице корзины и шаблона → цены и итог сразу в другой валюте. (Task 5, Task 6)
4. Пустой/неверный email или двойной клик «Оформить» → ошибка у поля / ровно один экран успеха. (Task 6)
5. Google Fonts не загрузился → вёрстка не ломается (фолбэк-шрифты, нет переполнения на 360px). (Task 1)

---

### Task 1: Каркас — токены, шрифты, шапка/подвал, язык, режим, корзина, заглушки форм, check.ps1

**Files:**
- Modify: `check.ps1` (проверять все `site/**/*.html`; словари i18n брать из `<script src=…i18n.js>` каждой страницы)
- Rewrite: `site/css/styles.css` (токены, база, типографика, рамка листа, шапка, подвал, кнопки, поля, бейджи)
- Rewrite: `site/js/i18n.js`, `site/js/main.js`
- Create: `site/js/store.js`, `site/js/forms.js`
- Rewrite: `site/assets/favicon.svg`; Create: `site/assets/logo.svg` (знак: квадрат листа с меткой «+» и угловым штампом, линии 1.5px, тушь + акцент)
- Rewrite: `site/index.html` (пока только шапка/пустой `main`/подвал — общий каркас, который копируют остальные страницы)

**Interfaces:**
- Produces:
  - `window.Ch.lang(): 'ru'|'en'`, `Ch.setLang(l)`, `Ch.t(key): string`, `Ch.onLang(fn)` — вызывается после смены языка; язык в `localStorage['ch.lang']`, по умолчанию `ru`.
  - `Ch.mode(): 'auto'|'blueprint'|'final'`, `Ch.setMode(m)` — пишет `document.documentElement.dataset.mode` и `localStorage['ch.mode']`, по умолчанию `auto`.
  - `Ch.price(item): string` — `{rub, usd}` → `"4 900 ₽"` (ru, неразрывный пробел в тысячах) / `"$69"` (en).
  - `Ch.sum(items): string` — та же логика для суммы.
  - `window.Cart.ids(): string[]`, `Cart.add(id)`, `Cart.remove(id)`, `Cart.clear()`, `Cart.has(id): boolean`, `Cart.count(): number`; хранит уникальные id в `localStorage['ch.cart']`; любые ошибки чтения/парсинга → `[]`; после изменения шлёт `window` событие `cart:change`.
  - `window.Forms.submitOrder(data): Promise<{ok:true}>`, `Forms.submitLead(data): Promise<{ok:true}>` — ждут 600 мс и резолвятся; данные никуда не уходят (`// TODO: подключить Telegram/почту/оплату`).
  - Разметка шапки (все страницы): `<header class="hdr">` с `.hdr__logo`, `nav.hdr__nav` (Каталог `catalog.html`, Как это работает `index.html#how`, Под ключ `index.html#custom`), `.mode` (3 кнопки `data-mode`), `.lang` (2 кнопки `data-lang`), `a.cart-link` с `.cart-link__count`.
  - Подвал: `<footer class="ftr">` — штамп-таблица (`.stamp`) с ячейками: Chertyozh, «Лист», дата, ссылка «Сделано в MOONLIGHT», © 2026.
  - CSS-классы для всех страниц: `.sheet` (рамка листа с «+» по углам), `.label` (моно-подпись), `.num` (номер раздела `1.1`), `.btn`, `.btn--accent`, `.btn--ghost`, `.field`, `.field__error`.

- [ ] **Step 1: Расширить `check.ps1`** — цикл по `Get-ChildItem site -Recurse -Filter *.html`; для каждого файла ключи берутся из всех подключённых им `*i18n*.js` (путь относительно файла); проверки путей/alt/битых ссылок — относительно папки файла. Ссылки с `?…`/`#…` проверяются по части до них.
- [ ] **Step 2: Прогнать** `powershell -NoProfile -ExecutionPolicy Bypass -File check.ps1` на текущей заготовке → `check.ps1: OK`.
- [ ] **Step 3: Сверстать каркас** (`styles.css`, `index.html`, `logo.svg`, `favicon.svg`), подключить шрифты одной ссылкой Google Fonts с `display=swap`; `--font-sans: "Space Grotesk", system-ui, sans-serif; --font-mono: "JetBrains Mono", ui-monospace, monospace`.
- [ ] **Step 4: Реализовать** `main.js` (Ch), `store.js` (Cart), `forms.js` (Forms), словарь шапки/подвала в `i18n.js`. Счётчик корзины обновляется на `cart:change` и скрыт при 0.
- [ ] **Step 5: Проверить в браузере** (http://localhost:3001/) через `javascript_tool`:
  - `Ch.price({rub:4900,usd:69})` → `"4 900 ₽"`; после `Ch.setLang('en')` → `"$69"`.
  - `Cart.clear(); Cart.add('kofeynya'); Cart.add('kofeynya'); Cart.count()` → `1`.
  - `localStorage.setItem('ch.cart','{oops'); Cart.ids()` → `[]` (без исключения).
  - `Ch.setMode('final'); document.documentElement.dataset.mode` → `"final"`; перезагрузка → режим сохранён.
  - Блокировка шрифтов: `document.querySelectorAll('link[href*="fonts.googleapis"]').forEach(l=>l.remove())` → на 360px `document.documentElement.scrollWidth <= innerWidth` → `true`.
- [ ] **Step 6:** `check.ps1` → OK; консоль без ошибок; скриншоты шапки 360/1280, светлая и тёмная.

### Task 2: Данные каталога, SVG-схемы и превью «чертёж → готово»

**Files:**
- Create: `site/js/catalog.js`, `site/js/blueprints.js`, `site/js/reveal.js`
- Create: `site/css/sheet.css` (превью, карточка-лист, сканер)
- Modify: `site/js/i18n.js` (подписи типов, «Демо скоро»)

**Interfaces:**
- Consumes: `Ch.mode()`, `Ch.lang()`.
- Produces:
  - `window.CATALOG: Item[]`, где `Item = { id, sheet, type: 'landing'|'figma'|'bot', price:{rub,usd}, ready:boolean, demo:string|null, preview:string|null, title:{ru,en}, desc:{ru,en}, inside:{ru:string[],en:string[]}, fit:{ru,en} }`.
    Все 7 позиций из спеки §7: `vitrina` Л-01 landing 2900/39 · `kofeynya` Л-02 landing 4900/69 · `studiya` Л-03 landing 9900/129 · `shop-mobile` Л-04 figma 1490/19 · `company-site` Л-05 figma 4990/69 · `bot-shop` Л-06 bot 6900/99 · `bot-booking` Л-07 bot 4900/69. `ready:true` только у `kofeynya`, `shop-mobile`, `bot-shop` (`demo: 'templates/<id>/'`, `preview: 'assets/previews/<id>.jpg'`); у остальных `demo:null, preview:null`.
  - `CATALOG.byId(id): Item|undefined`.
  - `window.BLUEPRINTS: Record<id, string>` — инлайн-SVG `viewBox="0 0 320 200"`, линии `stroke="currentColor"` с `vector-effect="non-scaling-stroke"`, штриховка (pattern) на месте картинок; схема повторяет структуру демо. Для всех 7 id.
  - `Reveal.mount(el: HTMLElement, item: Item, opts?: {big?: boolean})` — строит `.pv` (слои `.pv__bp` и `.pv__img`, линия `.pv__scan`, счётчик `.pv__pct`, моно-подпись листа). Без `preview` — только чертёж и плашка «Демо скоро».
  - `Reveal.observe(root)` — режим `auto`: прорисовка (`stroke-dashoffset`) при появлении; сканер на `pointerenter` (десктоп) и при появлении в экране (тач/без hover); `blueprint`/`final` — фиксированное состояние через `[data-mode]` на `<html>`; `prefers-reduced-motion` — сразу конечное состояние без анимации.
  - Сканер: CSS-переменная `--p` 0→1 за 900 мс, `.pv__img { clip-path: inset(0 0 calc((1 - var(--p)) * 100%) 0) }`, линия `top: calc(var(--p) * 100%)`, проценты = `Math.round(p*100)`.
- [ ] **Step 1:** Временная проверочная страница не нужна — смонтировать в `index.html` один `.pv` для `kofeynya` (позже станет hero-превью).
- [ ] **Step 2: Проверить:** `CATALOG.length` → `7`; `CATALOG.filter(i=>i.ready).map(i=>i.id).join()` → `"kofeynya,shop-mobile,bot-shop"`; `Object.keys(BLUEPRINTS).length` → `7`; после наведения и 1 с `getComputedStyle(document.querySelector('.pv')).getPropertyValue('--p').trim()` → `"1"`; `Ch.setMode('blueprint')` → `.pv__img` скрыт (clip 100%).
- [ ] **Step 3:** `check.ps1` → OK, консоль чистая. (Превью-картинок ещё нет — `.pv__img` с 404 недопустим: до Task 10 у `ready` позиций `preview` указывает на файл, который появится в Task 10, поэтому `Reveal.mount` ставит картинку только после её `load`; при ошибке загрузки — остаётся чертёж.)

### Task 3: Главная страница

**Files:**
- Modify: `site/index.html`, `site/css/styles.css` (секции главной), `site/js/i18n.js`
- Create: `site/js/pages/home.js`, `site/js/preloader.js`

**Interfaces:**
- Consumes: `Reveal.mount/observe`, `CATALOG`, `Ch`, `Cart`.
- Produces: якоря `#how`, `#custom` (используются шапкой и страницей шаблона); контейнер формы `form#lead` (логика — Task 6).
- [ ] **Step 1: Сверстать блоки по спеке §6.1** в порядке: прелоадер (рамка рисуется + сканер с % ≤1,5 с, один раз за сессию — `sessionStorage['ch.pl']`), Hero (заголовок CHERTYOZH / подзаголовок, большое превью `kofeynya`, штамп «Лист 01 · Масштаб 1:1 · Шаблонов: 7 · Формат: HTML/Figma/Bot», кнопки «Смотреть каталог» → `catalog.html`, «Сделать под ключ» → `#custom`), `1.1` каталог-превью (4 карточки: 3 `ready` + `studiya`, «Весь каталог»), `2.1–2.3` как это работает, `3.1` под ключ (`form#lead`: имя, контакт, что нужно; строка «Сделано в MOONLIGHT»), FAQ (4 вопроса, `<details>`), подвал.
- [ ] **Step 2: Карточка товара** — общая функция `renderCard(item): HTMLElement` в `site/js/card.js` (Create; используется Task 4): превью, `sheet`, название, тип, цена `Ch.price`, кнопки «Демо» (если `ready`, `target=_blank`) и «В корзину» (`Cart.add`, текст меняется на «В корзине» при `Cart.has`). Перерисовка на `Ch.onLang` и `cart:change`.
- [ ] **Step 3: Проверить:** `document.querySelectorAll('.card').length` → `4`; клик «В корзину» у первой карточки → `.cart-link__count` = `1`; повторный заход в той же вкладке — прелоадера нет; при эмуляции reduced motion — прелоадер не показывается.
- [ ] **Step 4:** `check.ps1` OK, консоль чистая, скриншоты 360/1280 светлая/тёмная, RU/EN.

### Task 4: Каталог

**Files:**
- Create: `site/catalog.html`, `site/js/pages/catalog.js`
- Modify: `site/css/sheet.css` (сетка каталога, «стопка листов» ≥1024px), `site/js/i18n.js`

**Interfaces:**
- Consumes: `renderCard(item)`, `Reveal.observe`, `CATALOG`.
- [ ] **Step 1:** Вкладки `Все / Лендинги / Figma / Боты` (`button[data-type]` = `all|landing|figma|bot`, `aria-pressed`), состояние в `?type=` через `history.replaceState`; неизвестный `type` → `all`.
- [ ] **Step 2:** На ≥1024px карточки с отрицательным отступом слегка перекрывают друг друга, при `:hover`/`:focus-within` лист поднимается и раскрывается; <1024px — обычная сетка/колонка.
- [ ] **Step 3: Проверить:** открыть `catalog.html?type=bot` → `.card` = `2`; клик «Figma» → `.card` = `2` и `location.search` = `"?type=figma"`; `catalog.html?type=xxx` → `.card` = `7`.
- [ ] **Step 4:** `check.ps1` OK, консоль чистая, скриншоты 360/1280.

### Task 5: Страница шаблона

**Files:**
- Create: `site/template.html`, `site/js/pages/template.js`
- Modify: `site/css/sheet.css`, `site/js/i18n.js`

**Interfaces:**
- Consumes: `CATALOG.byId`, `Reveal.mount(el, item, {big:true})`, `Cart`, `Ch`.
- [ ] **Step 1:** По `?id=` выводит: большое превью, `sheet`, название, тип, описание, «Что внутри» (`inside`), «Подойдёт для» (`fit`), цена, «Открыть живое демо» (только `ready`, `target=_blank rel=noopener`), «В корзину», блок «Нужно под ключ? → `index.html#custom`». `document.title` = название товара.
- [ ] **Step 2:** Нет `id` или `CATALOG.byId` вернул `undefined` → секция «Лист не найден» + ссылка `catalog.html`.
- [ ] **Step 3: Проверить:** `template.html?id=bot-shop` → `h1` содержит «Бот-магазин»; `Ch.setLang('en')` → цена `"$99"` и `h1` на EN без перезагрузки; `template.html?id=nope` и `template.html` → есть `.not-found`, консоль чистая.
- [ ] **Step 4:** `check.ps1` OK, скриншоты 360/1280.

### Task 6: Корзина, оформление и форма «Под ключ»

**Files:**
- Create: `site/cart.html`, `site/js/pages/cart.js`, `site/js/form-ui.js`
- Modify: `site/js/pages/home.js` (подключить `form#lead`), `site/css/styles.css`, `site/js/i18n.js`

**Interfaces:**
- Consumes: `Cart`, `CATALOG.byId`, `Ch.sum`, `Forms.submitOrder/submitLead`.
- Produces: `FormUI.bind(form: HTMLFormElement, submit: (data)=>Promise, onDone: ()=>void)` — валидация (`required`, email-регэксп `^[^\s@]+@[^\s@]+\.[^\s@]+$`), ошибки в `.field__error` с `aria-invalid`, на время отправки кнопка `disabled` + текст «Отправляем…», повторные сабмиты игнорируются, после успеха — `onDone()`.
- [ ] **Step 1:** Корзина: id, которых нет в каталоге, удаляются из `Cart` при рендере; строки (лист, название, тип, цена, «Убрать»), итог `Ch.sum`; пустая — «Корзина пуста» + ссылка в каталог; плашка «Демонстрационный магазин: оплата не списывается».
- [ ] **Step 2:** Форма: email (обязательно), Telegram (необязательно), чекбокс согласия (обязательно), «Оформить» → `FormUI.bind(..., Forms.submitOrder, …)` → экран «Заявка принята (демо). Мы свяжемся с вами по email» и `Cart.clear()`.
- [ ] **Step 3:** `form#lead` на главной: то же через `Forms.submitLead`, успех заменяет форму сообщением.
- [ ] **Step 4: Проверить:** `localStorage.setItem('ch.cart','["kofeynya","ghost"]')`, перезагрузка `cart.html` → строк `1`, `Cart.ids()` → `["kofeynya"]`; `Ch.setLang('en')` → итог `"$69"`; сабмит с `email=abc` → видна `.field__error`, успеха нет; корректный email + двойной клик → ровно один экран успеха, `Cart.count()` → `0`; `form#lead` с пустым контактом → ошибка.
- [ ] **Step 5:** `check.ps1` OK, консоль чистая, скриншоты 360/1280.

### Task 7: Общая полоска демо + демо «Кофейня» (лендинг)

**Files:**
- Create: `site/templates/_shared/demo-bar.css`, `site/templates/_shared/demo-bar.js`, `site/templates/_shared/i18n-demo.js` (тексты полоски)
- Create: `site/templates/kofeynya/index.html`, `style.css`, `script.js`, `i18n.js`

**Interfaces:**
- Produces: `DemoBar.init({id})` — полоска сверху «Демо шаблона Chertyozh · ← Назад (`../../template.html?id=<id>`) · Купить (`Cart.add` через тот же ключ `localStorage['ch.cart']` → переход `../../cart.html`)», язык из `localStorage['ch.lang']`, переключатель RU/EN демо; применяет `data-i18n` по словарю демо.
- [ ] **Step 1:** Лендинг вымышленной кофейни (своя палитра и шрифты — системные/Google на усмотрение, не стиль Chertyozh): шапка с якорным меню и бургером на мобильном, hero, меню с категориями-вкладками, акция, отзывы, адрес/часы, подвал. Картинки — CSS/SVG, без внешних фото.
- [ ] **Step 2: Проверить:** `templates/kofeynya/` открывается, есть `.demo-bar`; «Купить» → `cart.html` с 1 строкой «Кофейня»; RU→EN в полоске переводит и демо; бургер на 360px открывает меню.
- [ ] **Step 3:** `check.ps1` OK, консоль чистая, скриншоты 360/1280.

### Task 8: Демо «Магазин: мобильная версия» (Figma-макет)

**Files:**
- Create: `site/templates/shop-mobile/index.html`, `style.css`, `script.js`, `i18n.js`

**Interfaces:**
- Consumes: `DemoBar.init({id:'shop-mobile'})`.
- [ ] **Step 1:** «Холст Figma»: серое поле, 5 кадров-экранов 375×812 (Главная, Каталог, Товар, Корзина, Оформление) в HTML/CSS, подписи кадров как в Figma (`iPhone 14 — Главная`), панорамирование перетаскиванием и колесом, зум кнопками ±/«Вписать»; клик по кадру — увеличение кадра поверх (Esc/клик — закрыть). На мобильном — кадры вертикальной лентой без панорамирования.
- [ ] **Step 2: Проверить:** кадров `.frame` = `5`; клик по кадру → есть `.frame-zoom`, `Escape` → нет; на 360px горизонтального скролла страницы нет.
- [ ] **Step 3:** `check.ps1` OK, консоль чистая, скриншоты 360/1280.

### Task 9: Демо «Бот-магазин» (Telegram-бот, макет)

**Files:**
- Create: `site/templates/bot-shop/index.html`, `style.css`, `script.js`, `i18n.js`

**Interfaces:**
- Consumes: `DemoBar.init({id:'bot-shop'})`.
- Produces: сценарий как данные `const FLOW = { [nodeId]: { text:{ru,en}, buttons:[{label:{ru,en}, to:nodeId}] } }`, старт `start`; узлы: start → catalog → category → product → cart → order → done.
- [ ] **Step 1:** Рамка телефона, шапка чата (аватар, «бот»), пузыри сообщений, inline-кнопки под сообщением бота; клик по кнопке → пузырь пользователя с текстом кнопки, «печатает…» 500 мс, ответ бота; «Перезапустить» сбрасывает в `start`. Рядом на десктопе — короткое описание «что умеет бот».
- [ ] **Step 2: Проверить:** после загрузки 1 сообщение бота; пройти до `done` кликами → последний пузырь содержит текст узла `done`; «Перезапустить» → снова 1 сообщение.
- [ ] **Step 3:** `check.ps1` OK, консоль чистая, скриншоты 360/1280.

### Task 10: Превью-скриншоты, финальная проверка, ревью

**Files:**
- Create: `site/assets/previews/kofeynya.jpg`, `shop-mobile.jpg`, `bot-shop.jpg`

- [ ] **Step 1:** Во встроенном браузере при окне 1280×800 открыть каждое демо, скрыть полоску (`document.querySelector('.demo-bar').remove()`), снять скриншот; скопировать файл скриншота из папки результатов инструмента в `site/assets/previews/<id>.jpg`.
- [ ] **Step 2: Проверить:** на главной и в каталоге `.pv__img` у 3 готовых шаблонов загружены (`naturalWidth > 0`), прорисовка показывает скриншот.
- [ ] **Step 3: Сквозной сценарий из спеки §9:** каталог → «Боты» → «Бот-магазин» → демо → «Купить» → корзина → оформить → «Заявка принята (демо)». Режимы «Авто/Чертёж/Готово», RU/EN, светлая/тёмная, 360/1280 — скриншоты главной, каталога, шаблона, корзины и трёх демо.
- [ ] **Step 4:** `check.ps1` OK на всём `site/`; консоль чистая на всех страницах.
- [ ] **Step 5:** Ревью агентом `site-reviewer` (дифф против спеки и доски); исправить замечания по корректности.
