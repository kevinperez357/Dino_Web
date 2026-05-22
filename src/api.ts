// Cliente "API" 100% local: todos los datos viven en src/data.ts.
// Esto permite desplegar la web como sitio estático (GitHub Pages).
// Las operaciones CRUD persisten solo durante la sesión (en memoria).

import type {
  Dieta, Periodo, Pais, Paleontologo, PaleontologoDetalle,
  Dinosaurio, DinosaurioDetalle, Stats, TimelineItem, MapaPais, DinoFormData,
  Estudio,
} from './types';

import {
  dietas as dietasData,
  periodos as periodosData,
  paises as paisesData,
  paleontologos as paleontologosData,
  state,
  enrichDinosaurio,
} from './data';

export interface DinoFilters {
  q?: string;
  periodo_id?: string | number;
  dieta_id?: string | number;
  min_peso?: number;
  max_peso?: number;
}

// Simula latencia para que se vea natural
function delay<T>(value: T, ms = 80): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function matchesFilters(d: Dinosaurio, f: DinoFilters): boolean {
  if (f.q) {
    const q = String(f.q).toLowerCase();
    const hit = d.nombre_cientifico.toLowerCase().includes(q)
      || (d.nombre_comun?.toLowerCase().includes(q) ?? false);
    if (!hit) return false;
  }
  if (f.periodo_id && Number(f.periodo_id) !== d.periodo_id) return false;
  if (f.dieta_id && Number(f.dieta_id) !== d.dieta_id) return false;
  if (f.min_peso !== undefined && (d.peso_kg ?? -Infinity) < Number(f.min_peso)) return false;
  if (f.max_peso !== undefined && (d.peso_kg ?? Infinity) > Number(f.max_peso)) return false;
  return true;
}

export const api = {
  health: () => delay({ ok: true }, 20),

  dietas: (): Promise<Dieta[]> => delay([...dietasData].sort((a, b) => a.tipo.localeCompare(b.tipo))),
  periodos: (): Promise<Periodo[]> => delay([...periodosData].sort((a, b) => b.inicio_ma - a.inicio_ma)),

  paises: (): Promise<Pais[]> => {
    const out = paisesData.map(p => ({
      ...p,
      hallazgos: state.fosilPais.filter(fp => fp.pais_id === p.pais_id).length,
    }));
    out.sort((a, b) => (b.hallazgos ?? 0) - (a.hallazgos ?? 0) || a.nombre.localeCompare(b.nombre));
    return delay(out);
  },

  paleontologos: (): Promise<Paleontologo[]> => {
    const out = paleontologosData.map(p => ({
      ...p,
      total_estudios: state.estudios.filter(e => e.paleontologo_id === p.paleontologo_id).length,
    }));
    out.sort((a, b) =>
      (b.total_estudios ?? 0) - (a.total_estudios ?? 0) || a.apellido.localeCompare(b.apellido)
    );
    return delay(out);
  },

  paleontologo: (id: number | string): Promise<PaleontologoDetalle> => {
    const numId = Number(id);
    const pl = paleontologosData.find(p => p.paleontologo_id === numId);
    if (!pl) return Promise.reject(new Error('Paleontólogo no encontrado'));
    const estudios: Estudio[] = state.estudios
      .filter(e => e.paleontologo_id === numId)
      .map(e => {
        const dino = state.dinosaurios.find(d => d.dinosaurio_id === e.dinosaurio_id);
        return {
          ...e,
          nombre_cientifico: dino?.nombre_cientifico,
          nombre_comun: dino?.nombre_comun ?? null,
        };
      });
    return delay({ ...pl, estudios });
  },

  dinosaurios: (filters: DinoFilters = {}): Promise<Dinosaurio[]> => {
    const out = state.dinosaurios
      .map(enrichDinosaurio)
      .filter(d => matchesFilters(d, filters))
      .sort((a, b) => (a.nombre_comun ?? a.nombre_cientifico).localeCompare(b.nombre_comun ?? b.nombre_cientifico));
    return delay(out);
  },

  dinosaurio: (id: number | string): Promise<DinosaurioDetalle> => {
    const numId = Number(id);
    const raw = state.dinosaurios.find(d => d.dinosaurio_id === numId);
    if (!raw) return Promise.reject(new Error('Dinosaurio no encontrado'));
    const base = enrichDinosaurio(raw);

    const paises: Pais[] = state.fosilPais
      .filter(fp => fp.dinosaurio_id === numId)
      .map(fp => {
        const country = paisesData.find(p => p.pais_id === fp.pais_id)!;
        return { ...country, anio_hallazgo: fp.anio_hallazgo };
      })
      .sort((a, b) => (a.anio_hallazgo ?? 0) - (b.anio_hallazgo ?? 0));

    const estudios: Estudio[] = state.estudios
      .filter(e => e.dinosaurio_id === numId)
      .map(e => {
        const pl = paleontologosData.find(p => p.paleontologo_id === e.paleontologo_id)!;
        return { ...e, nombre: pl.nombre, apellido: pl.apellido, nacionalidad: pl.nacionalidad };
      })
      .sort((a, b) => (a.fecha_inicio ?? '').localeCompare(b.fecha_inicio ?? ''));

    return delay({ ...base, paises, estudios });
  },

  createDinosaurio: (data: DinoFormData): Promise<{ dinosaurio_id: number }> => {
    const id = state.nextDinoId++;
    state.dinosaurios.push({ dinosaurio_id: id, ...data });
    return delay({ dinosaurio_id: id });
  },

  updateDinosaurio: (id: number | string, data: DinoFormData): Promise<{ ok: boolean }> => {
    const numId = Number(id);
    const idx = state.dinosaurios.findIndex(d => d.dinosaurio_id === numId);
    if (idx < 0) return Promise.reject(new Error('No encontrado'));
    state.dinosaurios[idx] = { dinosaurio_id: numId, ...data };
    return delay({ ok: true });
  },

  deleteDinosaurio: (id: number | string): Promise<{ ok: boolean }> => {
    const numId = Number(id);
    state.dinosaurios = state.dinosaurios.filter(d => d.dinosaurio_id !== numId);
    state.fosilPais = state.fosilPais.filter(fp => fp.dinosaurio_id !== numId);
    state.estudios = state.estudios.filter(e => e.dinosaurio_id !== numId);
    return delay({ ok: true });
  },

  stats: (): Promise<Stats> => {
    const dinos = state.dinosaurios;

    const porPeriodo = periodosData
      .map(p => ({
        nombre: p.nombre,
        inicio_ma: p.inicio_ma,
        fin_ma: p.fin_ma,
        total: dinos.filter(d => d.periodo_id === p.periodo_id).length,
      }))
      .sort((a, b) => b.inicio_ma - a.inicio_ma);

    const porDieta = dietasData
      .map(di => ({ tipo: di.tipo, total: dinos.filter(d => d.dieta_id === di.dieta_id).length }))
      .sort((a, b) => b.total - a.total);

    const continenteMap = new Map<string, number>();
    state.fosilPais.forEach(fp => {
      const country = paisesData.find(p => p.pais_id === fp.pais_id);
      if (!country) return;
      continenteMap.set(country.continente, (continenteMap.get(country.continente) ?? 0) + 1);
    });
    const porContinente = Array.from(continenteMap.entries())
      .map(([continente, total]) => ({ continente, total }))
      .sort((a, b) => b.total - a.total);

    const topPesos = dinos
      .filter(d => d.peso_kg !== null)
      .sort((a, b) => (b.peso_kg ?? 0) - (a.peso_kg ?? 0))
      .slice(0, 5)
      .map(d => ({
        nombre_comun: d.nombre_comun,
        nombre_cientifico: d.nombre_cientifico,
        peso_kg: d.peso_kg as number,
        longitud_m: d.longitud_m,
      }));

    const topLongitudes = dinos
      .filter(d => d.longitud_m !== null)
      .sort((a, b) => (b.longitud_m ?? 0) - (a.longitud_m ?? 0))
      .slice(0, 5)
      .map(d => ({
        nombre_comun: d.nombre_comun,
        nombre_cientifico: d.nombre_cientifico,
        longitud_m: d.longitud_m as number,
        peso_kg: d.peso_kg,
      }));

    const decadaMap = new Map<number, number>();
    state.fosilPais.forEach(fp => {
      if (!fp.anio_hallazgo) return;
      const decada = Math.floor(fp.anio_hallazgo / 10) * 10;
      decadaMap.set(decada, (decadaMap.get(decada) ?? 0) + 1);
    });
    const hallazgosPorAnio = Array.from(decadaMap.entries())
      .map(([decada, total]) => ({ decada, total }))
      .sort((a, b) => a.decada - b.decada);

    const sumPeso = dinos.reduce((s, d) => s + (d.peso_kg ?? 0), 0);
    const sumLong = dinos.reduce((s, d) => s + (d.longitud_m ?? 0), 0);
    const countPeso = dinos.filter(d => d.peso_kg !== null).length || 1;
    const countLong = dinos.filter(d => d.longitud_m !== null).length || 1;

    const stats: Stats = {
      totales: {
        dinosaurios: dinos.length,
        paleontologos: paleontologosData.length,
        estudios: state.estudios.length,
        paises: paisesData.length,
        peso_promedio: sumPeso / countPeso,
        longitud_promedio: sumLong / countLong,
      },
      porPeriodo, porDieta, porContinente, topPesos, topLongitudes, hallazgosPorAnio,
    };
    return delay(stats);
  },

  timeline: (): Promise<TimelineItem[]> => {
    const out: TimelineItem[] = state.dinosaurios.map(d => {
      const p = periodosData.find(x => x.periodo_id === d.periodo_id)!;
      const di = dietasData.find(x => x.dieta_id === d.dieta_id)!;
      return {
        dinosaurio_id: d.dinosaurio_id,
        nombre_comun: d.nombre_comun,
        nombre_cientifico: d.nombre_cientifico,
        peso_kg: d.peso_kg,
        longitud_m: d.longitud_m,
        periodo: p.nombre,
        inicio_ma: p.inicio_ma,
        fin_ma: p.fin_ma,
        dieta: di.tipo,
      };
    });
    out.sort((a, b) => b.inicio_ma - a.inicio_ma
      || (a.nombre_comun ?? '').localeCompare(b.nombre_comun ?? ''));
    return delay(out);
  },

  mapa: (): Promise<MapaPais[]> => {
    const out = paisesData.map(country => {
      const hallazgos = state.fosilPais.filter(fp => fp.pais_id === country.pais_id);
      const dinosaurios = hallazgos
        .map(fp => state.dinosaurios.find(d => d.dinosaurio_id === fp.dinosaurio_id))
        .filter(Boolean)
        .map(d => (d as Dinosaurio | { nombre_comun: string | null }).nombre_comun || '')
        .filter(Boolean)
        .sort();
      return {
        pais_id: country.pais_id,
        nombre: country.nombre,
        continente: country.continente,
        total: hallazgos.length,
        dinosaurios,
      };
    });
    out.sort((a, b) => b.total - a.total);
    return delay(out);
  },
};

// Cache compatible con el API anterior
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
