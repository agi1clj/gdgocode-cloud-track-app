/**
 * @openapi
 * /api/readings:
 *   get:
 *     tags:
 *       - Readings
 *     summary: List all Cluj air quality readings and summary data
 *     responses:
 *       200:
 *         description: Readings returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadingsResponse'
 */
export const readingsPathDocs = true;
