import { api } from './api';
import { $ } from './utils/dom';
import { initModals } from './utils/modal';
import { initRouter, registerRoute } from './router';

import { renderDashboard } from './views/dashboard';
import { renderCatalogo } from './views/catalogo';
import { renderTimeline } from './views/timeline';
import { renderMapa } from './views/mapa';
import { renderPaleontologos } from './views/paleontologos';
import { renderComparador } from './views/comparador';

async function checkApiStatus(): Promise<void> {
  const status = $('apiStatus');
  try {
    await api.health();
    status.textContent = '● API conectada';
    status.className = 'api-status ok';
  } catch {
    status.textContent = '● API desconectada';
    status.className = 'api-status err';
  }
}

function bootstrap(): void {
  initModals();

  registerRoute('dashboard', renderDashboard);
  registerRoute('catalogo', renderCatalogo);
  registerRoute('timeline', renderTimeline);
  registerRoute('mapa', renderMapa);
  registerRoute('paleontologos', renderPaleontologos);
  registerRoute('comparador', renderComparador);

  initRouter();
  void checkApiStatus();
}

bootstrap();
