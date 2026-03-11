CREATE TABLE IF NOT EXISTS gdgocode_perimeter_readings (
  id SERIAL PRIMARY KEY,
  sector TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL,
  perimeter_index NUMERIC(10, 2) NOT NULL,
  incident_count INTEGER NOT NULL,
  status TEXT NOT NULL
);
