# Dino_Web

Frontend para la Base de Datos de Dinosaurios. Interfaz web que se conecta con la API REST del backend Dino_backend.

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- **Dino_backend** ejecutándose en `http://localhost:3000`

## Instalación y Ejecución

### 1. Asegúrate de que el backend esté ejecutándose

```bash
cd ../Dino_backend
npm install
npm start
# Deberías ver: "API en http://localhost:3000"
```

### 2. Abre el frontend

Simplemente abre el archivo `pagina.html` en tu navegador:
- Opción 1: Doble clic en `pagina.html`
- Opción 2: Desde VS Code, haz clic derecho en `pagina.html` → "Open with Live Server"
- Opción 3: Usa un servidor local (Python, Node, etc.)

```bash
# Opción con Python
python -m http.server 8000

# O con Node.js (si tienes http-server instalado)
npx http-server -p 8000
```

Luego accede a `http://localhost:8000`

## Características

- ✅ Búsqueda de dinosaurios por nombre
- ✅ Filtrar por período y dieta
- ✅ Ver detalles completos de cada dinosaurio
- ✅ Visualizar hallazgos y estudios
- ✅ Interfaz responsiva

## Estructura de archivos

```
Dino_Web/
├── pagina.html         # HTML principal
├── app.js              # Lógica de conexión con la API
├── pagina_style.css    # Estilos CSS
└── README.md           # Este archivo
```

## Configuración de la API

La URL base de la API se configura en `app.js`:
```javascript
const API_URL = 'http://localhost:3000/api';
```

Si tu backend está en un puerto diferente, edita esta línea.

## Endpoints disponibles

El frontend utiliza los siguientes endpoints del backend:
- `GET /api/dinosaurios` - Listar dinosaurios (con filtros opcionales)
- `GET /api/dinosaurios/:id` - Obtener detalles de un dinosaurio
- `GET /api/periodos` - Listar períodos
- `GET /api/dietas` - Listar dietas

## Notas

- La API debe tener CORS habilitado (ya está en Dino_backend)
- Los datos se cargan desde la base de datos MySQL configurada en Dino_backend
- El frontend no necesita instalación de dependencias
