# Dino Explorer (Frontend)

Página estática que consume la API de `Dino_backend`.

## Uso

1. Importa `DinoDB.sql` en MySQL.
2. Levanta el backend (`cd Dino_backend && npm install && npm start`).
3. Abre `index.html` directamente en el navegador, o sirve la carpeta:
   ```
   npx serve .
   ```

Endpoint API esperado: `http://localhost:3000/api`. Cámbialo en `app.js` si difiere.

## Funciones

- Stats globales (totales por entidad)
- Listado de dinosaurios con filtros por período, dieta y búsqueda
- Vista de detalle con hallazgos por país y estudios de paleontólogos
