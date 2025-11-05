/**
 * @swagger
 * components:
 *   schemas:
 *     NotificacionInput:
 *       type: object
 *       required:
 *         - fecha
 *         - salon
 *         - turno
 *         - correoDestino
 *       properties:
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva confirmada.
 *           example: "2025-12-25"
 *         salon:
 *           type: string
 *           description: Nombre del salón reservado.
 *           example: "Salón Imperial"
 *         turno:
 *           type: string
 *           description: Descripción del turno reservado (ej. 'Tarde (14:00 - 18:00)').
 *           example: "Tarde (14:00 - 18:00)"
 *         correoDestino:
 *           type: string
 *           format: email
 *           description: Email del cliente al que se enviará la notificación.
 *           example: "cliente@ejemplo.com"

 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Endpoints para enviar notificaciones (ej. email).

 * @swagger
 * /api/v1/notificaciones:
 *   post:
 *     tags:
 *       - Notificaciones
 *     summary: Enviar una notificación de confirmación de reserva
 *     description: Envía un correo electrónico de confirmación de reserva a un cliente. **Requiere autenticación.**
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificacionInput'
 *     responses:
 *       '200':
 *         description: Correo enviado exitosamente.
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
 *                   example: "Correo enviado exitosamente."
 *                 info:
 *                   type: string
 *                   example: "<message-id@ejemplo.com>"
 *       '400':
 *         description: Error de validación (faltan datos).
 *       '401':
 *         description: Error de autenticación.
 *       '500':
 *         description: Error interno del servidor (fallo al enviar el correo).
 */