# Dino Explorer

Web estática construida con TypeScript + Vite que explora información sobre dinosaurios. **No requiere backend ni base de datos** — los datos (extraídos de `DinoDB.sql`) viven embebidos en el bundle (`src/data.ts`).

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build       # genera dist/
npm run preview     # previsualiza el build
```

## Despliegue a GitHub Pages

1. Crea el repo en GitHub y sube este proyecto:
   ```bash
   git init
   git remote add origin https://github.com/<usuario>/Dino_Web.git
   git add . && git commit -m "init"
   git branch -M main
   git push -u origin main
   ```
2. En `vite.config.ts` ajusta `base` al nombre del repo (por defecto `/Dino_Web/`).
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. El workflow `.github/workflows/deploy.yml` compila y publica automáticamente. La URL queda en `https://<usuario>.github.io/Dino_Web/`.

## Arquitectura

```
src/
├── main.ts             # bootstrap
├── data.ts             # base de datos en memoria (seed de DinoDB.sql)
├── api.ts              # cliente "API" local (Promise-based, simula latencia)
├── router.ts           # router por hash
├── types.ts            # interfaces del dominio
├── utils/              # dom, toast, modal, charts
└── views/              # dashboard, catalogo, timeline, mapa, paleontologos, comparador
```

Las operaciones CRUD del catálogo modifican el estado **en memoria** (no persisten al recargar).
