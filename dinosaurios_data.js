// Mapeo de dinosaurios con sus imágenes
const dinosaurios_imagenes = {
    1: {
        // Tyrannosaurus rex
        imagen: 'https://images.pexels.com/photos/25457/tyrannosaurus-t-rex-close-up-macro-animal.jpg?auto=compress&cs=tinysrgb&w=600',
        nombre_comun: 'Tiranosaurio Rex'
    },
    2: {
        // Brachiosaurus altithorax
        imagen: 'https://images.unsplash.com/photo-1606856110002-d0991ce78250?w=600&q=80&fit=crop',
        nombre_comun: 'Braquiosaurio'
    },
    3: {
        // Velociraptor mongoliensis
        imagen: 'https://images.unsplash.com/photo-1606856110003-d0991ce78251?w=600&q=80&fit=crop',
        nombre_comun: 'Velocirraptor'
    },
    4: {
        // Triceratops horridus
        imagen: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
        nombre_comun: 'Triceratops'
    },
    5: {
        // Stegosaurus stenops
        imagen: 'https://images.unsplash.com/photo-1606856110005-d0991ce78252?w=600&q=80&fit=crop',
        nombre_comun: 'Estegosaurio'
    },
    6: {
        // Spinosaurus aegyptiacus
        imagen: 'https://images.unsplash.com/photo-1606856110006-d0991ce78253?w=600&q=80&fit=crop',
        nombre_comun: 'Espinosaurio'
    },
    7: {
        // Iguanodon bernissartensis
        imagen: 'https://images.unsplash.com/photo-1606856110007-d0991ce78254?w=600&q=80&fit=crop',
        nombre_comun: 'Iguanodonte'
    },
    8: {
        // Diplodocus carnegii
        imagen: 'https://images.unsplash.com/photo-1606856110008-d0991ce78255?w=600&q=80&fit=crop',
        nombre_comun: 'Diplodocus'
    }
};

// Función para obtener la imagen de un dinosaurio
function obtenerImagen(dinosaurio_id) {
    if (dinosaurios_imagenes[dinosaurio_id]) {
        return dinosaurios_imagenes[dinosaurio_id].imagen;
    }
    // Imagen por defecto si no hay coincidencia
    return 'https://images.unsplash.com/photo-1606856110000-d0991ce78256?w=600&q=80&fit=crop';
}
