import { $ } from './dom';

let timer: number | undefined;

export function toast(message: string, isError = false): void {
  const el = $('toast');
  el.textContent = message;
  el.className = 'toast show' + (isError ? ' error' : '');
  if (timer) clearTimeout(timer);
  timer = window.setTimeout(() => el.classList.remove('show'), 3000);
}
