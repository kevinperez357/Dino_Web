import L from 'leaflet';
import { api } from '../api';
import { $, escapeHtml } from '../utils/dom';
import type { MapaPais } from '../types';

const COUNTRY_COORDS: Record<string, [number, number]> = {
  'Argentina': [-38.4, -63.6],
  'Estados Unidos': [39.8, -98.6],
  'China': [35.9, 104.2],
  'Mongolia': [46.9, 103.8],
  'Tanzania': [-6.4, 34.9],
  'Reino Unido': [55.4, -3.4],
  'Canadá': [56.1, -106.3],
};

export async function renderMapa(): Promise<void> {
  $('view').innerHTML = `
    <div class="page-header">
      <div><h2>🗺 Mapa mundial de hallazgos</h2><p>Distribución geográfica de los fósiles registrados</p></div>
    </div>
    <div class="map-layout">
      <div id="map"></div>
      <div class="country-list">
        <h3 style="margin-bottom:1rem">Países (por nº de hallazgos)</h3>
        <div id="countryList"><div class="loading">Cargando…</div></div>
      </div>
    </div>
  `;

  try {
    const data = await api.mapa();
    initLeafletMap(data);
    renderCountryList(data);
  } catch (e) {
    $('view').insertAdjacentHTML('beforeend',
      `<p style="color:var(--red)">⚠ ${(e as Error).message}</p>`);
  }
}

function initLeafletMap(data: MapaPais[]): void {
  const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  data.forEach(c => {
    const coord = COUNTRY_COORDS[c.nombre];
    if (!coord || !c.total) return;
    const radius = 8 + c.total * 3;
    L.circleMarker(coord, {
      radius, color: '#7ee787', fillColor: '#7ee787', fillOpacity: 0.5, weight: 2,
    }).addTo(map).bindPopup(`
      <strong>${escapeHtml(c.nombre)}</strong> (${escapeHtml(c.continente)})<br>
      ${c.total} hallazgo${c.total > 1 ? 's' : ''}<br>
      <em>${c.dinosaurios.map(escapeHtml).join(', ')}</em>
    `);
  });
}

function renderCountryList(data: MapaPais[]): void {
  $('countryList').innerHTML = data.map(c => `
    <div class="country-item">
      <h4>${escapeHtml(c.nombre)} <small>· ${escapeHtml(c.continente)}</small></h4>
      <small>${c.total} hallazgo${c.total !== 1 ? 's' : ''}</small>
      <div class="dinos">${c.dinosaurios.map(d => `<span>${escapeHtml(d)}</span>`).join('')
        || '<em style="color:var(--muted)">Sin hallazgos</em>'}</div>
    </div>
  `).join('');
}
