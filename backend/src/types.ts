export interface ReadingRow {
  id: number;
  zone: string;
  recorded_at: string;
  air_quality_index: string;
  pm25: number;
  status: string;
}

export interface Reading {
  id: number;
  zone: string;
  recordedAt: string;
  airQualityIndex: number;
  pm25: number;
  status: string;
}

export interface ReadingSummary {
  averageAirQualityIndex: number;
  peakZone: string;
  peakAirQualityIndex: number;
  readingCount: number;
}
