/**
 * @swagger
 * components:
 *   schemas:
 *     ServicioItemInput:
 *       type: object
 *       required:
 *         - servicio_id
 *         - importe
 *       properties:
 *         servicio_id:
 *           type: integer
 *           description: ID del servicio a contratar.
 *           example: 1
 *         importe:
 *           type: integer
 *           description: Importe del servicio.
 *           example: 1000
 *     ReservaInput:
 *       type: object
 *       required:
 *         - fecha_reserva
 *         - salon_id
 *         - usuario_id
 *         - turno_id
 *         - servicios
 *       properties:
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva (YYYY-MM-DD).
 *           example: "2025-12-25"
 *         salon_id:
 *           type: integer
 *           description: ID del salón a reservar.
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario (cliente) que hace la reserva.
 *           example: 3
 *         turno_id:
 *           type: integer
 *           description: ID del turno a reservar.
 *           example: 2
 *         foto_cumpleaniero:
 *           type: string
 *           description: URL de la foto del cumpleañero (opcional).
 *           example: "https://ejemplo.com/foto.png"
 *         tematica:
 *           type: string
 *           description: Temática de la fiesta (opcional).
 *           example: "Superhéroes"
 *         servicios:
 *           type: array
 *           description: Lista de servicios a contratar.
 *           items:
 *             $ref: '#/components/schemas/ServicioItemInput'
 *     Reserva:
 *       type: object
 *       properties:
 *         reserva_id:
 *           type: integer
 *           example: 1
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           example: "2025-12-25"
 *         salon_id:
 *           type: integer
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           example: 3
 *         turno_id:
 *           type: integer
 *           example: 2
 *         foto_cumpleaniero:
 *           type: string
 *           nullable: true
 *           example: "https://ejemplo.com/foto.png"
 *         tematica:
 *           type: string
 *           nullable: true
 *           example: "Superhéroes"
 *         importe_salon:
 *           type: string
 *           format: decimal
 *           example: "50000.00"
 *         importe_total:
 *           type: string
 *           format: decimal
 *           example: "80000.00"
 *         creado:
 *           type: string
 *           format: date-time
 *           example: "2025-11-05T01:10:00.000Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           example: "2025-11-05T01:10:00.000Z"
 *         activo:
 *           type: integer
 *           example: 1
 *   responses:
 *     ReservaNotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Reserva no encontrada."

 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para la gestión de reservas.

 * @swagger
 * /api/v1/reservas:
 *   get:
 *     tags: [Reservas]
 *     summary: Listar todas las reservas activas
 *     description: |
 *       Obtiene una lista de reservas activas.
 *       - **Si es Admin (rol 1) o Empleado (rol 2):** Devuelve todas las reservas.
 *       - **Si es Cliente (rol 3):** Devuelve solo las reservas propias.
 *       **Requiere rol Cliente, Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de reservas obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 reservas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reserva'
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.


 * @swagger
 * /api/v1/reservas/informe:
 *   get:
 *     tags: [Reservas]
 *     summary: Generar informe de reservas (PDF/CSV)
 *     description: Genera un informe completo de todas las reservas en formato PDF o CSV. **Requiere rol Admin.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *         description: El formato deseado para el informe (pdf o csv).
 *     responses:
 *       '200':
 *         description: Archivo PDF o CSV generado exitosamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *       '400':
 *         description: Error de validación (formato inválido).
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización (solo Admin).


 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   get:
 *     tags: [Reservas]
 *     summary: Buscar una reserva por ID
 *     description: Obtiene los detalles de una reserva específica por su ID. **Requiere rol Cliente, Empleado o Admin.**
 *       (Un cliente solo podrá verla si es suya).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a buscar.
 *     responses:
 *       '200':
 *         description: Datos de la reserva obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 *       '404':
 *         description: Reserva no encontrada (o no pertenece al cliente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ReservaNotFoundError'


 * @swagger
 * /api/v1/reservas:
 *   post:
 *     tags: [Reservas]
 *     summary: Crear una nueva reserva
 *     description: Añade una nueva reserva a la base de datos. **Requiere rol Cliente o Admin.**
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       '201':
 *         description: Reserva creada exitosamente.
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
 *                   example: "Reserva creada exitosamente."
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       '400':
 *         description: Error de validación (campos faltantes o inválidos).
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 

 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   put:
 *     tags: [Reservas]
 *     summary: Actualizar una reserva existente (Solo Admin)
 *     description: Actualiza los datos de una reserva específica por su ID. **Requiere rol Admin.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       '200':
 *         description: Reserva actualizada exitosamente.
 *       '400':
 *         description: Error de validación.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización (solo Admin).
 *       '404':
 *         description: Reserva no encontrada.


 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   delete:
 *     tags: [Reservas]
 *     summary: Eliminar una reserva (Soft Delete) (Solo Admin)
 *     description: Marca una reserva como inactiva (activo=0) en la base de datos. **Requiere rol Admin.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar.
 *     responses:
 *       '200':
 *         description: Reserva eliminada exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización (solo Admin).
 *       '404':
 *         description: Reserva no encontrada.
 */