import type {
  Dieta, Periodo, Pais, Paleontologo, PaleontologoDetalle,
  Dinosaurio, DinosaurioDetalle, Stats, TimelineItem, MapaPais, DinoFormData
} from './types';

const API_BASE = 'http://localhost:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    method: opts.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

export interface DinoFilters {
  q?: string;
  periodo_id?: string | number;
  dieta_id?: string | number;
  min_peso?: number;
  max_peso?: number;
}

export const api = {
  health: () => request<{ ok: boolean }>('/health'),

  dietas: () => request<Dieta[]>('/dietas'),
  periodos: () => request<Periodo[]>('/periodos'),
  paises: () => request<Pais[]>('/paises'),

  paleontologos: () => request<Paleontologo[]>('/paleontologos'),
  paleontologo: (id: number | string) => request<PaleontologoDetalle>(`/paleontologos/${id}`),

  dinosaurios: (filters: DinoFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    const qs = params.toString();
    return request<Dinosaurio[]>(`/dinosaurios${qs ? '?' + qs : ''}`);
  },
  dinosaurio: (id: number | string) => request<DinosaurioDetalle>(`/dinosaurios/${id}`),
  createDinosaurio: (data: DinoFormData) =>
    request<{ dinosaurio_id: number }>('/dinosaurios', { method: 'POST', body: data }),
  updateDinosaurio: (id: number | string, data: DinoFormData) =>
    request<{ ok: boolean }>(`/dinosaurios/${id}`, { method: 'PUT', body: data }),
  deleteDinosaurio: (id: number | string) =>
    request<{ ok: boolean }>(`/dinosaurios/${id}`, { method: 'DELETE' }),

  stats: () => request<Stats>('/stats'),
  timeline: () => request<TimelineItem[]>('/timeline'),
  mapa: () => request<MapaPais[]>('/mapa'),
};

// Cache simple para catálogos que rara vez cambian
class Cache<T> {
  private value: T | null = null;
  constructor(private loader: () => Promise<T>) {}
  async get(): Promise<T> {
    if (this.value === null) this.value = await this.loader();
    return this.value;
  }
  invalidate() { this.value = null; }
}

export const cache = {
  dietas: new Cache(() => api.dietas()),
  periodos: new Cache(() => api.periodos()),
};
