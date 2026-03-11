# Schema Migration Guide

This guide explains how to change the database structure in `gdgocode-cloud-track-app` without breaking the backend API or the frontend dashboard.

The short version:

1. add a new SQL migration
2. update backend row types and mapping
3. update service logic and API docs
4. update frontend types and UI if the response shape changed
5. run migrations, typecheck, and build

## Current flow

Today the main monitoring dataset looks like this:

- table: `gdgocode_perimeter_readings`
- migration source: `backend/src/migrations/001_init_perimeter_monitoring_schema.sql`
- backend row model: `backend/src/types.ts`
- backend service logic: `backend/src/services/events.ts`
- OpenAPI schema: `backend/src/docs/openapi.ts`
- frontend response types: `frontend/src/types.ts`
- frontend fetch layer: `frontend/src/lib/api.ts`
- frontend derived metrics: `frontend/src/lib/perimeter.ts`
- frontend dashboard composition: `frontend/src/App.tsx` and `frontend/src/components/*`

## Important rule

Do not edit an already-applied migration in place.

If the database schema needs to change, create a new numbered `.sql` migration in `backend/src/migrations/`.

Example:

- `002_add_drone_hits_column.sql`
- `003_replace_status_with_alert_band.sql`

The migration runner applies files in filename order and records them in `schema_migrations`.

## When you add a new column

Example: add `drone_hits INTEGER NOT NULL DEFAULT 0`.

### 1. Create a new SQL migration

Create `backend/src/migrations/002_add_drone_hits_column.sql`:

```sql
ALTER TABLE gdgocode_perimeter_readings
ADD COLUMN drone_hits INTEGER NOT NULL DEFAULT 0;
```

If the seed dataset should provide real values, also update:

- `backend/src/sampleData.ts`

## 2. Update backend row and API types

Update `backend/src/types.ts`.

Before:

```ts
export interface EventRow {
  id: number;
  sector: string;
  recorded_at: string;
  perimeter_index: string;
  incident_count: number;
  status: string;
}
```

After:

```ts
export interface EventRow {
  id: number;
  sector: string;
  recorded_at: string;
  perimeter_index: string;
  incident_count: number;
  drone_hits: number;
  status: string;
}
```

Do the same for the API-facing `Event` interface in the same file.

## 3. Update service queries and mapping

Update `backend/src/services/events.ts`.

There are usually three places to change:

1. `mapEvent()`
2. `SELECT` statements
3. `INSERT` statements for seeding

Example:

```ts
function mapEvent(row: EventRow): Event {
  return {
    id: row.id,
    sector: row.sector,
    recordedAt: row.recorded_at,
    perimeterIndex: Number(row.perimeter_index),
    incidentCount: row.incident_count,
    droneHits: row.drone_hits,
    status: row.status
  };
}
```

Also update:

- selected columns in `listEvents()`
- inserted columns in `seedEvents()`
- inserted values and placeholder count if seeding changed

## 4. Update the OpenAPI schema

Update `backend/src/docs/openapi.ts` so `/docs` and `/openapi.json` stay correct.

If the response shape changed, document the new property under:

- `components.schemas.Event`
- `components.schemas.Summary`
- `components.schemas.EventsResponse`

## 5. Update the frontend contract

If the backend response changed, update:

- `frontend/src/types.ts`
- any derived dashboard logic in `frontend/src/lib/perimeter.ts`
- any component using the changed field in `frontend/src/components/*`

Typical examples:

- new table column in `EventsSection.tsx`
- new stat card in `App.tsx`
- new chart input in `LineChart.tsx` or `SectorBarChart.tsx`

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
2. call `GET /api/events`
3. confirm the new field is present
4. open the frontend dashboard
5. confirm the UI renders without missing data or runtime errors

## Common change patterns

### Rename a column

Example: rename `perimeter_index` to `risk_score`.

You need to update:

- new SQL migration with `ALTER TABLE ... RENAME COLUMN ...`
- `backend/src/types.ts`
- `backend/src/services/events.ts`
- `backend/src/docs/openapi.ts`
- `frontend/src/types.ts`
- `frontend/src/lib/perimeter.ts`
- any UI component using the old field name

### Add a derived summary field

Example: add `averageIncidentCount` to the `summary`.

You do not need a schema migration if the value is computed only in code.

You do need to update:

- `backend/src/types.ts`
- `backend/src/services/events.ts` in `buildSummary()`
- `backend/src/docs/openapi.ts`
- `frontend/src/types.ts`
- UI that displays the new summary field

### Split one table into multiple tables

Treat this as an API refactor, not just a SQL change.

Minimum backend areas to update:

- new SQL migration files
- `backend/src/services/events.ts` queries
- seed logic in `backend/src/sampleData.ts` and `seedEvents()`
- API response types in `backend/src/types.ts`
- OpenAPI docs in `backend/src/docs/openapi.ts`

## If you want to change the current domain model entirely

For example:

- replace perimeter monitoring with convoy tracking
- add multiple sensor series
- store station IDs instead of sector names
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
