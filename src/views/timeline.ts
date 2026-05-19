import { api } from '../api';
import { $, $$, escapeHtml, formatNumber } from '../utils/dom';
import { openModal } from '../utils/modal';
import { toast } from '../utils/toast';
import type { TimelineItem } from '../types';

type Periodo = 'Triásico' | 'Jurásico' | 'Cretácico';

const PERIODOS: Periodo[] = ['Triásico', 'Jurásico', 'Cretácico'];
const RANGES: Record<Periodo, string> = {
  'Triásico': '251.9–201.3 Ma',
  'Jurásico': '201.3–145.0 Ma',
  'Cretácico': '145.0–66.0 Ma',
};
const PERIOD_CLASSES: Record<Periodo, string> = {
  'Triásico': 'triasico', 'Jurásico': 'jurasico', 'Cretácico': 'cretacico',
};

export async function renderTimeline(): Promise<void> {
  $('view').innerHTML = `
    <div class="page-header">
      <div><h2>⏳ Línea de tiempo del Mesozoico</h2><p>Distribución de especies a través de los tres grandes períodos</p></div>
    </div>
    <div class="timeline-wrap"><div class="loading">Cargando…</div></div>
  `;
  try {
    const items = await api.timeline();
    const grouped = groupByPeriod(items);
    document.querySelector('.timeline-wrap')!.innerHTML = buildTimelineHTML(grouped);

    $$<HTMLElement>('.timeline-item').forEach(t =>
      t.addEventListener('click', () => void showDinoDetail(t.dataset.id!))
    );
  } catch (e) {
    document.querySelector('.timeline-wrap')!.innerHTML =
      `<p style="color:var(--red)">⚠ ${(e as Error).message}</p>`;
  }
}

function groupByPeriod(items: TimelineItem[]): Record<Periodo, TimelineItem[]> {
  const out: Record<Periodo, TimelineItem[]> = { 'Triásico': [], 'Jurásico': [], 'Cretácico': [] };
  items.forEach(i => {
    if (i.periodo in out) out[i.periodo as Periodo].push(i);
  });
  return out;
}

function buildTimelineHTML(grouped: Record<Periodo, TimelineItem[]>): string {
  return `
    <div class="timeline">
      <div class="timeline-axis">
        ${PERIODOS.map(p => `
          <div class="period-block ${PERIOD_CLASSES[p]}">
            <h4>${p}</h4><small>${RANGES[p]}</small>
            <div style="margin-top:.5rem;color:var(--accent);font-weight:bold">${grouped[p].length} especies</div>
          </div>
        `).join('')}
      </div>
      <div class="timeline-rows">
        ${PERIODOS.map(p => `
          <div class="timeline-col">
            ${grouped[p].map(itemHTML).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function itemHTML(d: TimelineItem): string {
  return `
    <div class="timeline-item" data-id="${d.dinosaurio_id}">
      <div class="name">${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</div>
      <div class="sci">${escapeHtml(d.nombre_cientifico)}</div>
      <div class="info">${escapeHtml(d.dieta)} · ${d.longitud_m ?? '—'}m · ${d.peso_kg ? formatNumber(d.peso_kg) + ' kg' : '—'}</div>
    </div>`;
}

async function showDinoDetail(id: string): Promise<void> {
  try {
    const d = await api.dinosaurio(id);
    openModal(`
      <div class="detail">
        <h2>${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</h2>
        <div class="sci">${escapeHtml(d.nombre_cientifico)}</div>
        <p class="desc">${escapeHtml(d.descripcion || '')}</p>
        <div class="info-grid">
          <div><strong>Período</strong>${escapeHtml(d.periodo_nombre)}</div>
          <div><strong>Dieta</strong>${escapeHtml(d.dieta_tipo)}</div>
          <div><strong>Longitud</strong>${d.longitud_m ? d.longitud_m + ' m' : '—'}</div>
          <div><strong>Peso</strong>${d.peso_kg ? formatNumber(d.peso_kg) + ' kg' : '—'}</div>
        </div>
      </div>
    `);
  } catch (e) { toast((e as Error).message, true); }
}
