# 🖼️ Guía de Imágenes de Dinosaurios

## Configuración de Imágenes

Las imágenes de dinosaurios ahora se muestran en el modal cuando consultas los detalles.

## 📂 Cómo Agregar Tus Propias Imágenes

### Opción 1: Usar URLs Remotas (Recomendado)

En el archivo `dinosaurios_data.js`, edita el mapeo de dinosaurios:

```javascript
const dinosaurios_imagenes = {
    1: {
        // Tyrannosaurus rex
        imagen: 'https://tu-url-de-imagen.com/tiranosauro.jpg',
        nombre_comun: 'Tiranosaurio Rex'
    },
    // ...
};
```

### Opción 2: Usar Imágenes Locales

1. **Descarga las imágenes** de tus dinosaurios
2. **Coloca las imágenes en** la carpeta `Dino_Web/images/`
3. **Actualiza `dinosaurios_data.js`** con las rutas locales:

```javascript
const dinosaurios_imagenes = {
    1: {
        // Tyrannosaurus rex
        imagen: 'images/tyrannosaurus-rex.jpg',
        nombre_comun: 'Tiranosaurio Rex'
    },
    2: {
        // Brachiosaurus altithorax
        imagen: 'images/braquiosaurio.jpg',
        nombre_comun: 'Braquiosaurio'
    },
    // ... y así sucesivamente
};
```

## 🎨 Mapeo Actual de Dinosaurios

| ID | Dinosaurio | Archivo | URL |
|----|----|----|----|
| 1 | Tyrannosaurus rex | `tyrannosaurus-rex.jpg` | [Editar URL](dinosaurios_data.js) |
| 2 | Brachiosaurus altithorax | `braquiosaurio.jpg` | [Editar URL](dinosaurios_data.js) |
| 3 | Velociraptor mongoliensis | `velociraptor.jpg` | [Editar URL](dinosaurios_data.js) |
| 4 | Triceratops horridus | `triceratops.jpg` | [Editar URL](dinosaurios_data.js) |
| 5 | Stegosaurus stenops | `estegosaurio.jpg` | [Editar URL](dinosaurios_data.js) |
| 6 | Spinosaurus aegyptiacus | `espinosaurio.jpg` | [Editar URL](dinosaurios_data.js) |
| 7 | Iguanodon bernissartensis | `iguanodonte.jpg` | [Editar URL](dinosaurios_data.js) |
| 8 | Diplodocus carnegii | `diplodocus.jpg` | [Editar URL](dinosaurios_data.js) |

## 📋 Requisitos de Imágenes

- **Formato:** JPG, PNG, WebP
- **Tamaño recomendado:** 600x600 píxeles (mínimo)
- **Peso:** Menos de 300KB
- **Proporción:** Cuadrada o rectangular

## 🔗 Fuentes de Imágenes Recomendadas

### Gratuitas:
- [Unsplash](https://unsplash.com) - Busca "dinosaur"
- [Pexels](https://pexels.com) - Busca "dinosaur"
- [Pixabay](https://pixabay.com) - Busca "dinosaur"
- [Wikimedia Commons](https://commons.wikimedia.org) - Imágenes educativas

### De Pago:
- [Shutterstock](https://shutterstock.com)
- [Getty Images](https://gettyimages.com)
- [iStock](https://istockphoto.com)

## 🖼️ Diseño del Modal con Imágenes

El modal ahora incluye:

✅ **Imagen principal** - Lado izquierdo
✅ **Badge de período** - Esquina superior derecha
✅ **Tarjetas de estadísticas** - Longitud, altura, peso
✅ **Era geológica** - Con información temporal
✅ **Tipo de dieta** - Destacado
✅ **Descripción detallada** - Con formato especial
✅ **Hallazgos por país** - En tarjetas coloridas
✅ **Estudios realizados** - En listado elegante

## 🎨 Personalización de Diseño

### Cambiar colores de la imagen
En `pagina_style.css`, busca `.detalle-imagen-container`:

```css
.detalle-imagen-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Cambia estos colores */
}
```

### Cambiar tamaño de la imagen
En `pagina_style.css`:

```css
.detalle-imagen-container {
    aspect-ratio: 1; /* Cambia para imagen rectangular */
    /* O usa: height: 400px; */
}
```

### Cambiar el zoom al hover
En `pagina_style.css`:

```css
.detalle-imagen-container:hover .detalle-imagen {
    transform: scale(1.05); /* Cambia 1.05 a 1.15 para más zoom */
}
```

## 🔄 Agregar Dinosaurio Nuevo

Si agregas un nuevo dinosaurio a la base de datos:

1. Obtén el `dinosaurio_id` de la BD
2. Agrega en `dinosaurios_data.js`:

```javascript
const dinosaurios_imagenes = {
    // ... dinosaurios existentes ...
    9: {
        // Tu nuevo dinosaurio
        imagen: 'https://url-de-imagen.com/nuevo-dino.jpg',
        nombre_comun: 'Nombre Común'
    }
};
```

3. Si no agregas la imagen, mostrará una imagen por defecto

## 🐛 Solución de Problemas

### La imagen no carga
- Verifica que la URL sea correcta
- Comprueba que el sitio permite hotlinking (acceso desde otros sitios)
- Usa HTTPS (no HTTP)
- Revisa la consola del navegador (F12 → Console)

### Imagen se ve distorsionada
- Asegúrate que sea cuadrada (o ajusta `aspect-ratio`)
- Comprueba que sea suficientemente grande
- Usa `object-fit: cover` para recorte automático

### Imagen no es visible en local
- Coloca las imágenes en `Dino_Web/images/`
- Usa ruta relativa: `images/nombre-archivo.jpg`
- No uses barras invertidas `\`, usa `/`

## 📸 Ejemplo Completo

```javascript
const dinosaurios_imagenes = {
    1: {
        imagen: 'images/tyrannosaurus-rex.jpg',
        nombre_comun: 'Tiranosaurio Rex'
    },
    2: {
        imagen: 'images/braquiosaurio.jpg',
        nombre_comun: 'Braquiosaurio'
    },
    3: {
        imagen: 'https://images.unsplash.com/photo-dinosaur?w=600&q=80',
        nombre_comun: 'Velocirraptor'
    },
    // ... más dinosaurios
};
```

## ✨ Mejoras Futuras

- [ ] Agregar galería de imágenes (swipe izquierda/derecha)
- [ ] Agregar zoom en la imagen
- [ ] Agregar lightbox (ampliar imagen en pantalla completa)
- [ ] Agregar comparador de tamaños
- [ ] Agregar filtros de imagen (blanco y negro, etc.)

---

¡Disfruta personalizando tu galería de dinosaurios! 🦕🦖

Para más información, consulta [ANIMACIONES.md](ANIMACIONES.md) para ver otros detalles del diseño.
