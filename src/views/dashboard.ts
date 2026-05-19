import { api } from '../api';
import { $, formatNumber } from '../utils/dom';
import { makeChart, defaultChartOptions, CHART_COLORS } from '../utils/charts';
import type { Stats } from '../types';

export async function renderDashboard(): Promise<void> {
  const view = $('view');
  view.innerHTML = `
    <div class="page-header">
      <div><h2>📊 Dashboard</h2><p>Resumen general de la base de datos del Mesozoico</p></div>
    </div>
    <div class="loading">Cargando estadísticas…</div>
  `;

  let stats: Stats;
  try {
    stats = await api.stats();
  } catch (err) {
    view.innerHTML = `
      <div class="page-header"><h2>📊 Dashboard</h2></div>
      <div class="panel" style="color:var(--red)">⚠ ${(err as Error).message}. ¿Está el backend corriendo en :3000?</div>`;
    return;
  }

  view.innerHTML = buildDashboardHTML(stats);
  renderDashboardCharts(stats);
  renderTopLists(stats);
}

function buildDashboardHTML(s: Stats): string {
  const t = s.totales;
  return `
    <div class="page-header">
      <div><h2>📊 Dashboard</h2><p>Resumen general de la base de datos del Mesozoico</p></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="icon">🦖</div><div class="num">${t.dinosaurios}</div><div class="lbl">Dinosaurios</div></div>
      <div class="stat-card blue"><div class="icon">👨‍🔬</div><div class="num">${t.paleontologos}</div><div class="lbl">Paleontólogos</div></div>
      <div class="stat-card orange"><div class="icon">📚</div><div class="num">${t.estudios}</div><div class="lbl">Estudios</div></div>
      <div class="stat-card purple"><div class="icon">🌍</div><div class="num">${t.paises}</div><div class="lbl">Países</div></div>
      <div class="stat-card"><div class="icon">⚖</div><div class="num">${formatNumber(Math.round(t.peso_promedio))}</div><div class="lbl">kg peso medio</div></div>
      <div class="stat-card blue"><div class="icon">📏</div><div class="num">${Number(t.longitud_promedio).toFixed(1)}</div><div class="lbl">m longitud media</div></div>
    </div>
    <div class="grid-2">
      <div class="panel chart"><h3>Dinosaurios por período</h3><canvas id="chPeriodo"></canvas></div>
      <div class="panel chart"><h3>Distribución por dieta</h3><canvas id="chDieta"></canvas></div>
      <div class="panel chart"><h3>Hallazgos por continente</h3><canvas id="chContinente"></canvas></div>
      <div class="panel chart"><h3>Descubrimientos por década</h3><canvas id="chDecada"></canvas></div>
    </div>
    <div class="grid-2" style="margin-top:1.5rem">
      <div class="panel"><h3>🏋 Top 5 más pesados</h3><ul class="toplist" id="topPeso"></ul></div>
      <div class="panel"><h3>📐 Top 5 más largos</h3><ul class="toplist" id="topLong"></ul></div>
    </div>
  `;
}

function renderDashboardCharts(s: Stats): void {
  makeChart('chPeriodo', {
    type: 'bar',
    data: {
      labels: s.porPeriodo.map(p => p.nombre),
      datasets: [{ data: s.porPeriodo.map(p => p.total), backgroundColor: CHART_COLORS, borderRadius: 6 }],
    },
    options: defaultChartOptions(false),
  });
  makeChart('chDieta', {
    type: 'doughnut',
    data: {
      labels: s.porDieta.map(d => d.tipo),
      datasets: [{ data: s.porDieta.map(d => d.total), backgroundColor: CHART_COLORS }],
    },
    options: defaultChartOptions(true),
  });
  makeChart('chContinente', {
    type: 'polarArea',
    data: {
      labels: s.porContinente.map(c => c.continente),
      datasets: [{ data: s.porContinente.map(c => c.total), backgroundColor: CHART_COLORS.map(c => c + 'cc') }],
    },
    options: defaultChartOptions(true),
  });
  makeChart('chDecada', {
    type: 'line',
    data: {
      labels: s.hallazgosPorAnio.map(h => h.decada + 's'),
      datasets: [{
        label: 'Hallazgos',
        data: s.hallazgosPorAnio.map(h => h.total),
        borderColor: '#7ee787',
        backgroundColor: 'rgba(126,231,135,.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      }],
    },
    options: defaultChartOptions(false),
  });
}

function renderTopLists(s: Stats): void {
  const render = (id: string, items: { nombre_comun: string | null; nombre_cientifico: string; [k: string]: unknown }[], key: string, unit: string) => {
    $(id).innerHTML = items.map((d, i) => `
      <li>
        <div class="rank">${i + 1}</div>
        <div class="info">
          <div class="name">${d.nombre_comun || d.nombre_cientifico}</div>
          <div class="sci">${d.nombre_cientifico}</div>
        </div>
        <div class="val">${formatNumber(d[key] as number)} ${unit}</div>
      </li>`).join('');
  };
  render('topPeso', s.topPesos, 'peso_kg', 'kg');
  render('topLong', s.topLongitudes, 'longitud_m', 'm');
}
