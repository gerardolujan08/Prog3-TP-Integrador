# ⚽ Cliente Web - Sistema de Reservas

## 📖 Descripción
Aplicación web cliente para el sistema de reservas de canchas de fútbol. Permite a los usuarios hacer login, crear reservas y visualizar sus reservas existentes.

## 🚀 Características

### ✅ **Funcionalidades Implementadas:**
- **🔐 Autenticación:** Login con JWT
- **📊 Dashboard:** KPIs y estadísticas básicas
- **📅 Mis Reservas:** Visualización de reservas del usuario
- **➕ Nueva Reserva:** Formulario completo para crear reservas

### 🛠️ **Tecnologías Utilizadas:**
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript ES6+** - Lógica de la aplicación
- **Font Awesome** - Iconos
- **Fetch API** - Comunicación con el backend

### **Autenticación:**
- `POST /api/v1/auth/login` - Iniciar sesión

### **Reservas:**
- `GET /api/v1/reservas` - Obtener reservas del usuario
- `POST /api/v1/reservas` - Crear nueva reserva

### **Datos del Formulario:**
- `GET /api/v1/salones` - Obtener lista de salones
- `GET /api/v1/turnos` - Obtener lista de turnos
- `GET /api/v1/servicios` - Obtener lista de servicios

## 🚀 **Cómo Usar:**

### **1. Iniciar el Servidor Backend:**
```bash
cd Prog3-TP-Integrador
npm run dev
```

### **2. Abrir el Cliente:**
- Navegar a la carpeta `cliente/`
- Abrir `index.html` en un navegador
- O usar un servidor local:
```bash
# Con Python
python -m http.server 8080

# Con Node.js (si tienes live-server)
npx live-server
```

### **3. Hacer Login:**
- Usuario: `joelchasmann@gmail.com`
- Contraseña: `1234`

### **🔐 Login:**
- Formulario de autenticación
- Validación de campos
- Manejo de errores
- Guardado de token en localStorage

### **📊 Dashboard:**
- Total de reservas del usuario
- Próximas reservas
- Salones disponibles
- Acciones rápidas

### **📅 Mis Reservas:**
- Lista de todas las reservas
- Información detallada de cada reserva
- Botón de actualizar
- Estado visual de reservas

### **➕ Nueva Reserva:**
- Selección de fecha (no permite fechas pasadas)
- Dropdown de salones
- Dropdown de turnos
- Checkboxes de servicios múltiples
- Validaciones completas
- Mensajes de éxito/error
