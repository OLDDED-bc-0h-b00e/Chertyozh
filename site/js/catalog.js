/* Каталог шаблонов. Цены: rub — для RU, usd — для EN. ready — есть живое демо и превью. */
window.CATALOG = [
  {
    id: 'vitrina', sheet: 'Л-01', type: 'landing', price: { rub: 2900, usd: 39 }, ready: false, demo: null, preview: null,
    title: { ru: 'Витрина', en: 'Showcase' },
    desc: {
      ru: 'Простой лендинг магазина одежды или товаров: главный баннер, витрина товаров, условия доставки и контакты.',
      en: 'A simple landing page for a clothing or goods store: hero banner, product grid, delivery terms and contacts.'
    },
    inside: {
      ru: ['Одна страница, 6 блоков', 'Адаптив от 360px', 'Цвета и шрифты в переменных CSS', 'Инструкция по замене текстов'],
      en: ['One page, 6 sections', 'Responsive from 360px', 'Colors and fonts in CSS variables', 'Guide to replacing the copy']
    },
    fit: { ru: 'Небольшой магазин, шоурум, бренд одежды.', en: 'A small shop, showroom or clothing brand.' }
  },
  {
    id: 'kofeynya', sheet: 'Л-02', type: 'landing', price: { rub: 4900, usd: 69 }, ready: true,
    demo: 'templates/kofeynya/', preview: 'assets/previews/kofeynya.jpg',
    title: { ru: 'Кофейня', en: 'Coffee House' },
    desc: {
      ru: 'Тёплый лендинг кофейни: меню по категориям, акция дня, отзывы гостей, адрес и часы работы.',
      en: 'A warm coffee house landing page: menu by category, deal of the day, guest reviews, address and opening hours.'
    },
    inside: {
      ru: ['Одна страница, 7 блоков', 'Меню с вкладками категорий', 'Мобильное меню-бургер', 'Иллюстрации без фото — легко заменить своими', 'Тексты на RU и EN'],
      en: ['One page, 7 sections', 'Menu with category tabs', 'Mobile burger menu', 'Illustrations, no photos — easy to swap for yours', 'Copy in RU and EN']
    },
    fit: { ru: 'Кофейня, пекарня, небольшое кафе.', en: 'A coffee shop, bakery or small café.' }
  },
  {
    id: 'studiya', sheet: 'Л-03', type: 'landing', price: { rub: 9900, usd: 129 }, ready: false, demo: null, preview: null,
    title: { ru: 'Студия', en: 'Studio' },
    desc: {
      ru: 'Выразительный лендинг мастера или студии: услуги, работы, цены и запись на свободное время, с анимациями.',
      en: 'A striking landing page for a master or studio: services, portfolio, prices and booking, with animations.'
    },
    inside: {
      ru: ['Одна страница, 8 блоков', 'Анимации при прокрутке', 'Форма записи', 'Галерея работ'],
      en: ['One page, 8 sections', 'Scroll animations', 'Booking form', 'Portfolio gallery']
    },
    fit: { ru: 'Барбершоп, маникюр, тату-студия, фотограф.', en: 'A barbershop, nail or tattoo studio, photographer.' }
  },
  {
    id: 'shop-mobile', sheet: 'Л-04', type: 'figma', price: { rub: 1490, usd: 19 }, ready: true,
    demo: 'templates/shop-mobile/', preview: 'assets/previews/shop-mobile.jpg',
    title: { ru: 'Магазин: мобильная версия', en: 'Shop: mobile version' },
    desc: {
      ru: 'Figma-макет мобильного магазина: 5 экранов от главной до оформления заказа. Отдайте дизайнеру — он перекрасит под ваш бренд.',
      en: 'A Figma mockup of a mobile store: 5 screens from home to checkout. Hand it to a designer to restyle for your brand.'
    },
    inside: {
      ru: ['5 экранов 375×812', 'Компоненты и стили цветов', 'Автолейауты', 'Сетка 4 колонки'],
      en: ['5 screens 375×812', 'Components and color styles', 'Auto layouts', '4-column grid']
    },
    fit: { ru: 'Интернет-магазин, которому нужна удобная мобильная версия.', en: 'An online store that needs a clean mobile version.' }
  },
  {
    id: 'company-site', sheet: 'Л-05', type: 'figma', price: { rub: 4990, usd: 69 }, ready: false, demo: null, preview: null,
    title: { ru: 'Сайт компании', en: 'Company website' },
    desc: {
      ru: 'Figma-макет сайта компании на 5 страниц: главная, услуги, кейсы, о нас, контакты. Десктоп и мобильная версия.',
      en: 'A 5-page company website in Figma: home, services, cases, about, contacts. Desktop and mobile.'
    },
    inside: {
      ru: ['5 страниц × 2 версии', 'UI-кит и стили', 'Сетка 12 колонок'],
      en: ['5 pages × 2 versions', 'UI kit and styles', '12-column grid']
    },
    fit: { ru: 'Сервисная компания, агентство, производство.', en: 'A service company, agency or manufacturer.' }
  },
  {
    id: 'bot-shop', sheet: 'Л-06', type: 'bot', price: { rub: 6900, usd: 99 }, ready: true,
    demo: 'templates/bot-shop/', preview: 'assets/previews/bot-shop.jpg',
    title: { ru: 'Бот-магазин', en: 'Shop bot' },
    desc: {
      ru: 'Telegram-бот магазина: каталог по категориям, карточка товара, корзина и оформление заказа прямо в чате.',
      en: 'A Telegram store bot: catalog by category, product card, cart and checkout right in the chat.'
    },
    inside: {
      ru: ['Сценарий диалога и тексты', 'Кнопки каталога и корзины', 'Код на Python (aiogram)', 'Инструкция по запуску'],
      en: ['Dialogue flow and copy', 'Catalog and cart buttons', 'Python code (aiogram)', 'Launch guide']
    },
    fit: { ru: 'Магазин, который продаёт через Telegram.', en: 'A store that sells via Telegram.' }
  },
  {
    id: 'bot-booking', sheet: 'Л-07', type: 'bot', price: { rub: 4900, usd: 69 }, ready: false, demo: null, preview: null,
    title: { ru: 'Бот записи', en: 'Booking bot' },
    desc: {
      ru: 'Telegram-бот записи: выбор услуги, мастера и времени, напоминание за день до визита.',
      en: 'A Telegram booking bot: pick a service, a master and a time slot, with a reminder the day before.'
    },
    inside: {
      ru: ['Сценарий записи', 'Календарь свободных слотов', 'Напоминания', 'Код на Python (aiogram)'],
      en: ['Booking flow', 'Free-slot calendar', 'Reminders', 'Python code (aiogram)']
    },
    fit: { ru: 'Салон, студия, частный мастер.', en: 'A salon, studio or independent master.' }
  }
];

window.CATALOG.byId = id => window.CATALOG.find(i => i.id === id);
