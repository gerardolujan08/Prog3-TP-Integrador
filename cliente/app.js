const API_BASE = 'http://localhost:3000/api/v1';
let currentUser = null;
let authToken = null;
let salonesData = [];
let serviciosData = [];
let turnosData = []; //

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

    document.getElementById('btnGenerarPDF').addEventListener('click', handleGenerarPDF);
    document.getElementById('reservasList').addEventListener('click', handleReservaActions);

    document.getElementById('editReservaForm').addEventListener('submit', handleEditReserva);
    document.getElementById('closeEditModal').addEventListener('click', () => {
        document.getElementById('editModalOverlay').classList.remove('active');
    });
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
    
    salonesData = [];
    serviciosData = [];
    turnosData = [];

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

    const dashboardTab = document.querySelector('[data-tab="dashboard"]');
    const reservasTab = document.querySelector('[data-tab="reservas"]');
    const nuevaReservaTab = document.querySelector('[data-tab="nueva-reserva"]');
    const btnPDF = document.getElementById('btnGenerarPDF'); 

    dashboardTab.style.display = 'none';
    reservasTab.style.display = 'none';
    nuevaReservaTab.style.display = 'none';
    btnPDF.style.display = 'none'; 

    const tipoUsuario = parseInt(currentUser.tipo_usuario);
    let defaultTab = '';

    if (tipoUsuario === 2) { 
        reservasTab.style.display = 'block';
        nuevaReservaTab.style.display = 'block';
        defaultTab = 'reservas';
        
    } else if (tipoUsuario === 3) { 
        dashboardTab.style.display = 'block';
        reservasTab.style.display = 'block';
        defaultTab = 'dashboard';
        
    } else if (tipoUsuario === 1) { 
        dashboardTab.style.display = 'block';
        reservasTab.style.display = 'block';
        nuevaReservaTab.style.display = 'block';
        btnPDF.style.display = 'inline-block';
        defaultTab = 'dashboard';
        
    } else {
        console.error('Tipo de usuario desconocido:', tipoUsuario);
    }

    loadDashboardData();
    loadInitialData();
    loadAllFormData();
    
    if (defaultTab) {
        switchTab(defaultTab);
    }
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
    
    const tipoUsuario = parseInt(currentUser.tipo_usuario);

    if (tipoUsuario !== 1) { 
        document.getElementById('totalReservas').textContent = '-';
        document.getElementById('totalClientes').textContent = '-';
        document.getElementById('ingresosTotales').textContent = '-';
        
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.style.display = 'none';
        }
        return;
    }

    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.style.display = 'block';
    }

    try {
        const estadisticasResponse = await apiRequest('/estadisticas');
        
        if (estadisticasResponse.estado && estadisticasResponse.estadisticas) {
            const stats = estadisticasResponse.estadisticas;
            
            document.getElementById('totalReservas').textContent = stats.total_reservas || 0;
            document.getElementById('totalClientes').textContent = stats.total_clientes || 0;
            
            const ingresos = stats.ingresos_totales || 0;
            document.getElementById('ingresosTotales').textContent = `$${parseFloat(ingresos).toLocaleString('es-ES')}`;
            
        } else {
            console.warn('No se pudieron cargar las estadísticas (Admin):', estadisticasResponse);
            document.getElementById('totalReservas').textContent = 'Error';
            document.getElementById('totalClientes').textContent = 'Error';
            document.getElementById('ingresosTotales').textContent = 'Error';
        }
        
    } catch (error) {
        console.error('Error cargando dashboard (Admin):', error);
        document.getElementById('totalReservas').textContent = 'Error';
        document.getElementById('totalClientes').textContent = 'Error';
        document.getElementById('ingresosTotales').textContent = 'Error';
    }
}

async function loadDashboardDataFallback() {
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
    
    const isAdmin = (parseInt(currentUser.tipo_usuario) === 1);
    
    container.innerHTML = reservas.map(reserva => {
        
        let adminButtons = '';
        if (isAdmin) {
            adminButtons = `
                <div class="reserva-actions">
                    <button class="btn-edit" data-id="${reserva.reserva_id}">Editar</button>
                    <button class="btn-delete" data-id="${reserva.reserva_id}">Eliminar</button>
                </div>
            `;
        }

        return `
            <div class="reserva-item">
                ${adminButtons} 
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
        `;
    }).join('');
}

function showNoReservas() {
    document.getElementById('reservasList').style.display = 'none';
    document.getElementById('noReservas').style.display = 'block';
}

async function loadAllFormData() {
    if (!authToken) return;
    
    try {
        const [salonesResponse, turnosResponse, serviciosResponse] = await Promise.all([
            apiRequest('/salones'),
            apiRequest('/turnos'),
            apiRequest('/servicios')
        ]);

        if (salonesResponse && salonesResponse.estado && salonesResponse.salones) {
            salonesData = salonesResponse.salones;
        }
        
        if (turnosResponse && turnosResponse.estado && turnosResponse.turnos) {
            turnosData = turnosResponse.turnos.map(t => ({
                ...t,
                descripcion: `${t.hora_desde.substring(0, 5)} - ${t.hora_hasta.substring(0, 5)}`
            }));
        }
        
        if (serviciosResponse && serviciosResponse.estado && serviciosResponse.servicios) {
            serviciosData = serviciosResponse.servicios;
        }

    } catch (error) {
        console.error('Error cargando todos los datos de formularios:', error);
    }
}

function loadFormData() {
    if (salonesData.length > 0) {
        populateSelect('salonSelect', salonesData, 'salon_id', 'titulo');
    }
    
    if (turnosData.length > 0) {
        populateSelect('turnoSelect', turnosData, 'turno_id', 'descripcion');
    }
    
    if (serviciosData.length > 0) {
        populateServicesList(serviciosData, 'serviciosList');
    }
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaReserva').min = today;
}

function populateSelect(selectId, items, valueField, textField) {
    const select = document.getElementById(selectId);
    const defaultOption = select.querySelector('option[value=""]');
    const defaultText = defaultOption ? defaultOption.textContent : 'Seleccionar...';
    
    select.innerHTML = '';
    
    const newDefaultOption = document.createElement('option');
    newDefaultOption.value = '';
    newDefaultOption.textContent = defaultText;
    select.appendChild(newDefaultOption);
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        if (item.importe) {
            option.textContent = `${item[textField]} ($${item.importe})`;
        } else {
            option.textContent = item[textField];
        }
        select.appendChild(option);
    });
}

function populateServicesList(servicios, containerId) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = servicios.map(servicio => `
        <div class="servicio-item">
            <input type="checkbox" id="${containerId}_servicio_${servicio.servicio_id}" 
                   value="${servicio.servicio_id}" name="${containerId}_servicios">
            <label for="${containerId}_servicio_${servicio.servicio_id}">
                ${servicio.descripcion}
                ${servicio.importe ? `- $${servicio.importe}` : ''}
            </label>
        </div>
    `).join('');
}

async function handleCreateReserva(e) {
    e.preventDefault();
    
    const fechaReserva = document.getElementById('fechaReserva').value;
    const salonId = document.getElementById('salonSelect').value;
    const turnoId = document.getElementById('turnoSelect').value;
    
    const salonSeleccionado = salonesData.find(s => s.salon_id == salonId);
    const importeSalon = salonSeleccionado ? parseFloat(salonSeleccionado.importe) : 0;

    let importeServicios = 0;
    const serviciosSeleccionados = Array.from(
        document.querySelectorAll('input[name="serviciosList_servicios"]:checked') 
    ).map(checkbox => {
        const servicioId = parseInt(checkbox.value);
        
        const servicioSeleccionado = serviciosData.find(s => s.servicio_id == servicioId);
        const importeServicio = servicioSeleccionado ? parseFloat(servicioSeleccionado.importe) : 0;
        importeServicios += importeServicio;
        
        return {
            servicio_id: servicioId,
            importe: importeServicio 
        };
    });

    const importeTotal = importeSalon + importeServicios;
    
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

function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

window.switchTab = switchTab;

async function handleReservaActions(e) {
    const target = e.target;
    
    if (target.classList.contains('btn-delete')) {
        const reserva_id = target.dataset.id;
        if (confirm(`¿Estás seguro de que deseas eliminar la reserva #${reserva_id}?`)) {
            showLoading(true);
            try {
                const response = await apiRequest(`/reservas/${reserva_id}`, 'DELETE');
                if (response.estado) {
                    alert('Reserva eliminada (borrado lógico) exitosamente.');
                    loadReservas();
                } else {
                    alert('Error al eliminar la reserva: ' + response.mensaje);
                }
            } catch (error) {
                console.error('Error en DELETE /reservas:', error);
                alert('Error de conexión al eliminar.');
            }
            showLoading(false);
        }
    }
    
    if (target.classList.contains('btn-edit')) {
        const reserva_id = target.dataset.id;
        openEditModal(reserva_id);
    }
}

async function handleGenerarPDF() {
    showLoading(true);
    console.log('Generando reporte PDF...');
    
    try {
        const blob = await apiFileRequest('/reservas/informe?formato=pdf');
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'reporte_reservas.pdf';
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error generando el PDF:', error);
        alert('Error al generar el reporte PDF.');
    }
    
    showLoading(false);
}

async function apiFileRequest(endpoint) {
    const config = {
        method: 'GET',
        headers: {}
    };
    
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 401) {
        handleLogout();
        throw new Error('No autorizado');
    }

    if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`);
    }
    
    return await response.blob();
}


async function openEditModal(reserva_id) {
    const modal = document.getElementById('editModalOverlay');
    modal.classList.add('active');
    showLoading(true);
    
    hideError('editReservaError');
    hideSuccess('editReservaSuccess');

    try {
        const response = await apiRequest(`/reservas/${reserva_id}`);
        if (!response.estado) {
            showError('editReservaError', 'No se pudieron cargar los datos de la reserva.');
            showLoading(false);
            return;
        }

        const reserva = response.reserva;

        document.getElementById('editReservaId').value = reserva.reserva_id;
        document.getElementById('editReservaForm').dataset.usuarioId = reserva.usuario_id; 

        document.getElementById('editFechaReserva').value = formatDateForInput(reserva.fecha_reserva);
        
        populateSelect('editSalonSelect', salonesData, 'salon_id', 'titulo');
        document.getElementById('editSalonSelect').value = reserva.salon_id;

        populateSelect('editTurnoSelect', turnosData, 'turno_id', 'descripcion');
        document.getElementById('editTurnoSelect').value = reserva.turno_id;
        
        populateServicesList(serviciosData, 'editServiciosList');
        const serviciosReservaIds = reserva.servicios.map(s => s.servicio_id);
        
        document.querySelectorAll('input[name="editServiciosList_servicios"]').forEach(checkbox => {
            checkbox.checked = serviciosReservaIds.includes(parseInt(checkbox.value));
        });

    } catch (error) {
        console.error('Error al abrir el modal de edición:', error);
        showError('editReservaError', 'Error de conexión al cargar la reserva.');
    }
    
    showLoading(false);
}


async function handleEditReserva(e) {
    e.preventDefault();
    showLoading(true);
    hideError('editReservaError');
    hideSuccess('editReservaSuccess');

    const reserva_id = document.getElementById('editReservaId').value;
    const usuario_id = document.getElementById('editReservaForm').dataset.usuarioId; 

    const fechaReserva = document.getElementById('editFechaReserva').value;
    const salonId = document.getElementById('editSalonSelect').value;
    const turnoId = document.getElementById('editTurnoSelect').value;
    
    const salonSeleccionado = salonesData.find(s => s.salon_id == salonId);
    const importeSalon = salonSeleccionado ? parseFloat(salonSeleccionado.importe) : 0;

    let importeServicios = 0;
    const serviciosSeleccionados = Array.from(
        document.querySelectorAll('input[name="editServiciosList_servicios"]:checked')
    ).map(checkbox => {
        const servicioId = parseInt(checkbox.value);
        const servicioSeleccionado = serviciosData.find(s => s.servicio_id == servicioId);
        const importeServicio = servicioSeleccionado ? parseFloat(servicioSeleccionado.importe) : 0;
        importeServicios += importeServicio;
        return {
            servicio_id: servicioId,
            importe: importeServicio 
        };
    });

    const importeTotal = importeSalon + importeServicios;

    const reservaData = {
        fecha_reserva: fechaReserva,
        salon_id: parseInt(salonId),
        usuario_id: parseInt(usuario_id), 
        turno_id: parseInt(turnoId),
        servicios: serviciosSeleccionados
    };

    try {
        const response = await apiRequest(`/reservas/${reserva_id}`, 'PUT', reservaData);

        if (response.estado) {
            showSuccess('editReservaSuccess', '¡Reserva actualizada exitosamente!');
            
            await loadDashboardData(); 
            await loadReservas(); 
    
            document.getElementById('editModalOverlay').classList.remove('active');

        } else {
            showError('editReservaError', response.mensaje || 'Error al actualizar la reserva');
        }
    } catch (error) {
        console.error('Error en PUT /reservas:', error);
        showError('editReservaError', 'Error de conexión con el servidor.');
    }
    
    showLoading(false);
}
