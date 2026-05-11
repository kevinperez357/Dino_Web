import { api } from '../api';
import { $, $$, escapeHtml, formatNumber } from '../utils/dom';
import type { Dinosaurio } from '../types';

type SlotState = (number | null)[];

const slots: SlotState = [null, null, null];
let allDinos: Dinosaurio[] = [];

interface CompareField {
  label: string;
  get: (d: Dinosaurio) => string | number | null;
  numeric: boolean;
}

const FIELDS: CompareField[] = [
  { label: 'Período', get: d => d.periodo_nombre, numeric: false },
  { label: 'Dieta', get: d => d.dieta_tipo, numeric: false },
  { label: 'Longitud (m)', get: d => d.longitud_m, numeric: true },
  { label: 'Peso (kg)', get: d => d.peso_kg, numeric: true },
  { label: 'Países hallazgo', get: d => d.total_paises ?? 0, numeric: true },
  { label: 'Estudios', get: d => d.total_estudios ?? 0, numeric: true },
  { label: 'Descubrimiento', get: d => d.fecha_descubrimiento ?? '—', numeric: false },
];

export async function renderComparador(): Promise<void> {
  $('view').innerHTML = `
    <div class="page-header">
      <div><h2>⚖ Comparador de especies</h2><p>Selecciona hasta 3 dinosaurios para comparar</p></div>
    </div>
    <div class="compare-slots" id="slots"></div>
    <div id="compareTable"></div>
  `;
  allDinos = await api.dinosaurios();
  renderSlots();
}

function renderSlots(): void {
  $('slots').innerHTML = slots.map((id, i) => {
    if (id === null) return emptySlotHTML(i);
    const d = allDinos.find(x => x.dinosaurio_id === id);
    return d ? filledSlotHTML(d, i) : emptySlotHTML(i);
  }).join('');

  $$<HTMLSelectElement>('[data-slot]').forEach(sel => {
    sel.addEventListener('change', () => {
      const idx = Number(sel.dataset.slot);
      slots[idx] = sel.value ? Number(sel.value) : null;
      renderSlots();
    });
  });
  $$<HTMLButtonElement>('[data-clear]').forEach(btn => {
    btn.addEventListener('click', () => {
      slots[Number(btn.dataset.clear)] = null;
      renderSlots();
    });
  });

  renderCompareTable();
}

function emptySlotHTML(i: number): string {
  return `
    <div class="slot">
      <div class="slot-empty">Selecciona un dinosaurio</div>
      <select data-slot="${i}">
        <option value="">— Elige —</option>
        ${allDinos.map(d =>
          `<option value="${d.dinosaurio_id}">${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</option>`
        ).join('')}
      </select>
    </div>`;
}

function filledSlotHTML(d: Dinosaurio, i: number): string {
  return `
    <div class="slot filled">
      <button class="clear-btn" data-clear="${i}">×</button>
      <h3 style="color:var(--accent)">${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</h3>
      <div class="sci" style="font-style:italic;color:var(--muted);font-size:.85rem;margin:.3rem 0">${escapeHtml(d.nombre_cientifico)}</div>
      <div class="badges">
        <span class="badge periodo">${escapeHtml(d.periodo_nombre)}</span>
        <span class="badge dieta">${escapeHtml(d.dieta_tipo)}</span>
      </div>
    </div>`;
}

function renderCompareTable(): void {
  const selected = slots
    .map(id => id !== null ? allDinos.find(d => d.dinosaurio_id === id) : null)
    .filter((d): d is Dinosaurio => Boolean(d));

  const container = $('compareTable');
  if (selected.length < 2) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem">Selecciona al menos 2 para comparar.</p>';
    return;
  }

  container.innerHTML = `
    <div class="compare-table">
      <table>
        <thead>
          <tr>
            <th>Característica</th>
            ${selected.map(d => `<th>${escapeHtml(d.nombre_comun || d.nombre_cientifico)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${FIELDS.map(f => rowHTML(f, selected)).join('')}</tbody>
      </table>
    </div>`;
}

function rowHTML(field: CompareField, dinos: Dinosaurio[]): string {
  const values = dinos.map(field.get);
  let winnerIndex = -1;
  if (field.numeric) {
    const numbers = values.map(v => (typeof v === 'number' ? v : Number(v) || -Infinity));
    const max = Math.max(...numbers);
    if (max > 0) winnerIndex = numbers.indexOf(max);
  }

  return `
    <tr>
      <td><strong>${field.label}</strong></td>
      ${values.map((v, i) => {
        const display = v === null || v === undefined ? '—'
          : typeof v === 'number' ? formatNumber(v, 2)
          : escapeHtml(v);
        return `<td class="${i === winnerIndex ? 'winner' : ''}">${display}</td>`;
      }).join('')}
    </tr>`;
}
