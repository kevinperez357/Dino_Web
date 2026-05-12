# 🦕 Sistema de Login - Base de Datos de Dinosaurios

## Instalación y Configuración

### 1. Asegúrate de que el backend esté ejecutándose

El backend Dino_backend debe estar corriendo en `http://localhost:3000`.

```bash
# En la carpeta Dino_backend
npm start
```

### 2. Abre la aplicación web

Abre `http://localhost:PUERTO` en tu navegador (o abre directamente `index.html` o `login.html`).

## 🔐 Flujo de Autenticación

### Primera vez - Registro

1. En la página de login, haz clic en **"Regístrate"**
2. Completa los siguientes campos:
   - **Nombre Completo**: Tu nombre
   - **Email**: Un email válido y único
   - **Contraseña**: Mínimo 6 caracteres
   - **Confirmar Contraseña**: Repite tu contraseña
3. Haz clic en **"Registrarse"**
4. Se iniciará sesión automáticamente y serás redirigido a la base de datos

### Usuarios Existentes - Login

1. En la página de login, completa:
   - **Email**: Tu email registrado
   - **Contraseña**: Tu contraseña
2. Haz clic en **"Iniciar Sesión"**
3. Serás redirigido a la base de datos de dinosaurios

## 📁 Archivos Principales

- **`login.html`** - Página de login y registro
- **`index.html`** - Página principal (requiere autenticación)
- **`pagina.html`** - Página de contenido original (ahora con autenticación)
- **`app.js`** - Lógica de la aplicación (sin cambios)
- **`pagina_style.css`** - Estilos originales

## 🔑 Credenciales de Prueba

Puedes registrarte con cualquier email y contraseña, o usar estas credenciales de prueba:

- **Email:** juan@ejemplo.com
- **Contraseña:** SecurePass123

## 🛡️ Características de Seguridad

✅ **Almacenamiento Local**: Los datos de sesión se guardan en `localStorage`  
✅ **Protección de Rutas**: Solo usuarios autenticados pueden acceder a la base de datos  
✅ **Logout**: Puedes cerrar sesión con el botón en la esquina superior derecha  
✅ **Validación del Cliente**: Validación de contraseñas coincidentes y longitud mínima  

## 📊 Estructura de Datos del Usuario

El usuario autenticado se almacena así en `localStorage`:

```json
{
  "usuario_id": 1,
  "email": "usuario@ejemplo.com",
  "nombre": "Nombre del Usuario"
}
```

## 🚀 Flujo de la Aplicación

```
┌─────────────────────┐
│   Abre index.html   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ¿Usuario autentic.? │
└──────┬─────────┬────┘
       │ NO      │ SÍ
       ▼         ▼
   login.html  index.html
       │         │
       ├────┬────┤
       │    │    │
    Reg Log  Ver datos
```

## 🔗 Endpoints de API Utilizados

- **POST** `/api/register` - Crear nuevo usuario
- **POST** `/api/login` - Autenticar usuario

Ver documentación en `Dino_backend/AUTH_README.md`

## 🐛 Solución de Problemas

### "Error de conexión"
- Verifica que el backend esté ejecutándose en `http://localhost:3000`
- Comprueba que la red local no tiene problemas

### "El email ya está registrado"
- Usa un email diferente para el registro
- O inicia sesión con tus credenciales existentes

### "Email o contraseña incorrectos"
- Verifica que escribiste correctamente el email y contraseña
- Recuerda que las contraseñas son sensibles a mayúsculas/minúsculas

### "Contraseña muy corta"
- La contraseña debe tener al menos 6 caracteres

## 📱 Dispositivos Soportados

- ✅ Desktop (navegadores modernos)
- ✅ Tablet
- ✅ Mobile (responsive design)

## 🎨 Personalización

### Cambiar colores
Edita `login.html` en la sección `<style>`:

```css
/* Cambiar color principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Cambiar el nombre de la aplicación
En `login.html` e `index.html`:

```html
<h1>🦕 Dinosaurios</h1> <!-- Cambia esto -->
```

## 📝 Notas

- Las sesiones se guardan en el navegador local
- Si limpias el localStorage o las cookies, perderás la sesión
- Recuerda hacer logout en navegadores públicos
- Los datos de usuario no se sincronizaban entre ventanas del navegador

## 🔄 Próximas Mejoras Recomendadas

- Implementar JWT tokens
- Agregar recuperación de contraseña
- Implementar roles de usuario (admin, usuario)
- Agregar autenticación con Google/GitHub
- Implementar 2FA (Autenticación de Dos Factores)
- Agregar verificación de email

---

¡Disfruta explorando la base de datos de dinosaurios! 🦖🦕
