const API_BASE = 'http://localhost:3000/api/v1';
let currentUser = null;
let authToken = null;
let salonesData = [];
let serviciosData = [];
let turnosData = [];

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

    document.querySelector('[data-tab="dashboard"]').style.display = (tipo === 1 || tipo === 3) ? 'block' : 'none';
    document.querySelector('[data-tab="reservas"]').style.display = 'block';
    document.querySelector('[data-tab="nueva-reserva"]').style.display = (tipo === 1 || tipo === 3) ? 'block' : 'none';
    document.getElementById('btnGenerarPDF').style.display = (tipo === 1) ? 'inline-block' : 'none';

    loadDashboardData();
    loadAllFormData();
    switchTab(tipo === 3 ? 'dashboard' : 'reservas');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'reservas') loadReservas();
    if (tabName === 'nueva-reserva') loadFormData();
}

async function loadDashboardData() {
    if (currentUser.tipo_usuario !== 1) return;

    try {
        const r = await apiRequest('/estadisticas');
        if (r.estado) {
            document.getElementById('totalReservas').textContent = r.estadisticas.total_reservas;
            document.getElementById('totalClientes').textContent = r.estadisticas.total_clientes;
            document.getElementById('ingresosTotales').textContent = `$${r.estadisticas.ingresos_totales}`;
        }
    } catch {}
}

async function loadReservas() {
    showLoading(true);
    const cacheBust = new Date().getTime();
    const r = await apiRequest(`/reservas?t=${cacheBust}`);
    showLoading(false);

    if (!r || !r.estado || !r.reservas.length) return showNoReservas();
    displayReservas(r.reservas);
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

async function handleCreateReserva(e) {
    e.preventDefault();

    const form = document.getElementById('reservaForm');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    if (currentUser.tipo_usuario === 2)
        return showError('reservaError', 'Los empleados no pueden crear reservas.');

    const fecha = document.getElementById('fechaReserva').value;
    const salonId = parseInt(document.getElementById('salonSelect').value);
    const turnoId = parseInt(document.getElementById('turnoSelect').value);

    const servicios = Array.from(document.querySelectorAll('input[name="serviciosList_servicios"]:checked'))
        .map(chk => ({
            servicio_id: parseInt(chk.value),
            importe: parseFloat(serviciosData.find(s => s.servicio_id == chk.value).importe)
        }));

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
        
        setTimeout(() => {
            switchTab('reservas');
            showSuccess('reservaSuccess', '');
        }, 2000);
    } else {
        showError('reservaError', r.mensaje);
        setTimeout(() => showError('reservaError', ''), 3000);
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

    if (res.status === 401 || res.status === 403) {
        console.warn("Token inválido / Sesión expirada → cerrando sesión automáticamente...");
        handleLogout();
        return { estado: false, mensaje: "Sesión expirada. Vuelve a iniciar sesión." };
    }

    try {
        return await res.json();
    } catch {
        return { estado: false, mensaje: "Error al procesar la respuesta del servidor." };
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