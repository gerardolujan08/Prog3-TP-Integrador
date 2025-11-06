# 🎉 Cliente Web - Sistema de Reservas

## 📖 Descripción
Aplicación web cliente para el sistema de reservas de casas de cumpleaños. Permite a los usuarios hacer login, crear reservas y visualizar sus reservas existentes.

## 🚀 Características

### ✅ **Funcionalidades Implementadas:**
- **🔐 Autenticación:** Login con JWT
- **📊 Dashboard:** KPIs y estadísticas básicas
- **📅 Mis Reservas:** Visualización de reservas del usuario
- **➕ Nueva Reserva:** Formulario completo para crear reservas
- **📱 Responsive:** Adaptado para móviles y tablets
- **🎨 UI Moderna:** Interfaz con gradientes y efectos

### 🛠️ **Tecnologías Utilizadas:**
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript ES6+** - Lógica de la aplicación
- **Font Awesome** - Iconos
- **Fetch API** - Comunicación con el backend

## 🌐 **Endpoints Utilizados:**

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

## 📱 **Funcionalidades por Pantalla:**

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

## 🎨 **Características de UI:**

### **🎭 Diseño:**
- **Gradientes:** Azul a púrpura
- **Glassmorphism:** Efectos de cristal con backdrop-filter
- **Animaciones:** Hover effects y transiciones suaves
- **Iconos:** Font Awesome para mejor UX
- **Responsive:** Grid CSS y Flexbox

### **📱 Responsivo:**
- **Desktop:** Layout completo con múltiples columnas
- **Tablet:** Adaptación de grids
- **Mobile:** Stack vertical, navegación optimizada

### **🔄 Estados:**
- **Loading:** Overlay con spinner
- **Error:** Mensajes rojos con bordes
- **Success:** Mensajes verdes
- **Empty:** Estados vacíos con iconos

## 🛡️ **Seguridad:**

- **JWT Token:** Guardado en localStorage
- **Autorización:** Headers automáticos en todas las requests
- **Logout:** Limpieza completa de datos
- **Validación:** Cliente y servidor

## 🔧 **Configuración:**

### **API Base URL:**
```javascript
const API_BASE = 'http://localhost:3000/api/v1';
```

### **Para cambiar el servidor:**
1. Editar `app.js`
2. Cambiar la constante `API_BASE`
3. Actualizar CORS en el backend si es necesario

## 📁 **Estructura de Archivos:**
```
cliente/
├── index.html      # Página principal
├── styles.css      # Estilos completos
├── app.js          # Lógica de la aplicación
└── README.md       # Esta documentación
```

## 🐛 **Resolución de Problemas:**

### **❌ Error de CORS:**
- Verificar que el servidor backend esté corriendo
- Verificar configuración de CORS en Express

### **❌ Error 401 Unauthorized:**
- Verificar credenciales de login
- Verificar que el token JWT sea válido

### **❌ Error de Conexión:**
- Verificar que el servidor esté en puerto 3000
- Verificar la URL en `API_BASE`

## 🚀 **Próximas Mejoras:**
- [ ] Editar reservas existentes
- [ ] Cancelar reservas
- [ ] Filtros en lista de reservas
- [ ] Notificaciones en tiempo real
- [ ] Calendario visual
- [ ] Exportar reservas
- [ ] Dark mode

## 👨‍💻 **Desarrollado por:**
Joel - Sistema de Reservas Casa de Cumpleaños

---
*¡Listo para usar! Solo asegúrate de que el backend esté corriendo en puerto 3000* 🎯