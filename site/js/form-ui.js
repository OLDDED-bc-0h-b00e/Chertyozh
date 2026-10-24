/* Формы: проверка полей, ошибки у полей, защита от двойной отправки. */
(() => {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function errorEl(input) {
    const box = input.closest('.field') || input.closest('.check-field');
    return box && box.querySelector('.field__error');
  }

  function setError(input, key) {
    const err = errorEl(input);
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
    if (!err) return;
    err.textContent = key ? Ch.t(key) : '';
    err.dataset.key = key || '';
    // текст ошибки зачитывается вместе с полем
    if (!err.id) err.id = (input.id || input.name) + '-err';
    if (key) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
  }

  function validate(form) {
    let first = null;
    form.querySelectorAll('input, textarea').forEach(input => {
      let key = '';
      if (input.type === 'checkbox') { if (input.required && !input.checked) key = 'form.errConsent'; }
      else {
        const v = input.value.trim();
        if (input.required && !v) key = 'form.errRequired';
        else if (v && input.type === 'email' && !EMAIL.test(v)) key = 'form.errEmail';
      }
      setError(input, key);
      if (key && !first) first = input;
    });
    if (first) first.focus();
    return !first;
  }

  window.FormUI = {
    bind(form, submit, onDone) {
      const btn = form.querySelector('[type="submit"]');
      const label = btn.querySelector('[data-i18n]') || btn;
      let busy = false;

      form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, ''); });

      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (busy || !validate(form)) return;
        busy = true;
        btn.disabled = true;
        const key = label.dataset.i18n;
        label.textContent = Ch.t('form.sending');
        try {
          const data = Object.fromEntries(new FormData(form));
          await submit(data);
          onDone(data);
        } finally {
          busy = false;
          btn.disabled = false;
          label.textContent = Ch.t(key);
        }
      });

      // перевод уже показанных ошибок при смене языка
      Ch.onLang(() => form.querySelectorAll('.field__error').forEach(err => { if (err.dataset.key) err.textContent = Ch.t(err.dataset.key); }));
    },
  };
})();
