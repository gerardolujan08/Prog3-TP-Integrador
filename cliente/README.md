Sistema de Reservas (TP Prog3)

Un API backend para un sistema de reservas de salones.


===================
Requisitos
===================

Para poder correr este proyecto, necesitás tener instalado:

* Node.js: (Cualquier versión LTS v18+ va bien).
* MySQL: (Podés usar XAMPP, Laragon, WAMP o MySQL Workbench).


===================
Instalación
===================

1. Cloná el repositorio o descargá el ZIP.
2. Abrí una terminal en la carpeta del proyecto.
3. Instalá las dependencias de Node:

   npm install


===================
Configuración
===================

Este proyecto necesita conectarse a tu base de datos MySQL.

1. Base de Datos:
   * Asegurate de importar el archivo .sql en tu base de datos. Esto va a crear todas las tablas (reservas, salones, turnos, etc.).

2. Archivo de Entorno (.env):
   * En la carpeta raíz del proyecto, creá un archivo nuevo y nombralo .env
   * Copiá y pegá esto adentro, y cambiale los valores por los de tu conexión local:

PUERTO=3000
USERCORREO= 
USERPASS=   
DB_HOST=localhost
DB_USER=
DATABASE=reservas
DB_PASSWORD=
SECRET_JWT=mi_clave_secreta


===================
Ejecución
===================

Una vez que está todo instalado y configurado:

1. Corré el servidor:

npm run dev

2. El servidor se va a iniciar en el puerto que pusiste en el .env (generalmente http://localhost:3000).

3. ¡Listo! Ya podés probar la API con Postman o conectar el frontend.