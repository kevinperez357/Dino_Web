import { api } from './api';
import { $ } from './utils/dom';
import { initModals } from './utils/modal';
import { initRouter, registerRoute } from './router';
import { isAuthenticated, getSession, logout } from './auth';
import { renderLogin } from './views/login';

import { renderDashboard } from './views/dashboard';
import { renderCatalogo } from './views/catalogo';
import { renderTimeline } from './views/timeline';
import { renderMapa } from './views/mapa';
import { renderPaleontologos } from './views/paleontologos';
import { renderComparador } from './views/comparador';

const APP_SHELL = `
  <nav class="sidebar">
    <div class="brand">
      <span class="logo">🦖</span>
      <div>
        <h1>Dino Explorer</h1>
        <small>Era Mesozoica</small>
      </div>
    </div>
    <ul class="nav-links">
      <li><a href="#/dashboard" data-route="dashboard">📊 Dashboard</a></li>
      <li><a href="#/catalogo" data-route="catalogo">🦕 Catálogo</a></li>
      <li><a href="#/timeline" data-route="timeline">⏳ Línea de tiempo</a></li>
      <li><a href="#/mapa" data-route="mapa">🗺 Mapa de hallazgos</a></li>
      <li><a href="#/paleontologos" data-route="paleontologos">👨‍🔬 Paleontólogos</a></li>
      <li><a href="#/comparador" data-route="comparador">⚖ Comparador</a></li>
    </ul>
    <div class="user-box" id="userBox"></div>
    <div class="api-status" id="apiStatus">Conectando…</div>
  </nav>

  <main class="content" id="view"></main>

  <div id="modal" class="modal hidden">
    <div class="modal-content">
      <button class="close" data-close>&times;</button>
      <div id="modalBody"></div>
    </div>
  </div>

  <div id="formModal" class="modal hidden">
    <div class="modal-content">
      <button class="close" data-close>&times;</button>
      <div id="formBody"></div>
    </div>
  </div>

  <div class="toast" id="toast"></div>
`;

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

function renderUserBox(): void {
  const session = getSession();
  if (!session) return;
  const box = $('userBox');
  box.innerHTML = `
    <div class="user-info">
      <div class="avatar-mini">${session.nombre[0].toUpperCase()}</div>
      <div>
        <div class="user-name">${session.nombre}</div>
        <small>${session.email}</small>
      </div>
    </div>
    <button class="logout-btn" id="logoutBtn">Cerrar sesión</button>
  `;
  $('logoutBtn').addEventListener('click', () => {
    logout();
    location.hash = '';
    bootstrap();
  });
}

function startApp(): void {
  document.body.classList.remove('login-mode');
  document.body.innerHTML = APP_SHELL;

  initModals();

  registerRoute('dashboard', renderDashboard);
  registerRoute('catalogo', renderCatalogo);
  registerRoute('timeline', renderTimeline);
  registerRoute('mapa', renderMapa);
  registerRoute('paleontologos', renderPaleontologos);
  registerRoute('comparador', renderComparador);

  renderUserBox();
  initRouter();
  void checkApiStatus();
}

function bootstrap(): void {
  if (isAuthenticated()) {
    startApp();
  } else {
    renderLogin(() => startApp());
  }
}

bootstrap();
