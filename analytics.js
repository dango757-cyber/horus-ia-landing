// Cookieless visit statistics with Umami, counted only on danielo.click (local copies are ignored).
// Clicks on elements with data-umami-event (agendar-llamada, abrir-chat, instagram, email, telefono,
// enviar-formulario) are counted automatically; agenda.js reports completed bookings as reserva-completada.
(() => {
  'use strict';
  const WEBSITE_ID = 'ddbe62bc-f5be-4351-9c52-be58ec32a72d';
  if (!WEBSITE_ID) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.dataset.websiteId = WEBSITE_ID;
  script.dataset.domains = 'danielo.click,www.danielo.click';
  document.head.appendChild(script);
})();
