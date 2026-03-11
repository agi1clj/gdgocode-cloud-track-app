import type {
  DashboardScopeOption,
  Event,
  SectorTotal,
  Summary,
  TimeSeriesPoint
} from "../types";

export function statusSummary(events: Event[]) {
  return events.reduce<Record<string, number>>((accumulator, event) => {
    accumulator[event.status] = (accumulator[event.status] || 0) + 1;
    return accumulator;
  }, {});
}

export function topSectors(events: Event[]): SectorTotal[] {
  const totals = new Map<string, number>();

  for (const event of events) {
    totals.set(
      event.sector,
      (totals.get(event.sector) || 0) + event.perimeterIndex
    );
  }

  return [...totals.entries()]
    .map(([sector, totalPerimeterIndex]) => ({ sector, totalPerimeterIndex }))
    .sort((left, right) => right.totalPerimeterIndex - left.totalPerimeterIndex)
    .slice(0, 3);
}

export function perimeterSeries(events: Event[]): TimeSeriesPoint[] {
  return events.map((event) => ({
    label: new Date(event.recordedAt).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }),
    value: event.perimeterIndex
  }));
}

export function summarizeEvents(events: Event[]): Summary {
  const totalPerimeterIndex = events.reduce(
    (sum, item) => sum + item.perimeterIndex,
    0
  );

  const peakEvent = events.reduce<Event | null>((peak, event) => {
    if (!peak || event.perimeterIndex > peak.perimeterIndex) {
      return event;
    }

    return peak;
  }, null);

  return {
    averagePerimeterIndex: events.length
      ? totalPerimeterIndex / events.length
      : 0,
    peakSector: peakEvent?.sector ?? "No data",
    peakPerimeterIndex: peakEvent?.perimeterIndex ?? 0,
    eventCount: events.length
  };
}

export function perimeterScopeOptions(events: Event[]): DashboardScopeOption[] {
  const sectors = [...new Set(events.map((event) => event.sector))].sort();

  return [
    { label: "All sectors", value: "all" },
    ...sectors.map((sector) => ({ label: sector, value: sector }))
  ];
}

export function averageIncidentCount(events: Event[]) {
  return (
    events.reduce((sum, item) => sum + item.incidentCount, 0) /
    Math.max(events.length, 1)
  );
}

export function criticalSectorCount(events: Event[]) {
  return events.filter((event) => event.status === "CRITICAL").length;
}

export function criticalSectors(events: Event[]) {
  return [
    ...new Set(
      events
        .filter((event) => event.status === "CRITICAL")
        .map((event) => event.sector)
    )
  ];
}
