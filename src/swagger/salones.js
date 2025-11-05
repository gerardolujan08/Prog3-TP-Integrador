/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       properties:
 *         salon_id:
 *           type: integer
 *           description: ID autogenerado del salón.
 *           example: 1
 *         titulo:
 *           type: string
 *           description: Nombre o título del salón.
 *           example: "Salón Imperial"
 *         direccion:
 *           type: string
 *           description: Dirección física del salón.
 *           example: "Av. Siempre Viva 742"
 *         latitud:
 *           type: number
 *           format: float
 *           description: Coordenada de latitud.
 *           example: -31.4135
 *         longitud:
 *           type: number
 *           format: float
 *           description: Coordenada de longitud.
 *           example: -64.181
 *         capacidad:
 *           type: integer
 *           description: Capacidad máxima de personas.
 *           example: 100
 *         importe:
 *           type: string
 *           format: decimal
 *           description: Costo del alquiler del salón.
 *           example: "50000.00"
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
 *     SalonInput:
 *       type: object
 *       required:
 *         - titulo
 *         - direccion
 *         - capacidad
 *         - importe
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Salón Imperial"
 *         direccion:
 *           type: string
 *           example: "Av. Siempre Viva 742"
 *         latitud:
 *           type: number
 *           format: float
 *           example: -31.4135
 *         longitud:
 *           type: number
 *           format: float
 *           example: -64.181
 *         capacidad:
 *           type: integer
 *           example: 100
 *         importe:
 *           type: number
 *           format: decimal
 *           example: 50000.00
 *   responses:
 *     NotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Salón no encontrado."

 * @swagger
 * tags:
 *   name: Salones
 *   description: Endpoints para la gestión de salones.

 * @swagger
 * /api/v1/salones/estado:
 *   get:
 *     tags: [Salones]
 *     summary: Comprobar estado del endpoint de Salones
 *     description: Ruta de prueba para verificar que el controlador de salones está funcionando. No requiere autenticación.
 *     responses:
 *       '200':
 *         description: El servicio está funcionando.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Salones funcionando correctamente."

 * @swagger
 * /api/v1/salones:
 *   get:
 *     tags: [Salones]
 *     summary: Listar todos los salones activos (Cacheado por 5 min)
 *     description: Obtiene una lista de todos los salones que están activos (activo=1). **Requiere rol Cliente, Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de salones obtenida exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.

 * @swagger
 * /api/v1/salones/{salon_id}:
 *   get:
 *     tags: [Salones]
 *     summary: Buscar un salón por ID (Cacheado por 5 min)
 *     description: Obtiene los detalles de un salón específico por su ID. **Requiere rol Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/salones:
 *   post:
 *     tags: [Salones]
 *     summary: Crear un nuevo salón
 *     description: Añade un nuevo salón a la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/salones/{salon_id}:
 *   put:
 *     tags: [Salones]
 *     summary: Actualizar un salón existente
 *     description: Actualiza los datos de un salón específico por su ID. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []

 * @swagger
 * /api/v1/salones/{salon_id}:
 *   delete:
 *     tags: [Salones]
 *     summary: Eliminar un salón (Soft Delete)
 *     description: Marca un salón como inactivo (activo=0) en la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */