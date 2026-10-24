/* Отправка заказов и заявок. Сейчас — заглушки: данные никуда не уходят.
   TODO: подключить Telegram / почту / оплату — менять только эти две функции. */
(() => {
  const fake = () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 600));

  window.Forms = {
    submitOrder(data) { return fake(data); },
    submitLead(data) { return fake(data); },
  };
})();
