import { api, cache, type DinoFilters } from '../api';
import { $, escapeHtml, formatNumber, debounce } from '../utils/dom';
import { openModal, openForm, closeForm } from '../utils/modal';
import { toast } from '../utils/toast';
import type { Dinosaurio, DinosaurioDetalle, DinoFormData } from '../types';

const filters: DinoFilters = { q: '', periodo_id: '', dieta_id: '' };

export async function renderCatalogo(): Promise<void> {
  $('view').innerHTML = `
    <div class="page-header">
      <div><h2>🦕 Catálogo</h2><p>Explora y administra los dinosaurios registrados</p></div>
      <button id="btnNuevo">+ Nuevo dinosaurio</button>
    </div>
    <div class="toolbar">
      <div><label>Buscar<input id="qInput" placeholder="Nombre científico o común" /></label></div>
      <div><label>Período<select id="periodoSel"><option value="">Todos</option></select></label></div>
      <div><label>Dieta<select id="dietaSel"><option value="">Todas</option></select></label></div>
      <div><button class="ghost" id="btnLimpiar">Limpiar</button></div>
    </div>
    <div id="cards" class="cards"><div class="loading">Cargando…</div></div>
  `;

  const [periodos, dietas] = await Promise.all([cache.periodos.get(), cache.dietas.get()]);
  const periodoSel = $<HTMLSelectElement>('periodoSel');
  const dietaSel = $<HTMLSelectElement>('dietaSel');
  const qInput = $<HTMLInputElement>('qInput');

  periodos.forEach(p => periodoSel.insertAdjacentHTML('beforeend',
    `<option value="${p.periodo_id}">${escapeHtml(p.nombre)}</option>`));
  dietas.forEach(d => dietaSel.insertAdjacentHTML('beforeend',
    `<option value="${d.dieta_id}">${escapeHtml(d.tipo)}</option>`));

  periodoSel.value = String(filters.periodo_id ?? '');
  dietaSel.value = String(filters.dieta_id ?? '');
  qInput.value = String(filters.q ?? '');

  qInput.addEventListener('input', debounce((e: Event) => {
    filters.q = (e.target as HTMLInputElement).value;
    void loadCards();
  }));
  periodoSel.addEventListener('change', () => { filters.periodo_id = periodoSel.value; void loadCards(); });
  dietaSel.addEventListener('change', () => { filters.dieta_id = dietaSel.value; void loadCards(); });
  $('btnLimpiar').addEventListener('click', () => {
    filters.q = ''; filters.periodo_id = ''; filters.dieta_id = '';
    void renderCatalogo();
  });
  $('btnNuevo').addEventListener('click', () => void formDino());

  await loadCards();
}

async function loadCards(): Promise<void> {
  const container = $('cards');
  try {
    const dinos = await api.dinosaurios(filters);
    if (!dinos.length) {
      container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem">Sin resultados.</p>';
      return;
    }
    container.innerHTML = dinos.map(cardHTML).join('');
    container.querySelectorAll<HTMLElement>('.card').forEach(card => bindCardEvents(card));
  } catch (e) {
    container.innerHTML = `<p style="color:var(--red)">⚠ ${(e as Error).message}</p>`;
  }
}

function cardHTML(d: Dinosaurio): string {
  return `
    <article class="card" data-id="${d.dinosaurio_id}">
      <h3>${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</h3>
      <div class="sci">${escapeHtml(d.nombre_cientifico)}</div>
      <div class="badges">
        <span class="badge periodo">${escapeHtml(d.periodo_nombre)}</span>
        <span class="badge dieta">${escapeHtml(d.dieta_tipo)}</span>
      </div>
      <div class="meta">
        <div><strong>Longitud</strong>${d.longitud_m ? d.longitud_m + ' m' : '—'}</div>
        <div><strong>Peso</strong>${d.peso_kg ? formatNumber(d.peso_kg) + ' kg' : '—'}</div>
        <div><strong>Países</strong>${d.total_paises ?? 0}</div>
        <div><strong>Estudios</strong>${d.total_estudios ?? 0}</div>
      </div>
      <div class="actions">
        <button class="ghost" data-act="view">Ver</button>
        <button class="ghost" data-act="edit">Editar</button>
        <button class="danger" data-act="del">Eliminar</button>
      </div>
    </article>`;
}

function bindCardEvents(card: HTMLElement): void {
  const id = card.dataset.id!;
  card.querySelector('[data-act="view"]')!.addEventListener('click', e => {
    e.stopPropagation();
    void openDetail(id);
  });
  card.querySelector('[data-act="edit"]')!.addEventListener('click', e => {
    e.stopPropagation();
    void formDino(id);
  });
  card.querySelector('[data-act="del"]')!.addEventListener('click', async e => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este dinosaurio y sus relaciones?')) return;
    try {
      await api.deleteDinosaurio(id);
      toast('Eliminado');
      await loadCards();
    } catch (err) { toast((err as Error).message, true); }
  });
  card.addEventListener('click', () => void openDetail(id));
}

async function openDetail(id: string | number): Promise<void> {
  try {
    const d = await api.dinosaurio(id);
    openModal(detailHTML(d));
  } catch (e) { toast((e as Error).message, true); }
}

function detailHTML(d: DinosaurioDetalle): string {
  return `
    <div class="detail">
      <h2>${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</h2>
      <div class="sci">${escapeHtml(d.nombre_cientifico)}</div>
      <div class="badges">
        <span class="badge periodo">${escapeHtml(d.periodo_nombre)} (${d.inicio_ma}–${d.fin_ma} Ma)</span>
        <span class="badge dieta">${escapeHtml(d.dieta_tipo)}</span>
      </div>
      <p class="desc">${escapeHtml(d.descripcion || '')}</p>
      <div class="info-grid">
        <div><strong>Longitud</strong>${d.longitud_m ? d.longitud_m + ' m' : '—'}</div>
        <div><strong>Peso</strong>${d.peso_kg ? formatNumber(d.peso_kg) + ' kg' : '—'}</div>
        <div><strong>Altura</strong>${d.altura_m ? d.altura_m + ' m' : '—'}</div>
        <div><strong>Descubrimiento</strong>${d.fecha_descubrimiento ?? '—'}</div>
        <div><strong>Dieta</strong>${escapeHtml(d.dieta_descripcion || d.dieta_tipo)}</div>
      </div>
      <h3>🌍 Hallazgos (${d.paises.length})</h3>
      <ul>${d.paises.map(p =>
        `<li><strong>${escapeHtml(p.nombre)}</strong> · ${escapeHtml(p.continente)}${p.anio_hallazgo ? ' · ' + p.anio_hallazgo : ''}</li>`
      ).join('') || '<li>Sin registros</li>'}</ul>
      <h3>📚 Estudios (${d.estudios.length})</h3>
      <ul>${d.estudios.map(e => `
        <li>
          <strong>${escapeHtml(e.nombre + ' ' + e.apellido)}</strong> (${escapeHtml(e.nacionalidad || '—')})<br>
          ${escapeHtml(e.institucion || '')} · ${e.fecha_inicio ?? ''} → ${e.fecha_fin ?? 'en curso'}<br>
          <em>${escapeHtml(e.observaciones || '')}</em>
        </li>`).join('') || '<li>Sin estudios</li>'}</ul>
    </div>`;
}

async function formDino(id: string | null = null): Promise<void> {
  const [periodos, dietas] = await Promise.all([cache.periodos.get(), cache.dietas.get()]);
  const d: Partial<DinosaurioDetalle> = id ? await api.dinosaurio(id) : {};

  const container = document.createElement('div');
  container.innerHTML = `
    <h2>${id ? 'Editar dinosaurio' : 'Nuevo dinosaurio'}</h2>
    <div class="form-grid" style="margin-top:1.5rem">
      <label class="full">Nombre científico *<input name="nombre_cientifico" required value="${escapeHtml(d.nombre_cientifico ?? '')}" /></label>
      <label>Nombre común<input name="nombre_comun" value="${escapeHtml(d.nombre_comun ?? '')}" /></label>
      <label>Fecha descubrimiento<input type="date" name="fecha_descubrimiento" value="${d.fecha_descubrimiento ? d.fecha_descubrimiento.slice(0,10) : ''}" /></label>
      <label>Período *<select name="periodo_id" required>
        <option value="">…</option>
        ${periodos.map(p => `<option value="${p.periodo_id}" ${p.periodo_id === d.periodo_id ? 'selected' : ''}>${escapeHtml(p.nombre)}</option>`).join('')}
      </select></label>
      <label>Dieta *<select name="dieta_id" required>
        <option value="">…</option>
        ${dietas.map(di => `<option value="${di.dieta_id}" ${di.dieta_id === d.dieta_id ? 'selected' : ''}>${escapeHtml(di.tipo)}</option>`).join('')}
      </select></label>
      <label>Longitud (m)<input type="number" step="0.01" name="longitud_m" value="${d.longitud_m ?? ''}" /></label>
      <label>Peso (kg)<input type="number" step="0.01" name="peso_kg" value="${d.peso_kg ?? ''}" /></label>
      <label>Altura (m)<input type="number" step="0.01" name="altura_m" value="${d.altura_m ?? ''}" /></label>
      <label class="full">Descripción<textarea name="descripcion">${escapeHtml(d.descripcion ?? '')}</textarea></label>
      <div class="form-actions">
        <button class="ghost" type="button" data-action="cancel">Cancelar</button>
        <button type="button" data-action="save">${id ? 'Guardar cambios' : 'Crear'}</button>
      </div>
    </div>
  `;

  openForm(container);

  container.querySelector<HTMLButtonElement>('[data-action="cancel"]')!
    .addEventListener('click', closeForm);
  container.querySelector<HTMLButtonElement>('[data-action="save"]')!
    .addEventListener('click', async () => {
      const data = collectFormData(container);
      if (!data) return;
      try {
        if (id) await api.updateDinosaurio(id, data);
        else await api.createDinosaurio(data);
        toast(id ? 'Actualizado' : 'Creado');
        closeForm();
        await loadCards();
      } catch (e) { toast((e as Error).message, true); }
    });
}

function collectFormData(container: HTMLElement): DinoFormData | null {
  const get = (name: string): string => {
    const el = container.querySelector<HTMLInputElement>(`[name="${name}"]`);
    return el?.value ?? '';
  };
  const num = (name: string): number | null => {
    const v = get(name);
    return v === '' ? null : Number(v);
  };
  const nullable = (name: string): string | null => {
    const v = get(name);
    return v === '' ? null : v;
  };

  const nombre_cientifico = get('nombre_cientifico').trim();
  const periodo_id = Number(get('periodo_id'));
  const dieta_id = Number(get('dieta_id'));
  if (!nombre_cientifico || !periodo_id || !dieta_id) {
    toast('Faltan campos requeridos', true);
    return null;
  }

  return {
    nombre_cientifico,
    nombre_comun: nullable('nombre_comun'),
    longitud_m: num('longitud_m'),
    peso_kg: num('peso_kg'),
    altura_m: num('altura_m'),
    fecha_descubrimiento: nullable('fecha_descubrimiento'),
    periodo_id,
    dieta_id,
    descripcion: nullable('descripcion'),
  };
}
