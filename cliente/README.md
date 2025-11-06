🥳 Cliente Web - Sistema de Reservas de Salones

Este proyecto es un cliente web (frontend) simple, desarrollado como un extra opcional para el Trabajo Práctico Integrador de Programación III. Su único propósito es consumir y mostrar los datos de la API REST de Salones de Fiestas (el proyecto principal del TP).

⚠️ Dependencia Crítica: El Backend (API)

### ✅ **Funcionalidades Implementadas:**
- **🔐 Autenticación:** Login con JWT
- **📊 Dashboard:** KPIs y estadísticas básicas
- **📅 Mis Reservas:** Visualización de reservas del usuario
- **➕ Nueva Reserva:** Formulario completo para crear reservas

Es una aplicación "frontend" pura (solo HTML, CSS y JS) que necesita conectarse a la API para obtener datos e iniciar sesión.

Debes tener tu API de Node.js corriendo para que este cliente pueda funcionar.

✨ Características Principales

Este cliente implementa las funcionalidades básicas del rol "Cliente" (tipo 3) y "Administrador" (tipo 1):

🔐 Autenticación: Formulario de inicio de sesión que consume el endpoint /auth/login y guarda el JWT en localStorage.

📊 Dashboard (Admin): Consume el endpoint /estadisticas (el que usa el Procedimiento Almacenado) para mostrar KPIs básicos.

📅 Mis Reservas: Consume GET /reservas para listar las reservas del usuario.

➕ Nueva Reserva: Un formulario completo que consume GET /salones, GET /turnos y GET /servicios para popular los selectores y luego POST /reservas para crear una nueva reserva.

📱 Diseño Adaptativo: Una interfaz simple adaptada para uso en dispositivos móviles.

🛠️ Stack Tecnológico

HTML5 Semántico

CSS3 (Puro, sin frameworks)

JavaScript (ES6+)

Fetch API (para la comunicación con el backend)

Font Awesome (para la iconografía)

🚀 Guía de Inicio Rápido (Cómo Probarlo)

Sigue estos 3 pasos para correr el proyecto completo (Backend + Frontend).

Paso 1: Iniciar el Backend (Tu API)

Abre una terminal y navega a la carpeta de tu API.

# Ejemplo de cómo navegar a la carpeta de la API (ajusta la ruta)
cd ../Prog3-TP-Integrador


Inicia el servidor de la API.

npm run dev
# o npm start, o el comando que uses


¡VERIFICA EL PUERTO! Fíjate en la terminal si tu API corre en el puerto 3000 o 8080.

Si tu API corre en el 8080, cámbialo:
const API_BASE = 'http://localhost:8080/api/v1';

Si tu API corre en el 3000:
const API_BASE = 'http://localhost:3000/api/v1';

Paso 2: Abrir el Cliente Web

No necesitas "instalar" nada. Solo abre el index.html en un navegador.

Opción A: Haz doble clic en el archivo index.html.

Opción B: Si tienes live-server instalado en Node.js, úsalo desde la carpeta de este cliente.

# (Desde la carpeta de este cliente)
npx live-server


Paso 3: Iniciar Sesión

Abre tu administrador de base de datos (DBeaver, Workbench, etc.).

Busca en tu tabla usuarios un usuario con el que quieras probar.

En la página de login (que abriste en el Paso 2), usa las credenciales de ese usuario:

Correo electrónico: El nombre_usuario de tu base de datos.

Contraseña: La contraseña en texto plano (ej: "1234", "admin123") de ese usuario.

¡Si la API está corriendo en el puerto correcto, podrás iniciar sesión y usar la aplicación!