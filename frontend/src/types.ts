export type Event = {
  id: number;
  sector: string;
  recordedAt: string;
  perimeterIndex: number;
  incidentCount: number;
  status: string;
};

export type Summary = {
  averagePerimeterIndex: number;
  peakSector: string;
  peakPerimeterIndex: number;
  eventCount: number;
};

export type DashboardScopeOption = {
  label: string;
  value: string;
};

export type EventsResponse = {
  events: Event[];
  summary: Summary;
  readOnly: boolean;
};

export type StatTone = "blue" | "red" | "green" | "yellow";

export type ActionState = "idle" | "loading" | "success";

export type StatCardDefinition = {
  label: string;
  value: string;
  meta?: string;
  tone: StatTone;
};

export type TimeSeriesPoint = {
  label: string;
  value: number;
};

export type SectorTotal = {
  sector: string;
  totalPerimeterIndex: number;
};

export type DeliverySignal = {
  label: string;
  tone: StatTone;
};
