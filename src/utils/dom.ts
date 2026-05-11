export function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} no encontrado`);
  return el as T;
}

export function $$<T extends Element = Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll(selector)) as T[];
}

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatNumber(n: number | null | undefined, decimals = 0): string {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString('es-ES', { maximumFractionDigits: decimals });
}

export function formatDate(s: string | null | undefined): string {
  if (!s) return '—';
  return s.slice(0, 10);
}

export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 300): T {
  let t: number | undefined;
  return ((...args: never[]) => {
    if (t) clearTimeout(t);
    t = window.setTimeout(() => fn(...args), delay);
  }) as T;
}
