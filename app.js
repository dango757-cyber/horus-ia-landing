'use strict';

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !opening;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

// Each situation pairs an illustrative follow-up with the result it is measured by.
const scenarios = {
  presupuestos: {
    kicker: 'Del «me lo pienso» al siguiente paso',
    title: 'Que un presupuesto no acabe en un cajón.',
    description: 'Retomamos el contacto en el momento acordado, ayudamos a resolver las dudas y dejamos claro cómo continuar.',
    benefits: ['Sabes qué propuestas siguen abiertas.', 'El cliente encuentra respuesta a sus dudas.', 'Tu equipo sabe cuándo volver a contactar.'],
    steps: [
      ['Envías el presupuesto', 'La propuesta queda pendiente de respuesta.'],
      ['Retomas la conversación', '«¿Te quedó alguna duda? Podemos verla contigo.»'],
      ['Resuelves lo que frena la decisión', 'El cliente necesita aclarar el alcance del servicio.'],
      ['Acordáis el siguiente paso', 'Una llamada para revisar la propuesta juntos.']
    ],
    note: 'El objetivo: que una oportunidad no se pierda por falta de contacto.',
    result: {
      title: 'Más consultas que llegan a venta',
      description: 'Revisamos cuántas oportunidades avanzan, cuántas se cierran y dónde se quedan atascadas.',
      measure: 'Consultas → ventas'
    }
  },
  citas: {
    kicker: 'De un hueco reservado a una cita atendida',
    title: 'Que tu agenda tenga menos sorpresas.',
    description: 'Ayudamos a confirmar las citas con tiempo y a retomar el contacto cuando el cliente necesita cambiar de día.',
    benefits: ['Sabes quién ha confirmado su asistencia.', 'El cliente puede avisar si no va a llegar.', 'Las citas pendientes tienen un siguiente paso.'],
    steps: [
      ['El cliente reserva una cita', 'Quedan acordados el día y la hora.'],
      ['Confirmas con antelación', '«Te esperamos el jueves. ¿Te sigue viniendo bien?»'],
      ['Detectas un cambio a tiempo', 'El cliente avisa de que necesita otro horario.'],
      ['La cita sigue adelante', 'Acordáis una nueva fecha que le encaja.']
    ],
    note: 'El objetivo: cuidar tu agenda y facilitar que el cliente acuda.',
    result: {
      title: 'Más citas que sí se aprovechan',
      description: 'Seguimos las confirmaciones, las ausencias y las citas recuperadas para cuidar tu agenda.',
      measure: 'Citas confirmadas y atendidas'
    }
  },
  clientes: {
    kicker: 'De una primera compra a una relación que continúa',
    title: 'Que quien ya te conoce tenga motivos para volver.',
    description: 'Te ayudamos a retomar la relación cuando tiene sentido: después de un servicio, ante una nueva necesidad o cuando toca volver.',
    benefits: ['Cuidas a quienes ya han confiado en ti.', 'Contactas con un motivo útil para el cliente.', 'Puedes medir quién vuelve a comprar o reservar.'],
    steps: [
      ['El cliente termina un servicio', 'Sabes qué necesitaba y cómo le has ayudado.'],
      ['Te interesas por su experiencia', '«¿Qué tal ha ido? ¿Hay algo en lo que podamos ayudarte?»'],
      ['Aparece una nueva necesidad', 'El cliente quiere revisar el servicio dentro de un mes.'],
      ['Acordáis volver a hablar', 'La relación continúa con un próximo contacto.']
    ],
    note: 'El objetivo: dar continuidad a la relación con un contacto relevante.',
    result: {
      title: 'Más clientes que vuelven',
      description: 'Comprobamos cuántos clientes retoman el contacto y vuelven a comprar o reservar.',
      measure: 'Compras y reservas repetidas'
    }
  }
};

document.querySelectorAll('[data-scenario]').forEach(button => {
  button.addEventListener('click', () => {
    const scenario = scenarios[button.dataset.scenario];
    document.querySelectorAll('[data-scenario]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelector('#scenario-kicker').textContent = scenario.kicker;
    document.querySelector('#scenario-title').textContent = scenario.title;
    document.querySelector('#scenario-description').textContent = scenario.description;
    const benefits = scenario.benefits.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    });
    document.querySelector('#scenario-benefits').replaceChildren(...benefits);
    const steps = scenario.steps.map(([title, description], index) => {
      const item = document.createElement('li');
      const last = index === scenario.steps.length - 1;
      if (last) item.className = 'journey-last';
      const marker = document.createElement('span');
      marker.className = 'journey-marker';
      marker.textContent = last ? '✓' : String(index + 1);
      const copy = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = title;
      const paragraph = document.createElement('p');
      paragraph.textContent = description;
      copy.append(heading, paragraph);
      item.append(marker, copy);
      return item;
    });
    document.querySelector('#journey-steps').replaceChildren(...steps);
    document.querySelector('#journey-note').textContent = scenario.note;
    document.querySelector('#result-title').textContent = scenario.result.title;
    document.querySelector('#result-description').textContent = scenario.result.description;
    document.querySelector('#result-measure').textContent = scenario.result.measure;
  });
});

// The brand film is the hero background: it plays only while visible, with a pause control and reduced motion support.
const brandVideo = document.querySelector('#horus-video');
const videoToggle = document.querySelector('#video-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let videoInView = false;
let userPlaybackPreference = null;

function updateVideoControl() {
  const playing = !brandVideo.paused;
  videoToggle.dataset.playing = String(playing);
  videoToggle.setAttribute('aria-label', playing ? 'Pausar el vídeo de fondo' : 'Reproducir el vídeo de fondo');
}
function syncVideoPlayback() {
  const shouldPlay = videoInView && !document.hidden && (userPlaybackPreference ?? !motionPreference.matches);
  if (shouldPlay) brandVideo.play().catch(updateVideoControl);
  else brandVideo.pause();
}
videoToggle.addEventListener('click', () => {
  userPlaybackPreference = brandVideo.paused;
  syncVideoPlayback();
});
brandVideo.addEventListener('play', updateVideoControl);
brandVideo.addEventListener('pause', updateVideoControl);
brandVideo.addEventListener('error', () => {
  videoToggle.hidden = true;
});
motionPreference.addEventListener('change', () => {
  userPlaybackPreference = null;
  syncVideoPlayback();
});
document.addEventListener('visibilitychange', syncVideoPlayback);
new IntersectionObserver(entries => {
  videoInView = entries[0].isIntersecting;
  syncVideoPlayback();
}, { threshold: 0.15 }).observe(brandVideo);

// The example conversation plays once, in order, when it scrolls into view.
const thread = document.querySelector('#thread');
const threadObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  thread.classList.add('is-in');
  threadObserver.disconnect();
}, { threshold: 0.35 });
threadObserver.observe(thread);
