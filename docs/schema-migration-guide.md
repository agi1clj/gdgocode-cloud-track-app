# Schema Migration Guide

This guide explains how to change the database structure in `gdgocode-cloud-track-app` without breaking the backend API or the frontend dashboard.

The short version:

1. add a new SQL migration
2. update backend row types and mapping
3. update service logic and API docs
4. update frontend types and UI if the response shape changed
5. run migrations, typecheck, and build

## Mentor summary

If a student team wants to change the data model, mentors should tell them to
follow this order and not skip steps:

1. create a new SQL migration file, never edit an old applied migration
2. update backend types and query mapping
3. update OpenAPI docs
4. update frontend types and dashboard components
5. run `npm run check` and `npm run build`
6. verify `/docs`, `GET /api/readings`, and the dashboard UI

Mentor review focus:

- the migration is additive or intentionally breaking
- seed data still works
- backend and frontend types stay aligned
- the API docs reflect the new response
- the UI does not silently ignore the new field

Mentor red flags:

- student edited `001_init_air_quality_schema.sql` after it was already used
- SQL changed but `backend/src/types.ts` did not
- backend response changed but `frontend/src/types.ts` did not
- `/docs` still shows the old schema
- build passes only for frontend or only for backend, not both

## Current flow

Today the main AQI dataset looks like this:

- table: `gdgocode_readings`
- migration source: `backend/src/migrations/001_init_air_quality_schema.sql`
- backend row model: `backend/src/types.ts`
- backend service logic: `backend/src/services/readings.ts`
- OpenAPI schema: `backend/src/docs/schemas.ts`
- frontend response types: `frontend/src/types.ts`
- frontend fetch layer: `frontend/src/lib/api.ts`
- frontend dashboard composition: `frontend/src/App.tsx` and `frontend/src/components/*`

## Important rule

Do not edit an already-applied migration in place.

If the database schema needs to change, create a new numbered `.sql` migration in `backend/src/migrations/`.

Example:

- `002_add_no2_column.sql`
- `003_replace_status_with_risk_band.sql`

The migration runner applies files in filename order and records them in `schema_migrations`.

Relevant files:

- `backend/src/migrations.ts`
- `backend/src/migrate.ts`

## When you add a new column

Example: add `no2 INTEGER NOT NULL DEFAULT 0`.

### 1. Create a new SQL migration

Create `backend/src/migrations/002_add_no2_column.sql`:

```sql
ALTER TABLE gdgocode_readings
ADD COLUMN no2 INTEGER NOT NULL DEFAULT 0;
```

If the seed dataset should provide real values, also update:

- `backend/src/sampleData.ts`

## 2. Update backend row and API types

Update `backend/src/types.ts`.

Before:

```ts
export interface ReadingRow {
  id: number;
  zone: string;
  recorded_at: string;
  air_quality_index: string;
  pm25: number;
  status: string;
}
```

After:

```ts
export interface ReadingRow {
  id: number;
  zone: string;
  recorded_at: string;
  air_quality_index: string;
  pm25: number;
  no2: number;
  status: string;
}
```

Do the same for the API-facing `Reading` interface in the same file.

## 3. Update service queries and mapping

Update `backend/src/services/readings.ts`.

There are usually three places to change:

1. `mapReading()`
2. `SELECT` statements
3. `INSERT` statements for seeding

Example:

```ts
function mapReading(row: ReadingRow): Reading {
  return {
    id: row.id,
    zone: row.zone,
    recordedAt: row.recorded_at,
    airQualityIndex: Number(row.air_quality_index),
    pm25: row.pm25,
    no2: row.no2,
    status: row.status
  };
}
```

Also update:

- selected columns in `listReadings()`
- inserted columns in `seedReadings()`
- inserted values and placeholder count if seeding changed

## 4. Update the OpenAPI schema

Update `backend/src/docs/schemas.ts` so `/docs` and `/openapi.json` stay correct.

If the response shape changed, document the new property under:

- `components.schemas.Reading`
- `components.schemas.Summary`
- `components.schemas.ReadingsResponse`

## 5. Update the frontend contract

If the backend response changed, update:

- `frontend/src/types.ts`
- any derived dashboard logic in `frontend/src/lib/dashboard.ts`
- any component using the changed field in `frontend/src/components/*`

Typical examples:

- new table column in `ReadingsSection.tsx`
- new stat card in `App.tsx`
- new chart input in `LineChart.tsx` or `ZoneBarChart.tsx`

If the response URL or request shape changed, also update:

- `frontend/src/lib/api.ts`

## 6. Apply the migration locally

From the repo root:

```bash
npm run db:migrate
```

Or start the app normally:

```bash
npm run dev
```

The backend also runs migrations on startup.

## 7. Verify the whole stack

From the repo root:

```bash
npm run check
npm run build
```

Then verify manually:

1. open `/docs`
2. call `GET /api/readings`
3. confirm the new field is present
4. open the frontend dashboard
5. confirm the UI renders without missing data or runtime errors

## Common change patterns

### Rename a column

Example: rename `air_quality_index` to `aqi`.

You need to update:

- new SQL migration with `ALTER TABLE ... RENAME COLUMN ...`
- `backend/src/types.ts`
- `backend/src/services/readings.ts`
- `backend/src/docs/schemas.ts`
- `frontend/src/types.ts`
- `frontend/src/lib/dashboard.ts`
- any UI component using the old field name

This is a breaking change unless you keep backward compatibility in the API.

### Add a derived summary field

Example: add `averagePm25` to the `summary`.

You do not need a schema migration if the value is computed only in code.

You do need to update:

- `backend/src/types.ts`
- `backend/src/services/readings.ts` in `buildSummary()`
- `backend/src/docs/schemas.ts`
- `frontend/src/types.ts`
- UI that displays the new summary field

### Split one table into multiple tables

This is a larger change.

Minimum backend areas to update:

- new SQL migration files
- `backend/src/services/readings.ts` queries
- seed logic in `backend/src/sampleData.ts` and `seedReadings()`
- API response types in `backend/src/types.ts`
- OpenAPI docs in `backend/src/docs/schemas.ts`

Treat this as an API refactor, not just a SQL change.

## Backward compatibility advice

If students or teammates already depend on the current API, prefer additive changes first:

- add a new field
- keep the old field temporarily
- update frontend usage
- remove the old field in a later migration/release

This is safer than renaming or removing fields immediately.

## Mentor review checklist

Use this when reviewing a team PR or helping live during the workshop:

1. check that a new migration file was added under `backend/src/migrations/`
2. confirm the migration filename sorts correctly, for example `002_...sql`
3. confirm sample data still matches the new schema if seeding is used
4. confirm `backend/src/types.ts` matches the SQL shape
5. confirm `backend/src/services/readings.ts` selects, maps, and inserts the new fields
6. confirm `backend/src/docs/schemas.ts` matches the API response
7. confirm `frontend/src/types.ts` matches the backend response
8. confirm the dashboard actually displays or intentionally ignores the new field
9. run `npm run check`
10. run `npm run build`

## Suggested checklist for PRs

- new migration file added under `backend/src/migrations/`
- sample data updated if needed
- backend types updated
- service queries and mapping updated
- OpenAPI docs updated
- frontend types updated
- dashboard UI updated
- `npm run check` passes
- `npm run build` passes
- `/docs` reflects the new contract

## Files you will most often touch

Backend:

- `backend/src/migrations/*.sql`
- `backend/src/sampleData.ts`
- `backend/src/types.ts`
- `backend/src/services/readings.ts`
- `backend/src/docs/schemas.ts`
- sometimes `backend/src/routes/readings.ts`

Frontend:

- `frontend/src/types.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/dashboard.ts`
- `frontend/src/App.tsx`
- `frontend/src/components/ReadingsSection.tsx`
- chart components if the visualized metric changed

## If you want to change the current AQI domain model entirely

For example:

- replace AQI with a different environmental metric
- add multiple pollutant series
- store station IDs instead of zone names
- add historical aggregation tables

Use this order:

1. change the SQL schema with a new migration
2. update seed data
3. update backend types and queries
4. update the API contract and docs
5. update frontend types
6. update dashboard logic and components
7. run `npm run check` and `npm run build`

If the API response shape changes significantly, update the frontend in the same PR so the repo does not sit in a half-migrated state.
