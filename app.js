// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const periodFilter = document.getElementById('periodFilter');
const dietFilter = document.getElementById('dietFilter');
const tablebody = document.getElementById('tablebody');
const statusMessage = document.getElementById('statusMessage');
const modal = document.getElementById('detalleModal');
const closeModal = document.querySelector('.close');

// Cerrar modal con animación
closeModal.onclick = () => {
    modal.style.animation = 'scaleOut 0.4s ease-out forwards';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = '';
    }, 400);
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.animation = 'scaleOut 0.4s ease-out forwards';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.animation = '';
        }, 400);
    }
};

// Agregar animación de scale out al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.7);
        }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .loading {
        animation: pulse 1.5s infinite;
    }
`;
document.head.appendChild(style);

// Inicializar la página
async function inicializar() {
    try {
        mostrarMensaje('Cargando datos...');
        
        // Cargar períodos
        const periodosRes = await fetch(`${API_URL}/periodos`);
        if (!periodosRes.ok) throw new Error(`Error cargando períodos: ${periodosRes.status}`);
        const periodos = await periodosRes.json();
        
        if (Array.isArray(periodos)) {
            periodos.forEach(p => {
                const option = document.createElement('option');
                option.value = p.periodo_id;
                option.textContent = p.nombre;
                option.style.animation = 'fadeIn 0.3s ease-out';
                periodFilter.appendChild(option);
            });
        }

        // Cargar dietas
        const dietasRes = await fetch(`${API_URL}/dietas`);
        if (!dietasRes.ok) throw new Error(`Error cargando dietas: ${dietasRes.status}`);
        const dietas = await dietasRes.json();
        
        if (Array.isArray(dietas)) {
            dietas.forEach(d => {
                const option = document.createElement('option');
                option.value = d.dieta_id;
                option.textContent = d.tipo;
                option.style.animation = 'fadeIn 0.3s ease-out';
                dietFilter.appendChild(option);
            });
        }

        // Cargar todos los dinosaurios
        await buscarDinosaurios();
    } catch (error) {
        mostrarError('Error al cargar datos iniciales: ' + error.message);
        console.error('Error detallado:', error);
    }
}

// Buscar dinosaurios con filtros
async function buscarDinosaurios() {
    try {
        const q = searchInput.value;
        const periodo_id = periodFilter.value;
        const dieta_id = dietFilter.value;

        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (periodo_id) params.append('periodo_id', periodo_id);
        if (dieta_id) params.append('dieta_id', dieta_id);

        const url = `${API_URL}/dinosaurios${params.toString() ? '?' + params : ''}`;
        
        // Agregar animación de carga
        tablebody.style.opacity = '0.5';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error en búsqueda: ${response.status}`);
        }
        
        const dinosaurios = await response.json();

        tablebody.innerHTML = '';
        tablebody.style.opacity = '1';
        
        if (!Array.isArray(dinosaurios)) {
            mostrarError('Error: La respuesta no contiene un array válido');
            return;
        }
        
        if (dinosaurios.length === 0) {
            tablebody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: #999; padding: 30px;">No se encontraron dinosaurios</td></tr>';
            mostrarMensaje('No hay resultados');
            return;
        }
        
        dinosaurios.forEach((dino, index) => {
            const row = document.createElement('tr');
            row.style.animation = `fadeIn 0.5s ease-out ${index * 0.05}s both`;
            row.innerHTML = `
                <td>${dino.nombre_cientifico || '-'}</td>
                <td>${dino.nombre_comun || '-'}</td>
                <td>${dino.periodo_nombre || '-'}</td>
                <td>${dino.dieta_tipo || '-'}</td>
                <td>${dino.peso_kg || '-'}</td>
                <td>${dino.altura_m || '-'}</td>
                <td><button onclick="verDetalle(${dino.dinosaurio_id})">Ver Detalles</button></td>
            `;
            row.addEventListener('click', () => {
                row.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    row.style.transform = 'scale(1)';
                }, 200);
            });
            tablebody.appendChild(row);
        });

        mostrarMensaje(`Se encontraron ${dinosaurios.length} dinosaurios`);
    } catch (error) {
        mostrarError('Error en búsqueda: ' + error.message);
        console.error('Error detallado:', error);
    }
}

// Ver detalle de un dinosaurio con animación
async function verDetalle(id) {
    try {
        const detalleContent = document.getElementById('detalleContent');
        detalleContent.innerHTML = '<p style="text-align: center; color: #667eea;">⏳ Cargando detalles...</p>';
        
        const response = await fetch(`${API_URL}/dinosaurios/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error cargando detalles: ${response.status}`);
        }
        
        const dino = await response.json();
        const imagenDino = obtenerImagen(id);
        
        let html = `
            <div class="detalle-container">
                <div class="detalle-imagen-container">
                    <img src="${imagenDino}" alt="${dino.nombre_cientifico}" class="detalle-imagen" onerror="this.src='https://images.unsplash.com/photo-1606856110000-e0491a6c2a80?w=600&q=80'">
                    <div class="detalle-imagen-overlay">
                        <span class="detalle-periodo-badge">${dino.periodo_nombre}</span>
                    </div>
                </div>
                
                <div class="detalle-info">
                    <h2>📚 ${dino.nombre_cientifico}</h2>
                    <p class="detalle-nombre-comun"><strong>${dino.nombre_comun || '-'}</strong></p>
                    
                    <div class="detalle-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📏</span>
                            <div class="stat-content">
                                <span class="stat-label">Longitud</span>
                                <span class="stat-value">${dino.longitud_m || '-'} m</span>
                            </div>
                        </div>
                        
                        <div class="stat-item">
                            <span class="stat-icon">📐</span>
                            <div class="stat-content">
                                <span class="stat-label">Altura</span>
                                <span class="stat-value">${dino.altura_m || '-'} m</span>
                            </div>
                        </div>
                        
                        <div class="stat-item">
                            <span class="stat-icon">⚖️</span>
                            <div class="stat-content">
                                <span class="stat-label">Peso</span>
                                <span class="stat-value">${dino.peso_kg || '-'} kg</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detalle-periodo">
                        <p><strong>🕰️ Era Geológica:</strong> <span class="periodo-badge">${dino.periodo_nombre}</span></p>
                        <p><span style="color: #999; font-size: 13px;">hace ${dino.inicio_ma} - ${dino.fin_ma} millones de años</span></p>
                    </div>
                    
                    <div class="detalle-dieta">
                        <p><strong>🍗 Dieta:</strong> <span style="color: #667eea; font-weight: 600;">${dino.dieta_tipo}</span></p>
                    </div>
                    
                    <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
                    
                    <p><strong>📖 Descripción</strong></p>
                    <p class="descripcion-text">${dino.descripcion || 'No disponible'}</p>
                </div>
            </div>
        `;

        if (dino.paises && Array.isArray(dino.paises) && dino.paises.length > 0) {
            html += '<div class="detalle-section"><h3>🌍 Hallazgos por País</h3><div class="hallazgos-grid">';
            dino.paises.forEach((p, i) => {
                html += `<div class="hallazgo-card" style="animation: fadeIn 0.5s ease-out ${0.3 + i * 0.1}s both;">
                    <span class="hallazgo-pais">${p.nombre}</span>
                    <span class="hallazgo-anio">${p.anio_hallazgo}</span>
                </div>`;
            });
            html += '</div></div>';
        }

        if (dino.estudios && Array.isArray(dino.estudios) && dino.estudios.length > 0) {
            html += '<div class="detalle-section"><h3>🔬 Estudios Realizados</h3><div class="estudios-list">';
            dino.estudios.forEach((e, i) => {
                html += `<div class="estudio-card" style="animation: fadeIn 0.5s ease-out ${0.3 + i * 0.1}s both;">
                    <div class="estudio-autor">👤 ${e.nombre} ${e.apellido}</div>
                    <div class="estudio-fecha">📅 ${e.fecha_inicio}</div>
                </div>`;
            });
            html += '</div></div>';
        }

        detalleContent.innerHTML = html;
        modal.style.display = 'block';
        modal.style.animation = '';
        
        // Agregar efecto de ondulación a los elementos
        agregarEfectoOndulacion();
        
    } catch (error) {
        mostrarError('Error al cargar detalles: ' + error.message);
        console.error('Error detallado:', error);
    }
}

// Efecto de ondulación en los elementos del modal
function agregarEfectoOndulacion() {
    const elementos = document.querySelectorAll('.modal-content p, .modal-content li');
    elementos.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
        });
        el.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
}

// Utilidades
function mostrarMensaje(msg) {
    statusMessage.textContent = msg;
    statusMessage.className = 'status success';
    statusMessage.style.animation = 'slideInDown 0.3s ease-out';
}

function mostrarError(msg) {
    statusMessage.textContent = msg;
    statusMessage.className = 'status error';
    statusMessage.style.animation = 'slideInDown 0.3s ease-out';
}

// Iniciar cuando carga la página
document.addEventListener('DOMContentLoaded', inicializar);
