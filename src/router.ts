import type { ViewRenderer } from './types';
import { $, $$ } from './utils/dom';

const routes = new Map<string, ViewRenderer>();
let defaultRoute = 'dashboard';

export function registerRoute(name: string, renderer: ViewRenderer): void {
  routes.set(name, renderer);
}

export function setDefaultRoute(name: string): void {
  defaultRoute = name;
}

async function dispatch(): Promise<void> {
  const name = location.hash.replace('#/', '') || defaultRoute;
  $$('.nav-links a').forEach(a => {
    const link = a as HTMLAnchorElement;
    link.classList.toggle('active', link.dataset.route === name);
  });
  const renderer = routes.get(name) ?? routes.get(defaultRoute);
  if (renderer) {
    try {
      await renderer();
    } catch (err) {
      $('view').innerHTML = `<p style="color:var(--red);padding:2rem">⚠ ${(err as Error).message}</p>`;
    }
  }
}

export function initRouter(): void {
  window.addEventListener('hashchange', dispatch);
  void dispatch();
}
