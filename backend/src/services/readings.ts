import { pool } from "../db.js";
import { sampleReadings } from "../sampleData.js";
import type {
  Reading,
  ReadingRow,
  ReadingsResponse,
  ReadingSummary
} from "../types.js";

export function isBackendReadOnly() {
  return process.env.BACKEND_READ_ONLY !== "false";
}

function mapReading(row: ReadingRow): Reading {
  return {
    id: row.id,
    sector: row.sector,
    recordedAt: row.recorded_at,
    perimeterIndex: Number(row.perimeter_index),
    incidentCount: row.incident_count,
    status: row.status
  };
}

function buildSummary(readings: Reading[]): ReadingSummary {
  const total = readings.reduce((sum, item) => sum + item.perimeterIndex, 0);
  const peak = readings.reduce(
    (currentPeak, item) =>
      item.perimeterIndex > currentPeak.perimeterIndex ? item : currentPeak,
    readings[0] || {
      id: 0,
      sector: "No data",
      recordedAt: "",
      perimeterIndex: 0,
      incidentCount: 0,
      status: "NORMAL"
    }
  );

  return {
    averagePerimeterIndex: readings.length ? total / readings.length : 0,
    peakSector: peak.sector,
    peakPerimeterIndex: peak.perimeterIndex,
    readingCount: readings.length
  };
}

export async function getDatabaseTime() {
  const result = await pool.query("SELECT NOW() AS database_time");
  return result.rows[0].database_time;
}

export async function listReadings(): Promise<ReadingsResponse> {
  const result = await pool.query<ReadingRow>(
    `SELECT id, sector, recorded_at, perimeter_index, incident_count, status
     FROM gdgocode_perimeter_readings
     ORDER BY recorded_at ASC`
  );

  const readings = result.rows.map(mapReading);

  return {
    readings,
    summary: buildSummary(readings),
    readOnly: isBackendReadOnly()
  };
}

export async function seedReadings() {
  await pool.query(
    "TRUNCATE TABLE gdgocode_perimeter_readings RESTART IDENTITY"
  );

  const values = sampleReadings.flatMap((reading) => [
    reading.sector,
    reading.recordedAt,
    reading.perimeterIndex,
    reading.incidentCount,
    reading.status
  ]);

  const placeholders = sampleReadings
    .map(
      (_, index) =>
        `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`
    )
    .join(", ");

  await pool.query(
    `INSERT INTO gdgocode_perimeter_readings (sector, recorded_at, perimeter_index, incident_count, status)
     VALUES ${placeholders}`,
    values
  );

  return {
    inserted: sampleReadings.length
  };
}

export async function clearReadings() {
  await pool.query(
    "TRUNCATE TABLE gdgocode_perimeter_readings RESTART IDENTITY"
  );
}
