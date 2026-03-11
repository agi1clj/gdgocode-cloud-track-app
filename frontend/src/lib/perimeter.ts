import type {
  DashboardScopeOption,
  Reading,
  SectorTotal,
  Summary,
  TimeSeriesPoint
} from "../types";

export function statusSummary(readings: Reading[]) {
  return readings.reduce<Record<string, number>>((accumulator, reading) => {
    accumulator[reading.status] = (accumulator[reading.status] || 0) + 1;
    return accumulator;
  }, {});
}

export function topSectors(readings: Reading[]): SectorTotal[] {
  const totals = new Map<string, number>();

  for (const reading of readings) {
    totals.set(
      reading.sector,
      (totals.get(reading.sector) || 0) + reading.perimeterIndex
    );
  }

  return [...totals.entries()]
    .map(([sector, totalPerimeterIndex]) => ({ sector, totalPerimeterIndex }))
    .sort((left, right) => right.totalPerimeterIndex - left.totalPerimeterIndex)
    .slice(0, 3);
}

export function perimeterSeries(readings: Reading[]): TimeSeriesPoint[] {
  return readings.map((reading) => ({
    label: new Date(reading.recordedAt).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }),
    value: reading.perimeterIndex
  }));
}

export function summarizeReadings(readings: Reading[]): Summary {
  const totalPerimeterIndex = readings.reduce(
    (sum, item) => sum + item.perimeterIndex,
    0
  );

  const peakReading = readings.reduce<Reading | null>((peak, reading) => {
    if (!peak || reading.perimeterIndex > peak.perimeterIndex) {
      return reading;
    }

    return peak;
  }, null);

  return {
    averagePerimeterIndex: readings.length
      ? totalPerimeterIndex / readings.length
      : 0,
    peakSector: peakReading?.sector ?? "No data",
    peakPerimeterIndex: peakReading?.perimeterIndex ?? 0,
    readingCount: readings.length
  };
}

export function perimeterScopeOptions(
  readings: Reading[]
): DashboardScopeOption[] {
  const sectors = [
    ...new Set(readings.map((reading) => reading.sector))
  ].sort();

  return [
    { label: "All sectors", value: "all" },
    ...sectors.map((sector) => ({ label: sector, value: sector }))
  ];
}

export function averageIncidentCount(readings: Reading[]) {
  return (
    readings.reduce((sum, item) => sum + item.incidentCount, 0) /
    Math.max(readings.length, 1)
  );
}

export function criticalSectorCount(readings: Reading[]) {
  return readings.filter((reading) => reading.status === "CRITICAL").length;
}
