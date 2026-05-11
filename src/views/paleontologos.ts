import { api } from '../api';
import { $, $$, escapeHtml } from '../utils/dom';
import { openModal } from '../utils/modal';
import { toast } from '../utils/toast';
import type { Paleontologo, PaleontologoDetalle } from '../types';

export async function renderPaleontologos(): Promise<void> {
  $('view').innerHTML = `
    <div class="page-header">
      <div><h2>👨‍🔬 Paleontólogos</h2><p>Investigadores y sus estudios sobre la base de datos</p></div>
    </div>
    <div id="paleoGrid" class="paleo-grid"><div class="loading">Cargando…</div></div>
  `;
  try {
    const list = await api.paleontologos();
    $('paleoGrid').innerHTML = list.map(cardHTML).join('');
    $$<HTMLElement>('.paleo-card').forEach(c =>
      c.addEventListener('click', () => void showDetail(c.dataset.id!))
    );
  } catch (e) {
    $('paleoGrid').innerHTML = `<p style="color:var(--red)">⚠ ${(e as Error).message}</p>`;
  }
}

function cardHTML(p: Paleontologo): string {
  return `
    <div class="paleo-card" data-id="${p.paleontologo_id}">
      <div class="avatar">${escapeHtml(p.nombre[0] + p.apellido[0])}</div>
      <h4>${escapeHtml(p.nombre + ' ' + p.apellido)}</h4>
      <div class="nationality">${escapeHtml(p.nacionalidad || '')}${p.fecha_nacimiento ? ' · ' + p.fecha_nacimiento.slice(0, 4) : ''}</div>
      <div class="studies">${p.total_estudios ?? 0} estudio${(p.total_estudios ?? 0) !== 1 ? 's' : ''}</div>
      <small style="color:var(--muted);font-size:.75rem">${escapeHtml(p.email || '')}</small>
    </div>`;
}

async function showDetail(id: string): Promise<void> {
  try {
    const p = await api.paleontologo(id);
    openModal(detailHTML(p));
  } catch (e) { toast((e as Error).message, true); }
}

function detailHTML(p: PaleontologoDetalle): string {
  return `
    <div class="detail">
      <h2>${escapeHtml(p.nombre + ' ' + p.apellido)}</h2>
      <div class="sci">${escapeHtml(p.nacionalidad || '')}${p.fecha_nacimiento ? ' · n. ' + p.fecha_nacimiento.slice(0,10) : ''}</div>
      <div class="info-grid">
        <div><strong>Email</strong>${escapeHtml(p.email || '—')}</div>
        <div><strong>Estudios</strong>${p.estudios.length}</div>
      </div>
      <h3>📚 Estudios</h3>
      <ul>${p.estudios.map(e => `
        <li>
          <strong>${escapeHtml(e.nombre_comun || e.nombre_cientifico || '')}</strong> <em>(${escapeHtml(e.nombre_cientifico || '')})</em><br>
          ${escapeHtml(e.institucion || '')} · ${e.fecha_inicio ?? ''} → ${e.fecha_fin ?? 'en curso'}<br>
          <em>${escapeHtml(e.observaciones || '')}</em>
        </li>`).join('') || '<li>Sin estudios</li>'}</ul>
    </div>`;
}
