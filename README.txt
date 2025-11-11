Sistema de Reservas - Salones de Fiestas
========================================

Repositorio: https://github.com/gerardolujan08/Prog3-TP-Integrador

Descripción:
------------
Sistema de gestión de reservas para salones de fiestas desarrollado con Node.js, Express y MySQL.

Características principales:
- Gestión de reservas
- Administración de salones
- Sistema de turnos
- Gestión de servicios adicionales
- Generación de reportes (PDF y CSV)
- Autenticación de usuarios
- API RESTful documentada con Swagger

Tecnologías utilizadas:
-----------------------
- Backend: Node.js + Express
- Base de Datos: MySQL
- Autenticación: JWT (JSON Web Tokens)
- Documentación: Swagger
- Generación PDF: Puppeteer
- Templates: Handlebars

Instalación:
------------
1. Clonar el repositorio
2. Ejecutar: npm install
3. Configurar archivo .env con las credenciales de la base de datos
4. Ejecutar: npm start

Estructura del proyecto:
------------------------
- /src - Código fuente del backend
  - /controladores - Lógica de negocio
  - /db - Acceso a base de datos
  - /servicios - Servicios de la aplicación
  - /v1/rutas - Definición de rutas API
  - /swagger - Documentación de la API
- /cliente - Frontend de la aplicación

Configuracion archivo .env:
------------------------
PUERTO=3000 (o el que utiliza por defecto)
DB_HOST=
DB_USER=
DATABASE=
DB_PASSWORD=
SECRET_JWT=
USERCORREO=reservasdesalones@gmail.com 
USERPASS=bazrgylqbnccnpkk

Los datos del base de datos deben ser los propios al igual que la SECRET_JWT
Creamos un gmail para el trabajo y esas son las credenciales, si desea puede cambiarlas
por unas propias

Procedure utilizados:
------------------------
El procedure debe ser creado en la base de datos propia:

 - Procedure para la obtención de datos que se envian por mail
CREATE PROCEDURE obtenerDatosNotificacion(IN p_reserva_id INT)
BEGIN
    SELECT 
        r.fecha_reserva AS fecha,
        s.titulo AS salon,
        t.orden AS turno,
        u_cliente.nombre_usuario AS correo_cliente
    FROM 
    	reservas AS r
    INNER JOIN 
    	salones AS s ON s.salon_id = r.salon_id
    INNER JOIN 
    	turnos AS t ON t.turno_id = r.turno_id
    INNER JOIN
    	usuarios AS u_cliente ON u_cliente.usuario_id = r.usuario_id
    WHERE 
    	r.activo = 1 AND r.reserva_id = p_reserva_id;

    SELECT
        u_admin.nombre_usuario AS correoAdmin      
    FROM
        usuarios AS u_admin
    WHERE
        u_admin.tipo_usuario = 1; -- Asumiendo que 1 es el tipo de Admin
END


 - Procedure para la obtención de datos que se envian para las estadísticas del dashboard
CREATE PROCEDURE sp_informe_estadisticas()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM reservas WHERE activo = 1) AS total_reservas,
        (SELECT COUNT(*) FROM usuarios WHERE activo = 1 AND tipo_usuario = 3) AS total_clientes,
        (SELECT SUM(importe_total) FROM reservas WHERE activo = 1) AS ingresos_totales;
END

Autor: Prog3-TP-Integrador Team
Fecha: Noviembre 2025
