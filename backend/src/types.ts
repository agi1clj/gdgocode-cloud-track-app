export interface ReadingRow {
  id: number;
  sector: string;
  recorded_at: string;
  perimeter_index: string;
  incident_count: number;
  status: string;
}

export interface Reading {
  id: number;
  sector: string;
  recordedAt: string;
  perimeterIndex: number;
  incidentCount: number;
  status: string;
}

export interface ReadingSummary {
  averagePerimeterIndex: number;
  peakSector: string;
  peakPerimeterIndex: number;
  readingCount: number;
}

export interface ReadingsResponse {
  readings: Reading[];
  summary: ReadingSummary;
  readOnly: boolean;
}
