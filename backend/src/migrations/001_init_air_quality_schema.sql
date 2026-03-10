CREATE TABLE IF NOT EXISTS gdgocode_readings (
  id SERIAL PRIMARY KEY,
  zone TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL,
  air_quality_index NUMERIC(10, 2) NOT NULL,
  pm25 INTEGER NOT NULL,
  status TEXT NOT NULL
);
