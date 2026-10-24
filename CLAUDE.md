# Проект: Chertyozh — магазин шаблонов (пет-проект)

Контекст для Claude. Держи файл коротким: только то, без чего Claude ошибётся. Обновляй, когда принимаются решения.

## Статус
- Магазин цифровых шаблонов в стиле «технический чертёж на бумаге». Описание: `docs/specs/2026-10-24-chertyozh-design.md`, план: `docs/superpowers/plans/`.
- Этап 1 сделан (сайт + демо kofeynya, shop-mobile, bot-shop). Этап 2 — остальные 4 демо. Оплата и отправка заявок — заглушки в `site/js/forms.js`.
- Репозиторий: https://github.com/OLDDED-bc-0h-b00e/Chertyozh, ветка `main`. Коммиты по-английски, коротко. Push в `main` → GitHub Actions (`.github/workflows/pages.yml`) деплоит папку `site/` на https://oldded-bc-0h-b00e.github.io/Chertyozh/ (project-страница: пути только относительные).
- Google Fonts разрешены пользователем (Space Grotesk, JetBrains Mono; в демо — свои).

## Стек
- Статический сайт: чистые HTML / CSS / JS, без сборки и зависимостей (на машине нет Node и Python; Git есть: `C:\Program Files\Git\cmd\git.exe`).
- `site/index.html`, `site/css/styles.css`, `site/js/main.js`, `site/js/i18n.js` (тексты RU/EN, ключи = `data-i18n` / `data-i18n-attr` в HTML), `site/assets/`.
- Прочие библиотеки и CDN — только по согласованию. Без CDN сайт должен работать.

## Команды
- Превью: preview_start `site` (или `powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 3001`) → http://localhost:3001, доска идей → http://localhost:3001/canvas/. Порт 3001, чтобы не мешать проекту MOONLIGHT на 3000.
- Проверка: `powershell -NoProfile -ExecutionPolicy Bypass -File check.ps1` — пути, ключи i18n RU/EN, alt, битые ссылки. Запускается хуком после каждой правки в `site/`; если хук вернул ошибки — исправь.

## Среда Claude (`.claude/`)
- Скиллы: `brief` (прочитать доску и отвечать на ней карточками Claude), `site-check` (проверка в браузере), `/ship` (коммит и публикация — только по команде пользователя).
- Агент `site-reviewer` — независимое ревью диффа перед публикацией.
- Личные настройки — в `.claude/settings.local.json` (в .gitignore).

## Правила
- В начале работы читай доску (скилл `brief`). «Принято» — обязательно, «Не хочу» — не нарушать, «Вопросы» — отвечай карточкой Claude на доске или спрашивай в чате, не придумывай за пользователя.
- `brief/` — файлы пользователя. На доску добавляй только свои карточки типа `claude`, карточки пользователя не меняй.
- Сначала план, потом правки. Меняй минимум файлов.
- Любой новый текст — в оба языка в `i18n.js`.
- Стили через CSS-переменные в `:root`; тёмная тема — по `prefers-color-scheme` под `:root:not([data-theme="light"])` и продублирована в `:root[data-theme="dark"]` (кнопка темы, `site/js/theme.js` в `<head>`, ключ `ch.theme` общий с демо).
- Семантичная вёрстка, alt у картинок, адаптив от 360px, без горизонтального скролла.
- IMPORTANT: пути в `site/` только относительные (`css/...`, `./`), никаких `/...` от корня — тогда сайт заработает и на GitHub Pages, и на любом хостинге.
- Не коммить и не публикуй без явной просьбы.

## Определение «готово»
- `check.ps1` проходит, консоль браузера без ошибок.
- Вёрстка проверена глазами на 360px и 1280px (скилл `site-check`).
