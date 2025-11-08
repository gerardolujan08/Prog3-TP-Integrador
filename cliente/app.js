const API_BASE = 'http://localhost:3000/api/v1';
let currentUser = null;
let authToken = null;
let salonesData = [];
let serviciosData = [];
let turnosData = [];
let reservasData = [];

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
        btn.addEventListener('click', (e) => switchTab(e.target.getAttribute('data-tab')));
    });

    document.getElementById('refreshReservas').addEventListener('click', loadReservas);
    document.getElementById('reservaForm').addEventListener('submit', handleCreateReserva);
    document.getElementById('btnGenerarPDF').addEventListener('click', handleGenerarPDF);
    document.getElementById('reservasList').addEventListener('click', handleReservaActions);

    document.getElementById('fechaReserva').addEventListener('change', filterAvailableTurnos);
    document.getElementById('salonSelect').addEventListener('change', filterAvailableTurnos);

    document.getElementById('editReservaForm').addEventListener('submit', handleEditReserva);
    document.getElementById('closeEditModal').addEventListener('click', () => {
        document.getElementById('editModalOverlay').classList.remove('active');
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('loginForm').querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';

    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario: email, contrasenia: password })
        });

        const data = await response.json();

        if (data.estado && data.token) {
            authToken = data.token;

            const payload = JSON.parse(atob(data.token.split('.')[1]));
            currentUser = {
                usuario_id: payload.usuario_id,
                usuario: payload.usuario || email,
                tipo_usuario: payload.tipo_usuario
            };

            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showMainScreen();
        } else {
            showError('loginError', data.mensaje || 'Error de autenticación');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        }

    } catch (err) {
        showError('loginError', 'Error de conexión');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }

    showLoading(false);
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.clear();
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

    const tipo = parseInt(currentUser.tipo_usuario);
    
    const showDashboard = (tipo === 1);
    const showNuevaReserva = (tipo === 1 || tipo === 3); 
    const showPDF = (tipo === 1); 

    document.querySelector('[data-tab="dashboard"]').style.display = showDashboard ? 'block' : 'none';
    document.querySelector('[data-tab="reservas"]').style.display = 'block';
    document.querySelector('[data-tab="nueva-reserva"]').style.display = showNuevaReserva ? 'block' : 'none';
    document.getElementById('btnGenerarPDF').style.display = showPDF ? 'inline-block' : 'none';

    loadDashboardData();
    loadAllFormData();
    
    let initialTab;
    if (tipo === 1) {
        initialTab = 'dashboard'; 
    } else {
        initialTab = 'reservas';
    }
    switchTab(initialTab);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'reservas') loadReservas();
    
    if (tabName === 'nueva-reserva') {
        loadFormData();
        loadReservas(); 
    }
}


async function loadDashboardData() {
    const tipo = parseInt(currentUser.tipo_usuario);
    if (tipo !== 1) return; 

    try {
        const r = await apiRequest('/estadisticas');
        
        if (r.estado && r.estadisticas) {
            const stats = r.estadisticas;

            document.getElementById('totalReservas').textContent = stats.total_reservas || 0;
            document.getElementById('totalClientes').textContent = stats.total_clientes || 0;
            
            const ingresos = stats.ingresos_totales || 0;
            document.getElementById('ingresosTotales').textContent = `$${parseFloat(ingresos).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;

        } else {
            console.error("API Error: No se pudo cargar el dashboard. Mensaje:", r.mensaje);
            document.getElementById('totalReservas').textContent = 0;
            document.getElementById('totalClientes').textContent = 0;
            document.getElementById('ingresosTotales').textContent = '$0.00';
            
            showError('reservaError', r.mensaje || 'Error al cargar las estadísticas del dashboard.');
            setTimeout(() => showError('reservaError', ''), 5000);
        }

    } catch (error) {
         console.error("Error al cargar datos del Dashboard (Catch):", error);
         document.getElementById('totalReservas').textContent = 0;
         document.getElementById('totalClientes').textContent = 0;
         document.getElementById('ingresosTotales').textContent = '$0.00';
    }
}

async function loadReservas() {
    showLoading(true);
    const cacheBust = new Date().getTime();
    const r = await apiRequest(`/reservas?t=${cacheBust}`);
    showLoading(false);

    if (!r || !r.estado) {
        reservasData = [];
        return showNoReservas();
    }
    
    reservasData = r.reservas || []; 
    
    if (!reservasData.length && document.getElementById('reservas').classList.contains('active')) {
        return showNoReservas();
    }
    
    displayReservas(reservasData);
    
    if (document.getElementById('nueva-reserva').classList.contains('active')) {
        filterAvailableTurnos(); 
    }
}

function displayReservas(reservas) {
    const container = document.getElementById('reservasList');
    const isAdmin = (currentUser.tipo_usuario === 1);

    container.innerHTML = reservas.map(r => {
        const turnoFormateado = (r.hora_desde && r.hora_hasta)
            ? r.hora_desde.substring(0, 5) + ' - ' + r.hora_hasta.substring(0, 5)
            : (r.turno || 'Sin turno');

        return `
        <div class="reserva-item-pro">
            <div class="reserva-pro-header">
                <span class="reserva-pro-salon">${r.salon}</span>
                <span class="reserva-pro-id">Reserva #${r.reserva_id}</span>
            </div>
            
            <div class="reserva-pro-body">
                <div class="reserva-pro-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(r.fecha_reserva)}</span>
                </div>
                <div class="reserva-pro-detail">
                    <i class="fas fa-clock"></i>
                    <span>${turnoFormateado}</span>
                </div>
                <div class="reserva-pro-detail">
                    <i class="fas fa-concierge-bell"></i>
                    <span>${r.servicios} Servicios</span>
                </div>
            </div>

            ${isAdmin ? `
            <div class="reserva-pro-actions">
                <button class="btn-edit" data-id="${r.reserva_id}">
                    <i class="fas fa-pen"></i> Editar
                </button>
                <button class="btn-delete" data-id="${r.reserva_id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>` : ''}
        </div>
        `;
    }).join('');

    container.style.display = 'grid'; 
    document.getElementById('noReservas').style.display = 'none';
}


function showNoReservas() {
    const container = document.getElementById('reservasList');
    container.innerHTML = "";
    container.style.display = 'none';
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

        if (salonesResponse?.estado) {
            salonesData = salonesResponse.salones;
        }

        if (turnosResponse?.estado) {
            turnosData = turnosResponse.turnos.map(t => ({
                ...t,
                descripcion: `${t.hora_desde.substring(0, 5)} - ${t.hora_hasta.substring(0, 5)}`
            }));
        }

        if (serviciosResponse?.estado) {
            serviciosData = serviciosResponse.servicios;
        }

    } catch (error) {
        console.error('Error cargando todos los datos de formularios:', error);
    }
}


function loadFormData() {
    populateSelect('salonSelect', salonesData, 'salon_id', 'titulo');
    populateSelect('turnoSelect', turnosData, 'turno_id', 'descripcion');
    populateServicesList(serviciosData, 'serviciosList');
}


function filterAvailableTurnos() {
    const fecha = document.getElementById('fechaReserva').value;
    const salonSelect = document.getElementById('salonSelect');
    const salonId = parseInt(salonSelect.value);
    const turnoSelect = document.getElementById('turnoSelect');
    
    if (!fecha || isNaN(salonId) || !salonSelect.value) {
        populateSelect('turnoSelect', turnosData, 'turno_id', 'descripcion');
        turnoSelect.removeAttribute('disabled');
        return;
    }

    const fechaReservaISO = new Date(fecha).toISOString().split('T')[0];

    const turnosOcupadosIds = reservasData
        .filter(reserva => {
            const fechaExistenteISO = new Date(reserva.fecha_reserva).toISOString().split('T')[0];
            return (
                fechaExistenteISO === fechaReservaISO &&
                reserva.salon_id === salonId
            );
        })
        .map(reserva => reserva.turno_id);

    const turnosDisponibles = turnosData.filter(turno => {
        return !turnosOcupadosIds.includes(turno.turno_id);
    });

    turnoSelect.innerHTML = '';
    
    if (turnosDisponibles.length === 0) {
        turnoSelect.innerHTML = '<option value="">(No hay turnos disponibles)</option>';
        turnoSelect.setAttribute('disabled', 'true');
        showError('reservaError', '🛑 No hay turnos disponibles para esta fecha y salón.');
    } else {
        populateSelect('turnoSelect', turnosDisponibles, 'turno_id', 'descripcion');
        turnoSelect.removeAttribute('disabled');
        showError('reservaError', ''); 
    }
}


async function handleCreateReserva(e) {
    e.preventDefault();

    const form = document.getElementById('reservaForm');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    if (currentUser.tipo_usuario === 2) {
        showError('reservaError', 'Los empleados no pueden crear reservas.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Crear Reserva';
        return;
    }

    const fecha = document.getElementById('fechaReserva').value;
    const salonId = parseInt(document.getElementById('salonSelect').value);
    const turnoId = parseInt(document.getElementById('turnoSelect').value);
    

    if (!fecha || isNaN(salonId) || isNaN(turnoId) || !document.getElementById('turnoSelect').value) {
        showError('reservaError', '❌ Por favor, complete la Fecha, el Salón y seleccione un Turno válido.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Crear Reserva';
        setTimeout(() => showError('reservaError', ''), 5000); 
        return; 
    }

    const fechaReservaISO = new Date(fecha).toISOString().split('T')[0];
    const yaExisteReserva = reservasData.some(reserva => {
        const fechaExistenteISO = new Date(reserva.fecha_reserva).toISOString().split('T')[0];
        
        return (
            fechaExistenteISO === fechaReservaISO &&
            reserva.salon_id === salonId &&
            reserva.turno_id === turnoId
        );
    });

    if (yaExisteReserva) {
        showError('reservaError', '❌ ¡Error! Este **Turno** acaba de ser ocupado. Por favor, actualice la página y seleccione otro turno.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Crear Reserva';
        setTimeout(() => showError('reservaError', ''), 7000); 
        return; 
    }
    
    const servicios = Array.from(document.querySelectorAll('input[name="serviciosList_servicios"]:checked'))
        .map(chk => ({
            servicio_id: parseInt(chk.value),
            importe: parseFloat(serviciosData.find(s => s.servicio_id == chk.value).importe)
        }));

    if (servicios.length === 0) {
        showError('reservaError', '⚠️ Debe seleccionar **al menos un servicio adicional** para crear la reserva.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Crear Reserva';
        setTimeout(() => showError('reservaError', ''), 4000); 
        return;
    }
    
    const r = await apiRequest('/reservas', 'POST', {
        fecha_reserva: fecha,
        salon_id: salonId,
        usuario_id: currentUser.usuario_id,
        turno_id: turnoId,
        servicios
    });

    if (r.estado) {
        showSuccess('reservaSuccess', 'Reserva creada con éxito.');
        form.reset();
        
        await loadReservas(); 
        
        setTimeout(() => {
            switchTab('reservas');
            showSuccess('reservaSuccess', '');
        }, 2000);
    } else {
        showError('reservaError', r.mensaje || 'Error al crear la reserva. El servidor rechazó la solicitud.');
        setTimeout(() => showError('reservaError', ''), 5000);
    }

    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-save"></i> Crear Reserva';
}

async function handleReservaActions(e) {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('btn-edit')) return openEditModal(id);
    if (e.target.classList.contains('btn-delete')) return deleteReserva(id);
}

async function openEditModal(id) {
    if (currentUser.tipo_usuario === 2)
        return alert("El empleado NO puede editar reservas.");

    const r = await apiRequest(`/reservas/${id}`);
    if (!r.estado) return;

    const reserva = r.reserva;

    document.getElementById('editModalOverlay').classList.add('active');
    document.getElementById('editReservaId').value = id;
    document.getElementById('editFechaReserva').value = reserva.fecha_reserva.split("T")[0];

    populateSelect('editSalonSelect', salonesData, 'salon_id', 'titulo');
    document.getElementById('editSalonSelect').value = reserva.salon_id;

    populateSelect('editTurnoSelect', turnosData, 'turno_id', 'descripcion');
    document.getElementById('editTurnoSelect').value = reserva.turno_id;

    populateServicesList(serviciosData, 'editServiciosList');
    const selected = reserva.servicios.map(s => s.servicio_id);
    document.querySelectorAll('input[name="editServiciosList_servicios"]').forEach(cb => {
        cb.checked = selected.includes(parseInt(cb.value));
    });
}

async function handleEditReserva(e) {
    e.preventDefault();

    const form = document.getElementById('editReservaForm');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    if (currentUser.tipo_usuario === 2)
        return showError('editReservaError', 'Los empleados no pueden editar reservas.');

    const id = document.getElementById('editReservaId').value;
    const fecha = document.getElementById('editFechaReserva').value;
    const salon = parseInt(document.getElementById('editSalonSelect').value);
    const turno = parseInt(document.getElementById('editTurnoSelect').value);

    const servicios = Array.from(document.querySelectorAll('input[name="editServiciosList_servicios"]:checked'))
        .map(chk => ({
            servicio_id: parseInt(chk.value),
            importe: parseFloat(serviciosData.find(s => s.servicio_id == chk.value).importe)
        }));

    const payload = {
        fecha_reserva: fecha,
        salon_id: salon,
        turno_id: turno,
        servicios
    };

    const r = await apiRequest(`/reservas/${id}`, 'PUT', payload);

    if (r.estado) {
        showSuccess('editReservaSuccess', 'Reserva actualizada.');
        
        await loadReservas(); 

        setTimeout(() => {
            document.getElementById('editModalOverlay').classList.remove('active');
            switchTab('reservas');
            showSuccess('editReservaSuccess', '');
        }, 2000);
    } else {
        showError('editReservaError', r.mensaje);
        setTimeout(() => showError('editReservaError', ''), 3000);
    }
    
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
}

async function deleteReserva(id) {
    if (!confirm("¿Eliminar reserva?")) return;
    await apiRequest(`/reservas/${id}`, 'DELETE');
    loadReservas();
}

async function handleGenerarPDF() {
    showLoading(true);
    try {
        const blob = await apiFileRequest('/reservas/informe?formato=pdf');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; 
        a.download = 'reporte_reservas.pdf'; 
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al generar PDF:", error.message);
        alert(`Error al generar el informe: ${error.message}`);
    }
    showLoading(false);
}


async function apiRequest(endpoint, method = 'GET', body = null) {
    const config = { 
        method, 
        headers: { 'Content-Type': 'application/json' } 
    };

    if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
    if (body) config.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    if (res.status === 401) {
        console.warn("Token inválido / Sesión expirada → cerrando sesión automáticamente...");
        handleLogout();
        return { estado: false, mensaje: "Sesión expirada. Vuelve a iniciar sesión." };
    }
    
    if (res.status === 403) {
        console.warn(`Acceso Denegado (403) a ${endpoint}.`);
        return { estado: false, mensaje: "Acceso denegado. No tienes permisos para esta acción." };
    }
    
    if (!res.ok) {
         try {
            return await res.json();
         } catch {
             return { estado: false, mensaje: "Error del servidor al procesar la solicitud." };
         }
    }

    try {
        return await res.json();
    } catch {
        return { estado: true, mensaje: "Operación exitosa (sin contenido de respuesta)." };
    }
}


async function apiFileRequest(endpoint) {
    const config = { method: 'GET', headers: {} };
    if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (response.status === 401 || response.status === 403) {
        console.warn("Token inválido / Sesión expirada → cerrando sesión automáticamente...");
        handleLogout(); 
        throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }

    if (!response.ok) {
        throw new Error("Error del servidor al generar el archivo.");
    }

    return response.blob();
}

function showLoading(s) { document.getElementById('loadingOverlay').classList.toggle('active', s); }

function showError(id, msg){ 
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg; 
    el.style.display = msg ? 'block' : 'none';
}
function showSuccess(id, msg){ 
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg; 
    el.style.display = msg ? 'block' : 'none';
}

function populateSelect(id, list, val, text){ 
    const s=document.getElementById(id); s.innerHTML='<option value="">Seleccionar...</option>';
    list.forEach(i=>s.innerHTML+=`<option value="${i[val]}">${i[text]}</option>`);
}
function populateServicesList(list, id){
    document.getElementById(id).innerHTML = list.map(s=>`
      <label><input type="checkbox" name="${id}_servicios" value="${s.servicio_id}"> ${s.descripcion} ($${s.importe})</label>
    `).join('');
}
function formatDate(d){ return new Date(d).toLocaleDateString('es-ES'); }