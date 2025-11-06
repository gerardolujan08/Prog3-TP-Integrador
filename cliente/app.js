// 🌐 CONFIGURACIÓN DE LA API
const API_BASE = 'http://localhost:3000/api/v1';
let currentUser = null;
let authToken = null;

// 🚀 INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Verificar si hay token guardado
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showMainScreen();
    } else {
        showLoginScreen();
    }
}

// 🎛️ EVENT LISTENERS
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Refresh reservas
    document.getElementById('refreshReservas').addEventListener('click', loadReservas);
    
    // Formulario nueva reserva
    document.getElementById('reservaForm').addEventListener('submit', handleCreateReserva);
}

// 🔐 AUTENTICACIÓN
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    
    if (!email || !password) {
        showError('loginError', 'Por favor complete todos los campos');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_usuario: email,
                contrasenia: password
            })
        });
        
        const data = await response.json();
        
        if (data.estado && data.token) {
            authToken = data.token;
            
            // Decodificar el token para obtener info del usuario
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            currentUser = {
                usuario_id: tokenPayload.usuario_id,
                usuario: tokenPayload.usuario || email,
                tipo_usuario: tokenPayload.tipo_usuario
            };
            
            // Guardar en localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMainScreen();
            hideError('loginError');
        } else {
            showError('loginError', data.mensaje || 'Error de autenticación');
        }
    } catch (error) {
        console.error('Error de login:', error);
        showError('loginError', 'Error de conexión con el servidor');
    }
    
    showLoading(false);
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLoginScreen();
}

// 🖥️ NAVEGACIÓN DE PANTALLAS
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
}

function showMainScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    // Actualizar nombre de usuario
    document.getElementById('userName').textContent = currentUser.usuario;
    
    // Cargar datos iniciales
    loadDashboardData();
    loadInitialData();
}

function switchTab(tabName) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Cargar datos específicos del tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'reservas':
            loadReservas();
            break;
        case 'nueva-reserva':
            loadFormData();
            break;
    }
}

// 📊 DASHBOARD
async function loadDashboardData() {
    try {
        // Cargar estadísticas básicas
        const reservasResponse = await apiRequest('/reservas');
        const salonesResponse = await apiRequest('/salones');
        
        if (reservasResponse.estado) {
            const reservas = reservasResponse.reservas || [];
            const totalReservas = reservas.length;
            const hoy = new Date().toISOString().split('T')[0];
            const proximasReservas = reservas.filter(r => r.fecha_reserva >= hoy).length;
            
            document.getElementById('totalReservas').textContent = totalReservas;
            document.getElementById('proximasReservas').textContent = proximasReservas;
        }
        
        if (salonesResponse.estado) {
            const salones = salonesResponse.salones || [];
            document.getElementById('salonesDisponibles').textContent = salones.length;
        }
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// 📅 RESERVAS
async function loadReservas() {
    showLoading(true);
    
    try {
        const response = await apiRequest('/reservas');
        
        if (response.estado) {
            const reservas = response.reservas || [];
            displayReservas(reservas);
        } else {
            showNoReservas();
        }
    } catch (error) {
        console.error('Error cargando reservas:', error);
        showNoReservas();
    }
    
    showLoading(false);
}

function displayReservas(reservas) {
    const container = document.getElementById('reservasList');
    const noData = document.getElementById('noReservas');
    
    if (reservas.length === 0) {
        container.style.display = 'none';
        noData.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noData.style.display = 'none';
    
    container.innerHTML = reservas.map(reserva => `
        <div class="reserva-item">
            <div class="reserva-header">
                <div class="reserva-id">Reserva #${reserva.reserva_id}</div>
                <div class="reserva-estado estado-activa">Activa</div>
            </div>
            <div class="reserva-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(reserva.fecha_reserva)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-building"></i>
                    <span>${reserva.salon_nombre || 'Salón'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${reserva.turno_descripcion || 'Turno'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-concierge-bell"></i>
                    <span>${reserva.servicios_count || 0} servicios</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showNoReservas() {
    document.getElementById('reservasList').style.display = 'none';
    document.getElementById('noReservas').style.display = 'block';
}

// ➕ NUEVA RESERVA
async function loadFormData() {
    try {
        // Cargar salones
        const salonesResponse = await apiRequest('/salones');
        if (salonesResponse.estado) {
            populateSelect('salonSelect', salonesResponse.salones, 'salon_id', 'nombre');
        }
        
        // Cargar turnos
        const turnosResponse = await apiRequest('/turnos');
        if (turnosResponse.estado) {
            populateSelect('turnoSelect', turnosResponse.turnos, 'turno_id', 'descripcion');
        }
        
        // Cargar servicios
        const serviciosResponse = await apiRequest('/servicios');
        if (serviciosResponse.estado) {
            populateServicesList(serviciosResponse.servicios);
        }
        
        // Establecer fecha mínima (hoy)
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fechaReserva').min = today;
        
    } catch (error) {
        console.error('Error cargando datos del formulario:', error);
    }
}

function populateSelect(selectId, items, valueField, textField) {
    const select = document.getElementById(selectId);
    const defaultOption = select.querySelector('option[value=""]');
    
    // Limpiar opciones excepto la primera
    select.innerHTML = '';
    if (defaultOption) {
        select.appendChild(defaultOption);
    }
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.textContent = item[textField];
        select.appendChild(option);
    });
}

function populateServicesList(servicios) {
    const container = document.getElementById('serviciosList');
    
    container.innerHTML = servicios.map(servicio => `
        <div class="servicio-item">
            <input type="checkbox" id="servicio_${servicio.servicio_id}" 
                   value="${servicio.servicio_id}" name="servicios">
            <label for="servicio_${servicio.servicio_id}">${servicio.nombre}</label>
        </div>
    `).join('');
}

async function handleCreateReserva(e) {
    e.preventDefault();
    
    const fechaReserva = document.getElementById('fechaReserva').value;
    const salonId = document.getElementById('salonSelect').value;
    const turnoId = document.getElementById('turnoSelect').value;
    
    // Obtener servicios seleccionados
    const serviciosSeleccionados = Array.from(
        document.querySelectorAll('input[name="servicios"]:checked')
    ).map(checkbox => ({
        servicio_id: parseInt(checkbox.value),
        importe: 0 // Por defecto, debería venir de la BD
    }));
    
    if (!fechaReserva || !salonId || !turnoId || serviciosSeleccionados.length === 0) {
        showError('reservaError', 'Por favor complete todos los campos');
        return;
    }
    
    showLoading(true);
    hideError('reservaError');
    hideSuccess('reservaSuccess');
    
    try {
        const reservaData = {
            fecha_reserva: fechaReserva,
            salon_id: parseInt(salonId),
            usuario_id: currentUser.usuario_id,
            turno_id: parseInt(turnoId),
            servicios: serviciosSeleccionados
        };
        
        const response = await apiRequest('/reservas', 'POST', reservaData);
        
        if (response.estado) {
            showSuccess('reservaSuccess', '¡Reserva creada exitosamente!');
            document.getElementById('reservaForm').reset();
            
            // Actualizar dashboard
            loadDashboardData();
            
            // Cambiar a tab de reservas después de 2 segundos
            setTimeout(() => {
                switchTab('reservas');
            }, 2000);
        } else {
            showError('reservaError', response.mensaje || 'Error al crear la reserva');
        }
    } catch (error) {
        console.error('Error creando reserva:', error);
        showError('reservaError', 'Error de conexión con el servidor');
    }
    
    showLoading(false);
}

// 🌐 API UTILITIES
async function apiRequest(endpoint, method = 'GET', body = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    if (body) {
        config.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 401) {
        // Token expirado o inválido
        handleLogout();
        return;
    }
    
    return await response.json();
}

async function loadInitialData() {
    // Cargar datos iniciales necesarios para toda la app
    try {
        // Pre-cargar datos que se usan frecuentemente
        await loadFormData();
    } catch (error) {
        console.error('Error cargando datos iniciales:', error);
    }
}

// 🛠️ UTILITY FUNCTIONS
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideSuccess(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 🌍 FUNCIONES GLOBALES
window.switchTab = switchTab;