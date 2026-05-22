// Datos seed extraídos de DinoDB.sql.
// Esta es la "base de datos" en memoria que alimenta al mockApi.

import type { Dieta, Periodo, Pais, Paleontologo, Dinosaurio } from './types';

export interface EstudioRaw {
  estudio_id: number;
  paleontologo_id: number;
  dinosaurio_id: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  institucion: string | null;
  observaciones: string | null;
}

export interface FosilPaisRaw {
  fosil_pais_id: number;
  dinosaurio_id: number;
  pais_id: number;
  anio_hallazgo: number | null;
}

export interface DinosaurioRaw {
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
}

export const dietas: Dieta[] = [
  { dieta_id: 1, tipo: 'Herbívoro', descripcion: 'Se alimentaba exclusivamente de vegetales, plantas y frutos.' },
  { dieta_id: 2, tipo: 'Carnívoro', descripcion: 'Predador que consumía otros animales.' },
  { dieta_id: 3, tipo: 'Omnívoro', descripcion: 'Consumía tanto vegetación como carne.' },
  { dieta_id: 4, tipo: 'Piscívoro', descripcion: 'Dieta basada principalmente en peces.' },
];

export const periodos: Periodo[] = [
  { periodo_id: 1, nombre: 'Triásico', inicio_ma: 251.9, fin_ma: 201.3, descripcion: 'Primer periodo de la Era Mesozoica. Surgieron los primeros dinosaurios.' },
  { periodo_id: 2, nombre: 'Jurásico', inicio_ma: 201.3, fin_ma: 145.0, descripcion: 'Dominio de los grandes saurópodos y primeras aves.' },
  { periodo_id: 3, nombre: 'Cretácico', inicio_ma: 145.0, fin_ma: 66.0, descripcion: 'Período de mayor diversidad; finaliza con la extinción masiva K-Pg.' },
];

export const paises: Pais[] = [
  { pais_id: 1, nombre: 'Argentina', continente: 'América del Sur' },
  { pais_id: 2, nombre: 'Estados Unidos', continente: 'América del Norte' },
  { pais_id: 3, nombre: 'China', continente: 'Asia' },
  { pais_id: 4, nombre: 'Mongolia', continente: 'Asia' },
  { pais_id: 5, nombre: 'Tanzania', continente: 'África' },
  { pais_id: 6, nombre: 'Reino Unido', continente: 'Europa' },
  { pais_id: 7, nombre: 'Canadá', continente: 'América del Norte' },
];

export const paleontologos: Paleontologo[] = [
  { paleontologo_id: 1, nombre: 'Barnum', apellido: 'Brown', nacionalidad: 'Estadounidense', fecha_nacimiento: '1873-02-12', email: 'b.brown@amnh.edu', perfil_academia: null },
  { paleontologo_id: 2, nombre: 'Henry', apellido: 'Osborn', nacionalidad: 'Estadounidense', fecha_nacimiento: '1857-08-08', email: 'h.osborn@amnh.edu', perfil_academia: null },
  { paleontologo_id: 3, nombre: 'Rinchen', apellido: 'Barsbold', nacionalidad: 'Mongol', fecha_nacimiento: '1935-12-21', email: 'r.barsbold@paleomn.edu', perfil_academia: null },
  { paleontologo_id: 4, nombre: 'Paul', apellido: 'Sereno', nacionalidad: 'Estadounidense', fecha_nacimiento: '1957-10-11', email: 'p.sereno@uchicago.edu', perfil_academia: null },
  { paleontologo_id: 5, nombre: 'Xu', apellido: 'Xing', nacionalidad: 'Chino', fecha_nacimiento: '1969-07-20', email: 'xu.xing@ivpp.ac.cn', perfil_academia: null },
  { paleontologo_id: 6, nombre: 'Luis', apellido: 'Chiappe', nacionalidad: 'Argentino', fecha_nacimiento: '1962-02-24', email: 'l.chiappe@nhm.edu', perfil_academia: null },
];

export const dinosauriosRaw: DinosaurioRaw[] = [
  { dinosaurio_id: 1, nombre_cientifico: 'Tyrannosaurus rex', nombre_comun: 'Tiranosaurio Rex', longitud_m: 12.00, peso_kg: 8000.00, altura_m: null, fecha_descubrimiento: '1902-08-12', periodo_id: 3, dieta_id: 2, descripcion: 'Uno de los mayores depredadores terrestres conocidos. Bípedo con mandíbula poderosa.' },
  { dinosaurio_id: 2, nombre_cientifico: 'Brachiosaurus altithorax', nombre_comun: 'Braquiosaurio', longitud_m: 26.00, peso_kg: 56000.00, altura_m: null, fecha_descubrimiento: '1900-06-01', periodo_id: 2, dieta_id: 1, descripcion: 'Saurópodo de cuello extremadamente largo que pastaba en la copa de los árboles.' },
  { dinosaurio_id: 3, nombre_cientifico: 'Velociraptor mongoliensis', nombre_comun: 'Velocirraptor', longitud_m: 1.80, peso_kg: 15.00, altura_m: null, fecha_descubrimiento: '1923-09-20', periodo_id: 3, dieta_id: 2, descripcion: 'Dromeosáurido ágil con una garra retráctil en cada pie. Cazador inteligente.' },
  { dinosaurio_id: 4, nombre_cientifico: 'Triceratops horridus', nombre_comun: 'Triceratops', longitud_m: 9.00, peso_kg: 8000.00, altura_m: null, fecha_descubrimiento: '1889-03-05', periodo_id: 3, dieta_id: 1, descripcion: 'Ceratopsio con tres cuernos y una gran gorguera ósea protectora.' },
  { dinosaurio_id: 5, nombre_cientifico: 'Stegosaurus stenops', nombre_comun: 'Estegosaurio', longitud_m: 9.00, peso_kg: 5000.00, altura_m: null, fecha_descubrimiento: '1877-11-01', periodo_id: 2, dieta_id: 1, descripcion: 'Ornitisquio con placas dorsales óseas y púas en la cola (thagomizer).' },
  { dinosaurio_id: 6, nombre_cientifico: 'Spinosaurus aegyptiacus', nombre_comun: 'Espinosaurio', longitud_m: 14.00, peso_kg: 9000.00, altura_m: null, fecha_descubrimiento: '1915-01-01', periodo_id: 3, dieta_id: 4, descripcion: 'El mayor carnívoro conocido; semiácuático con una vela dorsal característica.' },
  { dinosaurio_id: 7, nombre_cientifico: 'Iguanodon bernissartensis', nombre_comun: 'Iguanodonte', longitud_m: 9.00, peso_kg: 3000.00, altura_m: null, fecha_descubrimiento: '1822-02-14', periodo_id: 3, dieta_id: 1, descripcion: 'Ornitópodo herbívoro con pulgares en forma de espiga ósea.' },
  { dinosaurio_id: 8, nombre_cientifico: 'Diplodocus carnegii', nombre_comun: 'Diplodocus', longitud_m: 27.00, peso_kg: 15000.00, altura_m: null, fecha_descubrimiento: '1877-05-10', periodo_id: 2, dieta_id: 1, descripcion: 'Saurópodo de cuello y cola muy largos; uno de los dinosaurios más conocidos.' },
  { dinosaurio_id: 9, nombre_cientifico: 'Megalosaurus bucklandii', nombre_comun: 'Megalosaurio', longitud_m: 9.00, peso_kg: 1100.00, altura_m: 3.00, fecha_descubrimiento: '1824-02-20', periodo_id: 2, dieta_id: 2, descripcion: 'Primer dinosaurio descrito científicamente (1824, William Buckland). Terópodo carnívoro del Jurásico Medio europeo, bípedo y de mandíbula robusta.' },
];

export const estudios: EstudioRaw[] = [
  { estudio_id: 1, paleontologo_id: 1, dinosaurio_id: 1, fecha_inicio: '1902-08-12', fecha_fin: '1905-06-30', institucion: 'American Museum of Natural History', observaciones: 'Primer espécimen completo de T. rex descrito científicamente.' },
  { estudio_id: 2, paleontologo_id: 2, dinosaurio_id: 1, fecha_inicio: '1905-01-01', fecha_fin: '1908-12-31', institucion: 'American Museum of Natural History', observaciones: 'Describió formalmente la especie Tyrannosaurus rex.' },
  { estudio_id: 3, paleontologo_id: 3, dinosaurio_id: 3, fecha_inicio: '1989-03-01', fecha_fin: '1995-11-15', institucion: 'Instituto de Paleontología de Mongolia', observaciones: 'Estudio de especímenes del desierto de Gobi.' },
  { estudio_id: 4, paleontologo_id: 4, dinosaurio_id: 7, fecha_inicio: '1993-06-01', fecha_fin: '2000-05-30', institucion: 'University of Chicago', observaciones: 'Análisis biomecánico de la locomoción del Iguanodonte.' },
  { estudio_id: 5, paleontologo_id: 5, dinosaurio_id: 3, fecha_inicio: '2000-01-15', fecha_fin: '2007-08-20', institucion: 'IVPP Beijing', observaciones: 'Descubrimiento de especímenes emplumados en Liaoning.' },
  { estudio_id: 6, paleontologo_id: 6, dinosaurio_id: 8, fecha_inicio: '1990-09-01', fecha_fin: '1998-12-31', institucion: 'Natural History Museum of Los Angeles', observaciones: 'Reconstrucción del esqueleto axial del Diplodocus.' },
  { estudio_id: 7, paleontologo_id: 1, dinosaurio_id: 4, fecha_inicio: '1910-01-01', fecha_fin: '1915-06-30', institucion: 'American Museum of Natural History', observaciones: 'Excavación en Hell Creek Formation.' },
  { estudio_id: 8, paleontologo_id: 4, dinosaurio_id: 6, fecha_inicio: '2001-03-01', fecha_fin: '2006-12-01', institucion: 'University of Chicago', observaciones: 'Revisión del holotipo de Spinosaurus.' },
];

export const fosilPais: FosilPaisRaw[] = [
  { fosil_pais_id: 1, dinosaurio_id: 1, pais_id: 2, anio_hallazgo: 1902 },
  { fosil_pais_id: 2, dinosaurio_id: 1, pais_id: 7, anio_hallazgo: 1994 },
  { fosil_pais_id: 3, dinosaurio_id: 2, pais_id: 2, anio_hallazgo: 1900 },
  { fosil_pais_id: 4, dinosaurio_id: 2, pais_id: 5, anio_hallazgo: 1914 },
  { fosil_pais_id: 5, dinosaurio_id: 3, pais_id: 4, anio_hallazgo: 1923 },
  { fosil_pais_id: 6, dinosaurio_id: 3, pais_id: 3, anio_hallazgo: 1999 },
  { fosil_pais_id: 7, dinosaurio_id: 4, pais_id: 2, anio_hallazgo: 1889 },
  { fosil_pais_id: 8, dinosaurio_id: 5, pais_id: 2, anio_hallazgo: 1877 },
  { fosil_pais_id: 9, dinosaurio_id: 6, pais_id: 5, anio_hallazgo: 1915 },
  { fosil_pais_id: 10, dinosaurio_id: 7, pais_id: 6, anio_hallazgo: 1822 },
  { fosil_pais_id: 11, dinosaurio_id: 8, pais_id: 2, anio_hallazgo: 1877 },
  { fosil_pais_id: 12, dinosaurio_id: 9, pais_id: 6, anio_hallazgo: 1824 },
];

// Estado mutable (las operaciones CRUD modifican estas referencias en memoria)
export const state = {
  dinosaurios: [...dinosauriosRaw],
  estudios: [...estudios],
  fosilPais: [...fosilPais],
  nextDinoId: 10,
};

// Helpers de denormalización
export function enrichDinosaurio(d: DinosaurioRaw): Dinosaurio {
  const p = periodos.find(x => x.periodo_id === d.periodo_id)!;
  const di = dietas.find(x => x.dieta_id === d.dieta_id)!;
  return {
    ...d,
    periodo_nombre: p.nombre,
    inicio_ma: p.inicio_ma,
    fin_ma: p.fin_ma,
    dieta_tipo: di.tipo,
    dieta_descripcion: di.descripcion,
    total_paises: state.fosilPais.filter(fp => fp.dinosaurio_id === d.dinosaurio_id).length,
    total_estudios: state.estudios.filter(e => e.dinosaurio_id === d.dinosaurio_id).length,
  };
}
