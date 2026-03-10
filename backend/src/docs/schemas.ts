/**
 * @openapi
 * components:
 *   schemas:
 *     Reading:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         zone:
 *           type: string
 *           example: Marasti
 *         recordedAt:
 *           type: string
 *           format: date-time
 *         airQualityIndex:
 *           type: number
 *           example: 38
 *         pm25:
 *           type: integer
 *           example: 14
 *         status:
 *           type: string
 *           example: NORMAL
 *     Summary:
 *       type: object
 *       properties:
 *         averageAirQualityIndex:
 *           type: number
 *           example: 46.5
 *         peakZone:
 *           type: string
 *           example: Manastur
 *         peakAirQualityIndex:
 *           type: number
 *           example: 74
 *         readingCount:
 *           type: integer
 *           example: 6
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         service:
 *           type: string
 *           example: gdgocode-cloud-track-backend
 *         databaseTime:
 *           type: string
 *           format: date-time
 *     ReadingsResponse:
 *       type: object
 *       properties:
 *         readings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reading'
 *         summary:
 *           $ref: '#/components/schemas/Summary'
 */
export const openApiSchemas = true;
export {};
