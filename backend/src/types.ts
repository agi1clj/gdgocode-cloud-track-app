export interface EventRow {
  id: number;
  sector: string;
  recorded_at: string;
  perimeter_index: string;
  incident_count: number;
  status: string;
}

export interface Event {
  id: number;
  sector: string;
  recordedAt: string;
  perimeterIndex: number;
  incidentCount: number;
  status: string;
}

export interface EventSummary {
  averagePerimeterIndex: number;
  peakSector: string;
  peakPerimeterIndex: number;
  eventCount: number;
}

export interface EventsResponse {
  events: Event[];
  summary: EventSummary;
  readOnly: boolean;
}
