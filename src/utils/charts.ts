import { Chart, type ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

const instances = new Map<string, Chart>();

export function makeChart(canvasId: string, config: ChartConfiguration): void {
  const existing = instances.get(canvasId);
  if (existing) existing.destroy();
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;
  instances.set(canvasId, new Chart(canvas, config));
}

export function destroyAllCharts(): void {
  instances.forEach(c => c.destroy());
  instances.clear();
}

export function defaultChartOptions(showLegend: boolean): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend, position: 'bottom', labels: { color: '#8b949e' } },
    },
    scales: showLegend
      ? {}
      : {
          x: { ticks: { color: '#8b949e' }, grid: { color: '#2a3441' } },
          y: { ticks: { color: '#8b949e' }, grid: { color: '#2a3441' }, beginAtZero: true },
        },
  };
}

export const CHART_COLORS = ['#7ee787', '#58a6ff', '#f0883e', '#bc8cff', '#f85149', '#d2a8ff'];
