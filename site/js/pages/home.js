/* Главная: большое превью в Hero и превью каталога. */
(() => {
  const hero = document.getElementById('hero-pv');
  if (hero) Reveal.mount(hero, CATALOG.byId('kofeynya'), { big: true, autoplay: true });

  const grid = document.getElementById('home-catalog');
  if (grid) ['kofeynya', 'shop-mobile', 'bot-shop', 'studiya'].forEach(id => grid.append(renderCard(CATALOG.byId(id))));

  // форма «Под ключ»: заглушка отправки, после успеха форма заменяется сообщением
  const lead = document.getElementById('lead');
  if (lead) FormUI.bind(lead, Forms.submitLead, () => {
    const done = document.createElement('div');
    done.className = 'form-done';
    done.setAttribute('role', 'status');
    done.innerHTML = '<span class="num">✓</span><h3 data-i18n="lead.doneTitle"></h3><p data-i18n="lead.doneText"></p>';
    done.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = Ch.t(el.dataset.i18n); });
    lead.replaceWith(done);
  });
})();
