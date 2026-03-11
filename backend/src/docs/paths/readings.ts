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
 *   delete:
 *     tags:
 *       - Readings
 *     summary: Clear all readings
 *     responses:
 *       204:
 *         description: Readings cleared successfully
 *       403:
 *         description: Backend is in read-only mode
 * /api/readings/seed:
 *   post:
 *     tags:
 *       - Readings
 *     summary: Seed the sample readings dataset
 *     responses:
 *       201:
 *         description: Sample readings inserted successfully
 *       403:
 *         description: Backend is in read-only mode
 */
export const readingsPathDocs = true;
