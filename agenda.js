(() => {
  'use strict';

  const status = document.querySelector('#calendar-status');
  const message = document.querySelector('#calendar-message');
  const retry = document.querySelector('#calendar-retry');
  let ready = false;
  let timer;

  function showFallback(text) {
    if (ready) return;
    status.hidden = false;
    status.classList.add('is-delayed');
    message.textContent = text;
    retry.hidden = false;
  }

  function calendarReady() {
    ready = true;
    window.clearTimeout(timer);
    status.hidden = true;
    const frame = document.querySelector('#cal-booking-inline iframe');
    if (frame) frame.title = 'Reserva tu llamada de 15 minutos con HORUS IA';
  }

  retry.addEventListener('click', () => window.location.reload());
  timer = window.setTimeout(() => {
    showFallback('El calendario está tardando más de lo habitual. Puedes volver a cargarlo o abrirlo con el enlace de abajo.');
  }, 18000);

  // Official Cal.com embed queue; same account and event as the existing website.
  (function (C, A, L) {
    const push = (api, args) => api.q.push(args);
    const doc = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const args = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = doc.createElement('script');
        script.src = A;
        script.async = true;
        script.onerror = () => {
          window.clearTimeout(timer);
          showFallback('No se ha podido cargar el calendario. Puedes reintentarlo o abrirlo con el enlace de abajo.');
        };
        doc.head.appendChild(script);
        cal.loaded = true;
      }
      if (args[0] === L) {
        const api = function () { push(api, arguments); };
        const namespace = args[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          push(cal.ns[namespace], args);
          push(cal, ['initNamespace', namespace]);
        } else push(cal, args);
        return;
      }
      push(cal, args);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  window.Cal('init', '15min', { origin: 'https://cal.com' });
  const calendar = window.Cal.ns['15min'];
  calendar('on', { action: 'linkReady', callback: calendarReady });
  calendar('on', {
    action: 'linkFailed',
    callback: () => {
      window.clearTimeout(timer);
      showFallback('No se ha podido mostrar la disponibilidad. Prueba de nuevo o abre el calendario con el enlace de abajo.');
    }
  });
  calendar('inline', {
    elementOrSelector: '#cal-booking-inline',
    config: { layout: 'month_view', theme: 'dark' },
    calLink: 'daniel-gomez-ire516/15min'
  });
  calendar('ui', {
    theme: 'dark',
    cssVarsPerTheme: { dark: { 'cal-brand': '#3B8FE8' } },
    hideEventTypeDetails: false,
    layout: 'month_view'
  });
})();
