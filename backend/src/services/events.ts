import { pool } from "../db.js";
import { sampleEvents } from "../sampleData.js";
import type {
  Event,
  EventRow,
  EventsResponse,
  EventSummary
} from "../types.js";

export function isBackendReadOnly() {
  return process.env.BACKEND_READ_ONLY !== "false";
}

function mapEvent(row: EventRow): Event {
  return {
    id: row.id,
    sector: row.sector,
    recordedAt: row.recorded_at,
    perimeterIndex: Number(row.perimeter_index),
    incidentCount: row.incident_count,
    status: row.status
  };
}

function buildSummary(events: Event[]): EventSummary {
  const total = events.reduce((sum, item) => sum + item.perimeterIndex, 0);
  const peak = events.reduce(
    (currentPeak, item) =>
      item.perimeterIndex > currentPeak.perimeterIndex ? item : currentPeak,
    events[0] || {
      id: 0,
      sector: "No data",
      recordedAt: "",
      perimeterIndex: 0,
      incidentCount: 0,
      status: "NORMAL"
    }
  );

  return {
    averagePerimeterIndex: events.length ? total / events.length : 0,
    peakSector: peak.sector,
    peakPerimeterIndex: peak.perimeterIndex,
    eventCount: events.length
  };
}

export async function getDatabaseTime() {
  const result = await pool.query("SELECT NOW() AS database_time");
  return result.rows[0].database_time;
}

export async function listEvents(): Promise<EventsResponse> {
  const result = await pool.query<EventRow>(
    `SELECT id, sector, recorded_at, perimeter_index, incident_count, status
     FROM gdgocode_perimeter_readings
     ORDER BY recorded_at ASC`
  );

  const events = result.rows.map(mapEvent);

  return {
    events,
    summary: buildSummary(events),
    readOnly: isBackendReadOnly()
  };
}

export async function seedEvents() {
  await pool.query(
    "TRUNCATE TABLE gdgocode_perimeter_readings RESTART IDENTITY"
  );

  const values = sampleEvents.flatMap((event) => [
    event.sector,
    event.recordedAt,
    event.perimeterIndex,
    event.incidentCount,
    event.status
  ]);

  const placeholders = sampleEvents
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
    inserted: sampleEvents.length
  };
}

export async function clearEvents() {
  await pool.query(
    "TRUNCATE TABLE gdgocode_perimeter_readings RESTART IDENTITY"
  );
}
