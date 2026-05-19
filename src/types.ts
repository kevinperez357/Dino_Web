export interface Dieta {
  dieta_id: number;
  tipo: string;
  descripcion: string | null;
}

export interface Periodo {
  periodo_id: number;
  nombre: string;
  inicio_ma: number;
  fin_ma: number;
  descripcion: string | null;
}

export interface Pais {
  pais_id: number;
  nombre: string;
  continente: string;
  hallazgos?: number;
  anio_hallazgo?: number | null;
}

export interface Paleontologo {
  paleontologo_id: number;
  nombre: string;
  apellido: string;
  nacionalidad: string | null;
  fecha_nacimiento: string | null;
  email: string | null;
  perfil_academia: string | null;
  total_estudios?: number;
}

export interface Estudio {
  estudio_id: number;
  paleontologo_id: number;
  dinosaurio_id: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  institucion: string | null;
  observaciones: string | null;
  nombre?: string;
  apellido?: string;
  nacionalidad?: string | null;
  nombre_cientifico?: string;
  nombre_comun?: string | null;
}

export interface Dinosaurio {
  dinosaurio_id: number;
  nombre_cientifico: string;
  nombre_comun: string | null;
  longitud_m: number | null;
  peso_kg: number | null;
  altura_m: number | null;
  fecha_descubrimiento: string | null;
  periodo_id: number;
  dieta_id: number;
  descripcion: string | null;
  periodo_nombre: string;
  inicio_ma?: number;
  fin_ma?: number;
  dieta_tipo: string;
  dieta_descripcion?: string | null;
  total_paises?: number;
  total_estudios?: number;
}

export interface DinosaurioDetalle extends Dinosaurio {
  paises: Pais[];
  estudios: Estudio[];
}

export interface PaleontologoDetalle extends Paleontologo {
  estudios: Estudio[];
}

export interface Stats {
  totales: {
    dinosaurios: number;
    paleontologos: number;
    estudios: number;
    paises: number;
    peso_promedio: number;
    longitud_promedio: number;
  };
  porPeriodo: { nombre: string; inicio_ma: number; fin_ma: number; total: number }[];
  porDieta: { tipo: string; total: number }[];
  porContinente: { continente: string; total: number }[];
  topPesos: { nombre_comun: string | null; nombre_cientifico: string; peso_kg: number; longitud_m: number | null }[];
  topLongitudes: { nombre_comun: string | null; nombre_cientifico: string; longitud_m: number; peso_kg: number | null }[];
  hallazgosPorAnio: { decada: number; total: number }[];
}

export interface TimelineItem {
  dinosaurio_id: number;
  nombre_comun: string | null;
  nombre_cientifico: string;
  peso_kg: number | null;
  longitud_m: number | null;
  periodo: string;
  inicio_ma: number;
  fin_ma: number;
  dieta: string;
}

export interface MapaPais {
  pais_id: number;
  nombre: string;
  continente: string;
  total: number;
  dinosaurios: string[];
}

export interface DinoFormData {
  nombre_cientifico: string;
  nombre_comun: string | null;
  longitud_m: number | null;
  peso_kg: number | null;
  altura_m: number | null;
  fecha_descubrimiento: string | null;
  periodo_id: number;
  dieta_id: number;
  descripcion: string | null;
}

export type ViewRenderer = () => Promise<void> | void;
