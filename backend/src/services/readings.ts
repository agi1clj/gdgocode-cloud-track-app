import { pool } from "../db.js";
import { sampleReadings } from "../sampleData.js";
import type { Reading, ReadingRow, ReadingSummary } from "../types.js";

function mapReading(row: ReadingRow): Reading {
  return {
    id: row.id,
    zone: row.zone,
    recordedAt: row.recorded_at,
    airQualityIndex: Number(row.air_quality_index),
    pm25: row.pm25,
    status: row.status
  };
}

function buildSummary(readings: Reading[]): ReadingSummary {
  const total = readings.reduce((sum, item) => sum + item.airQualityIndex, 0);
  const peak = readings.reduce(
    (currentPeak, item) =>
      item.airQualityIndex > currentPeak.airQualityIndex ? item : currentPeak,
    readings[0] || {
      id: 0,
      zone: "No data",
      recordedAt: "",
      airQualityIndex: 0,
      pm25: 0,
      status: "NORMAL"
    }
  );

  return {
    averageAirQualityIndex: readings.length ? total / readings.length : 0,
    peakZone: peak.zone,
    peakAirQualityIndex: peak.airQualityIndex,
    readingCount: readings.length
  };
}

export async function getDatabaseTime() {
  const result = await pool.query("SELECT NOW() AS database_time");
  return result.rows[0].database_time;
}

export async function listReadings() {
  const result = await pool.query<ReadingRow>(
    `SELECT id, zone, recorded_at, air_quality_index, pm25, status
     FROM gdgocode_readings
     ORDER BY recorded_at ASC`
  );

  const readings = result.rows.map(mapReading);

  return {
    readings,
    summary: buildSummary(readings)
  };
}

export async function seedReadings() {
  await pool.query("TRUNCATE TABLE gdgocode_readings RESTART IDENTITY");

  const values = sampleReadings.flatMap((reading) => [
    reading.zone,
    reading.recordedAt,
    reading.airQualityIndex,
    reading.pm25,
    reading.status
  ]);

  const placeholders = sampleReadings
    .map(
      (_, index) =>
        `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`
    )
    .join(", ");

  await pool.query(
    `INSERT INTO gdgocode_readings (zone, recorded_at, air_quality_index, pm25, status)
     VALUES ${placeholders}`,
    values
  );

  return {
    inserted: sampleReadings.length
  };
}

export async function clearReadings() {
  await pool.query("TRUNCATE TABLE gdgocode_readings RESTART IDENTITY");
}
