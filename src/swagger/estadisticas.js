/**
 * @swagger
 * components:
 *   schemas:
 *     Estadisticas:
 *       type: object
 *       properties:
 *         total_reservas:
 *           type: integer
 *           description: Cantidad total de reservas activas.
 *           example: 3
 *         total_clientes:
 *           type: integer
 *           description: Cantidad total de usuarios (clientes) activos.
 *           example: 3
 *         ingresos_totales:
 *           type: string
 *           format: decimal
 *           description: Suma total de los importes de todas las reservas activas.
 *           example: "800000.00"
 *   responses:
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           example: "Falla"
 *         mensaje:
 *           type: string
 *           example: "Acceso denegado."

 * @swagger
 * tags:
 *   name: Estadísticas
 *   description: Endpoints para obtener estadísticas (solo Admin).

 * @swagger
 * /api/v1/estadisticas:
 *   get:
 *     tags:
 *       - Estadísticas
 *     summary: Obtener estadísticas generales
 *     description: Devuelve un resumen de las estadísticas clave del sistema. **Requiere rol de Administrador.**
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Estadísticas obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 estadisticas:
 *                   $ref: '#/components/schemas/Estadisticas'
 *       '401':
 *         description: Error de autenticación (Token inválido o no provisto).
 *       '403':
 *         description: Error de autorización (El usuario no es Administrador).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ForbiddenError'
 *       '404':
 *         description: No se encontraron estadísticas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "No se encontraron estadísticas."
 */