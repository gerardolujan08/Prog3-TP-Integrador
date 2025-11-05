/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         servicio_id:
 *           type: integer
 *           description: ID autogenerado del servicio.
 *           example: 1
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio.
 *           example: "Catering Infantil"
 *         importe:
 *           type: string
 *           format: decimal
 *           description: Costo del servicio.
 *           example: "15000.00"
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
 *     ServicioInput:
 *       type: object
 *       required:
 *         - descripcion
 *         - importe
 *       properties:
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio.
 *           example: "Show de Magia"
 *         importe:
 *           type: number
 *           format: decimal
 *           description: Costo del servicio.
 *           example: 20000.00
 *   responses:
 *     ServicioNotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Servicio no encontrado."

 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para la gestión de servicios adicionales.

 * @swagger
 * /api/v1/servicios:
 *   get:
 *     tags: [Servicios]
 *     summary: Listar todos los servicios activos (Cacheado por 5 min)
 *     description: Obtiene una lista de todos los servicios activos (activo=1). **Requiere rol Cliente, Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de servicios obtenida exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.

 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   get:
 *     tags: [Servicios]
 *     summary: Buscar un servicio por ID (Cacheado por 5 min)
 *     description: Obtiene los detalles de un servicio específico por su ID. **Requiere rol Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/servicios:
 *   post:
 *     tags: [Servicios]
 *     summary: Crear un nuevo servicio
 *     description: Añade un nuevo servicio a la base de datos. **Requiere rol Empleado o Admin.** (Esta ruta no se cachea y limpia el caché de servicios).
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   put:
 *     tags: [Servicios]
 *     summary: Actualizar un servicio existente
 *     description: Actualiza los datos de un servicio por su ID. **Requiere rol Empleado o Admin.** (Esta ruta no se cachea y limpia el caché de servicios).
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   delete:
 *     tags: [Servicios]
 *     summary: Eliminar un servicio (Soft Delete)
 *     description: Marca un servicio como inactivo (activo=0) en la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */