import type {
  DashboardScopeOption,
  DeliverySignal,
  Reading,
  Summary,
  TimeSeriesPoint,
  ZoneTotal
} from "../types";

export const deliverySignals: DeliverySignal[] = [
  { label: "Dashboard", tone: "green" },
  { label: "API", tone: "green" },
  { label: "Database", tone: "green" }
];

export function statusSummary(readings: Reading[]) {
  return readings.reduce<Record<string, number>>((accumulator, reading) => {
    accumulator[reading.status] = (accumulator[reading.status] || 0) + 1;
    return accumulator;
  }, {});
}

export function topZones(readings: Reading[]): ZoneTotal[] {
  const totals = new Map<string, number>();

  for (const reading of readings) {
    totals.set(
      reading.zone,
      (totals.get(reading.zone) || 0) + reading.airQualityIndex
    );
  }

  return [...totals.entries()]
    .map(([zone, totalAirQualityIndex]) => ({ zone, totalAirQualityIndex }))
    .sort(
      (left, right) => right.totalAirQualityIndex - left.totalAirQualityIndex
    )
    .slice(0, 3);
}

export function consumptionSeries(readings: Reading[]): TimeSeriesPoint[] {
  return readings.map((reading) => ({
    label: new Date(reading.recordedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    value: reading.airQualityIndex
  }));
}

export function summarizeReadings(readings: Reading[]): Summary {
  const totalAirQualityIndex = readings.reduce(
    (sum, item) => sum + item.airQualityIndex,
    0
  );

  const peakReading = readings.reduce<Reading | null>((peak, reading) => {
    if (!peak || reading.airQualityIndex > peak.airQualityIndex) {
      return reading;
    }

    return peak;
  }, null);

  return {
    averageAirQualityIndex: readings.length
      ? totalAirQualityIndex / readings.length
      : 0,
    peakZone: peakReading?.zone ?? "No data",
    peakAirQualityIndex: peakReading?.airQualityIndex ?? 0,
    readingCount: readings.length
  };
}

export function dashboardScopeOptions(
  readings: Reading[]
): DashboardScopeOption[] {
  const zones = [...new Set(readings.map((reading) => reading.zone))].sort();

  return [
    { label: "All zones", value: "all" },
    ...zones.map((zone) => ({ label: zone, value: zone }))
  ];
}
