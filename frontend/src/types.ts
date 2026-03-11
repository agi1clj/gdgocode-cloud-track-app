export type Reading = {
  id: number;
  zone: string;
  recordedAt: string;
  airQualityIndex: number;
  pm25: number;
  status: string;
};

export type Summary = {
  averageAirQualityIndex: number;
  peakZone: string;
  peakAirQualityIndex: number;
  readingCount: number;
};

export type DashboardScopeOption = {
  label: string;
  value: string;
};

export type ReadingsResponse = {
  readings: Reading[];
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

export type ZoneTotal = {
  zone: string;
  totalAirQualityIndex: number;
};

export type DeliverySignal = {
  label: string;
  tone: StatTone;
};
