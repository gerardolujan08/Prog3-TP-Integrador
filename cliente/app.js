const API_BASE = 'http://localhost:3000/api/v1';
let currentUser = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
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

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    document.getElementById('refreshReservas').addEventListener('click', loadReservas);
    document.getElementById('reservaForm').addEventListener('submit', handleCreateReserva);
}

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
            
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
            currentUser = {
                usuario_id: tokenPayload.usuario_id,
                usuario: tokenPayload.usuario || email,
                tipo_usuario: tokenPayload.tipo_usuario
            };
            
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

function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
}

function showMainScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    document.getElementById('userName').textContent = currentUser.usuario;
    
    loadDashboardData();
    loadInitialData();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
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

async function loadDashboardData() {
    try {
        const estadisticasResponse = await apiRequest('/estadisticas');
        
        if (estadisticasResponse.estado && estadisticasResponse.estadisticas) {
            const stats = estadisticasResponse.estadisticas;
            
            document.getElementById('totalReservas').textContent = stats.total_reservas || 0;
            document.getElementById('proximasReservas').textContent = stats.total_reservas || 0; // Simplificado
            
            const salonesResponse = await apiRequest('/salones');
            if (salonesResponse.estado) {
                const salones = salonesResponse.salones || [];
                document.getElementById('salonesDisponibles').textContent = salones.length;
            }
            
            console.log('Estadísticas cargadas desde stored procedure:', stats);
        } else {
            console.warn('No se pudieron cargar las estadísticas del stored procedure');
            await loadDashboardDataFallback();
        }
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        await loadDashboardDataFallback();
    }
}

async function loadDashboardDataFallback() {
    try {
        console.log('Usando método de respaldo para cargar dashboard');
        
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
        console.error('Error en método de respaldo:', error);
    }
}

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
                    <i class="fas fa-birthday-cake"></i>
                    <span>${reserva.salon || 'Salón'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${reserva.turno || 'Turno'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-concierge-bell"></i>
                    <span>${reserva.servicios} servicios</span>
                </div>
            </div>
        </div>
    `).join('');
}


function showNoReservas() {
    document.getElementById('reservasList').style.display = 'none';
    document.getElementById('noReservas').style.display = 'block';
}

async function loadFormData() {
    if (!authToken) {
        console.warn('Usuario no autenticado, no se pueden cargar los datos del formulario');
        showError('reservaError', 'Debe iniciar sesión para acceder al formulario');
        return;
    }
    
    console.log('Cargando datos del formulario...');
    showLoading(true);
    
    try {
        // Cargar salones (OBLIGATORIO)
        console.log('Solicitando salones...');
        const salonesResponse = await apiRequest('/salones');
        console.log('Respuesta de salones:', salonesResponse);
        
        if (salonesResponse && salonesResponse.estado && salonesResponse.salones) {
            populateSelect('salonSelect', salonesResponse.salones, 'salon_id', 'titulo');
        } else {
            console.warn('No se pudieron cargar los salones:', salonesResponse);
            showError('reservaError', 'No se pudieron cargar los salones disponibles');
            return;
        }
        
        console.log('Solicitando turnos...');
        const turnosResponse = await apiRequest('/turnos');
        console.log('Respuesta de turnos:', turnosResponse);
        
        if (turnosResponse && turnosResponse.estado && turnosResponse.turnos) {
            const turnosConDescripcion = turnosResponse.turnos.map(t => ({
                ...t,
                descripcion: `${t.hora_desde.substring(0, 5)} - ${t.hora_hasta.substring(0, 5)}`
            }));
            populateSelect('turnoSelect', turnosConDescripcion, 'turno_id', 'descripcion');
        } else {
            console.warn('No se pudieron cargar los turnos:', turnosResponse);
            showError('reservaError', 'No se pudieron cargar los turnos disponibles');
            return;
        }
        
        console.log('Solicitando servicios...');
        const serviciosResponse = await apiRequest('/servicios');
        console.log('Respuesta de servicios:', serviciosResponse);
        
        if (serviciosResponse && serviciosResponse.estado && serviciosResponse.servicios) {
            if (serviciosResponse.servicios.length > 0) {
                populateServicesList(serviciosResponse.servicios);
            } else {
                createBasicService();
            }
        } else {
            console.warn('No se pudieron cargar los servicios:', serviciosResponse);
            createBasicService();
        }
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fechaReserva').min = today;
        
        hideError('reservaError');
        
    } catch (error) {
        console.error('Error cargando datos del formulario:', error);
        showError('reservaError', 'Error al cargar los datos del formulario. Verifique su conexión.');
    } finally {
        showLoading(false);
    }
}

function populateSelect(selectId, items, valueField, textField) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Element with ID ${selectId} not found`);
        return;
    }
    
    const defaultOption = select.querySelector('option[value=""]');
    const defaultText = defaultOption ? defaultOption.textContent : 'Seleccionar...';
    
    select.innerHTML = '';
    
    const newDefaultOption = document.createElement('option');
    newDefaultOption.value = '';
    newDefaultOption.textContent = defaultText;
    select.appendChild(newDefaultOption);
    
    if (!Array.isArray(items)) {
        console.warn(`Items for ${selectId} is not an array:`, items);
        return;
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
    if (!container) {
        console.error('Element serviciosList not found');
        return;
    }
    
    if (!Array.isArray(servicios)) {
        console.warn('Servicios is not an array:', servicios);
        container.innerHTML = '<p class="error-text">No se pudieron cargar los servicios</p>';
        return;
    }
    
    if (servicios.length === 0) {
        container.innerHTML = '<p class="info-text">No hay servicios disponibles</p>';
        return;
    }
    
    container.innerHTML = servicios.map(servicio => `
        <div class="servicio-item">
            <input type="checkbox" id="servicio_${servicio.servicio_id}" 
                   value="${servicio.servicio_id}" name="servicios">
            <label for="servicio_${servicio.servicio_id}">
                ${servicio.descripcion}
                ${servicio.importe ? `- $${servicio.importe}` : ''}
            </label>
        </div>
    `).join('');
    
}

function createBasicService() {
    const container = document.getElementById('serviciosList');
    if (!container) {
        console.error('Element serviciosList not found');
        return;
    }
    
    container.innerHTML = `
        <div class="servicio-item">
            <input type="checkbox" id="servicio_basic" 
                   value="1" name="servicios" checked style="display: none;">
            <label for="servicio_basic" style="color: #666; font-style: italic;">
                Servicio básico de salón
            </label>
        </div>
        <small style="color: #888; display: block; margin-top: 8px;">
            * Servicio básico de reserva de salón
        </small>
    `;
    
}

async function handleCreateReserva(e) {
    e.preventDefault();
    
    const fechaReserva = document.getElementById('fechaReserva').value;
    const salonId = document.getElementById('salonSelect').value;
    const turnoId = document.getElementById('turnoSelect').value;
    
    const serviciosSeleccionados = Array.from(
        document.querySelectorAll('input[name="servicios"]:checked')
    ).map(checkbox => ({
        servicio_id: parseInt(checkbox.value),
        importe: 0 
    }));
    
    if (!fechaReserva || !salonId || !turnoId) {
        showError('reservaError', 'Por favor complete todos los campos obligatorios');
        return;
    }
    
    if (serviciosSeleccionados.length === 0) {
        showError('reservaError', 'Debe seleccionar al menos un servicio');
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
            
            loadDashboardData();
            
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
        handleLogout();
        return;
    }
    
    return await response.json();
}

async function loadInitialData() {
    try {
        console.log('Datos iniciales cargados correctamente');
    } catch (error) {
        console.error('Error cargando datos iniciales:', error);
    }
}

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

window.switchTab = switchTab;