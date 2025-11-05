/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         turno_id:
 *           type: integer
 *           description: ID autogenerado del turno.
 *           example: 1
 *         orden:
 *           type: integer
 *           description: Orden del turno (ej. 1 para Mañana, 2 para Tarde).
 *           example: 1
 *         hora_desde:
 *           type: string
 *           format: time
 *           description: Hora de inicio del turno.
 *           example: "09:00:00"
 *         hora_hasta:
 *           type: string
 *           format: time
 *           description: Hora de fin del turno.
 *           example: "13:00:00"
 *         creado:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro.
 *           example: "2025-11-04T23:55:00.000Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           description: Fecha de última modificación.
 *           example: "2025-11-04T23:55:00.000Z"
 *         activo:
 *           type: integer
 *           description: Indica si el registro está activo (1) o no (0).
 *           example: 1
 *     TurnoInput:
 *       type: object
 *       required:
 *         - orden
 *         - hora_desde
 *         - hora_hasta
 *       properties:
 *         orden:
 *           type: integer
 *           description: Orden del turno (1-3).
 *           example: 1
 *         hora_desde:
 *           type: string
 *           format: time
 *           description: Hora de inicio (formato HH:MM).
 *           example: "09:00"
 *         hora_hasta:
 *           type: string
 *           format: time
 *           description: Hora de fin (formato HH:MM).
 *           example: "13:00"
 *   responses:
 *     TurnoNotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Turno no encontrado."

 * @swagger
 * tags:
 *   name: Turnos
 *   description: Endpoints para la gestión de turnos (ej. Mañana, Tarde, Noche).

 * @swagger
 * /api/v1/turnos:
 *   get:
 *     tags: [Turnos]
 *     summary: Listar todos los turnos activos (Cacheado por 5 min)
 *     description: Obtiene una lista de todos los turnos activos (activo=1). **Requiere rol Cliente, Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de turnos obtenida exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.

 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   get:
 *     tags: [Turnos]
 *     summary: Buscar un turno por ID (Cacheado por 5 min)
 *     description: Obtiene los detalles de un turno específico por su ID. **Requiere rol Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/turnos:
 *   post:
 *     tags: [Turnos]
 *     summary: Crear un nuevo turno
 *     description: Añade un nuevo turno a la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   put:
 *     tags: [Turnos]
 *     summary: Actualizar un turno existente
 *     description: Actualiza los datos de un turno por su ID. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   delete:
 *     tags: [Turnos]
 *     summary: Eliminar un turno (Soft Delete)
 *     description: Marca un turno como inactivo (activo=0) en la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */