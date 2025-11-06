Sistema de Reservas (TP Prog3)

Un API backend para un sistema de reservas de salones, hecho con Node.js, Express y MySQL.


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
   * Asegurate de importar el archivo .sql (que te pasó el profe o que está en el repo) en tu base de datos. Esto va a crear todas las tablas (reservas, salones, turnos, etc.).

2. Archivo de Entorno (.env):
   * En la carpeta raíz del proyecto (al lado del package.json), creá un archivo nuevo y nombralo .env
   * Copiá y pegá esto adentro, y cambiale los valores por los de tu conexión local:

    # Puerto para el servidor
    PORT=3000
    
    # Datos de la Base de Datos
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_DATABASE=reservas
    
    # Secreto para JWT (token)
    JWT_SECRET=un_secreto_muy_dificil


   Ojo: Si tu usuario de MySQL no es 'root' o tiene contraseña, cambialo en DB_USER y DB_PASSWORD.


===================
Ejecución
===================

Una vez que está todo instalado y configurado:

1. Corré el servidor en modo desarrollo (se reinicia solo con cada cambio):

npm run dev

2. El servidor se va a iniciar en el puerto que pusiste en el .env (generalmente http://localhost:3000).

3. ¡Listo! Ya podés probar la API con Postman o conectar el frontend.