import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DashboardHero } from "./components/DashboardHero";
import { EventsSection } from "./components/EventsSection";
import { InsightPanels } from "./components/InsightPanels";
import { StatCard } from "./components/StatCard";
import { DashboardControls } from "./components/DashboardControls";
import { LineChart } from "./components/LineChart";
import { SectorBarChart } from "./components/SectorBarChart";
import { getEventName } from "./config";
import {
  clearEvents,
  fetchEvents,
  logClientError,
  seedEvents
} from "./lib/api";
import { deliverySignals } from "./lib/dashboard";
import {
  averageIncidentCount,
  criticalSectorCount,
  criticalSectors,
  perimeterScopeOptions,
  perimeterSeries,
  summarizeEvents,
  topSectors
} from "./lib/perimeter";
import { formatOneDecimal, formatShortDateTime } from "./lib/formatters";
import type {
  ActionState,
  Event,
  EventsResponse,
  StatCardDefinition
} from "./types";

function App() {
  const eventName = getEventName();
  const [data, setData] = useState<EventsResponse | null>(null);
  const [loadingState, setLoadingState] = useState<ActionState>("loading");
  const [seedingState, setSeedingState] = useState<ActionState>("idle");
  const [resettingState, setResettingState] = useState<ActionState>("idle");
  const [scope, setScope] = useState("all");
  const [error, setError] = useState<string | null>(null);

  async function loadEvents() {
    setLoadingState("loading");
    setError(null);

    try {
      const payload = await fetchEvents();
      setData(payload);
      setLoadingState("success");
    } catch (loadError) {
      logClientError("Failed to load events", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unknown frontend error."
      );
      setLoadingState("idle");
    }
  }

  async function handleSeedData() {
    setSeedingState("loading");
    setError(null);

    try {
      await seedEvents();
      setSeedingState("success");
      await loadEvents();
    } catch (seedError) {
      logClientError("Failed to seed events", seedError);
      setError(
        seedError instanceof Error ? seedError.message : "Unknown seed error."
      );
      setSeedingState("idle");
    }
  }

  async function handleResetData() {
    setResettingState("loading");
    setError(null);

    try {
      await clearEvents();
      setResettingState("success");
      await loadEvents();
    } catch (resetError) {
      logClientError("Failed to clear events", resetError);
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Unknown reset error."
      );
      setResettingState("idle");
    }
  }

  useEffect(() => {
    void loadEvents();
  }, []);

  useLayoutEffect(() => {
    document.title = "Perimeter Watch";
  });

  const events = data?.events ?? [];
  const readOnly = data?.readOnly ?? true;
  const scopeOptions = useMemo(() => perimeterScopeOptions(events), [events]);
  const filteredEvents = useMemo(
    () =>
      scope === "all"
        ? events
        : events.filter((event: Event) => event.sector === scope),
    [events, scope]
  );

  useEffect(() => {
    if (!scopeOptions.some((option) => option.value === scope)) {
      setScope("all");
    }
  }, [scope, scopeOptions]);

  const summary = useMemo(
    () => summarizeEvents(filteredEvents),
    [filteredEvents]
  );
  const latestTimestamp = filteredEvents.at(-1)?.recordedAt;
  const lastUpdatedLabel = latestTimestamp
    ? `Updated ${formatShortDateTime(latestTimestamp)}`
    : "No events yet";

  const stats = useMemo<StatCardDefinition[]>(
    () => [
      {
        label: "Sensor events",
        value: String(summary.eventCount ?? 0),
        meta:
          loadingState === "loading"
            ? "Refreshing latest events"
            : scope === "all"
              ? "Across all sectors"
              : `${scope} events`,
        tone: "blue"
      },
      {
        label: "Avg index",
        value: formatOneDecimal(summary.averagePerimeterIndex ?? 0),
        meta: scope === "all" ? "Across all sectors" : `${scope} pressure`,
        tone: "red"
      },
      {
        label: "Avg incidents",
        value: formatOneDecimal(averageIncidentCount(filteredEvents)),
        meta: "Average incidents per event",
        tone: "green"
      },
      {
        label: "Peak event sector",
        value: summary.peakSector ?? "No data",
        meta:
          summary.eventCount > 0
            ? `Highest single-event index ${formatOneDecimal(summary.peakPerimeterIndex)}`
            : "Load a scenario first",
        tone: "yellow"
      }
    ],
    [filteredEvents, loadingState, scope, summary]
  );

  const spotlightSectors = useMemo(
    () => topSectors(filteredEvents),
    [filteredEvents]
  );
  const timeSeries = useMemo(
    () => perimeterSeries(filteredEvents),
    [filteredEvents]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        background: `
          radial-gradient(circle at top left, rgba(25, 118, 210, 0.08), transparent 24%),
          radial-gradient(circle at top right, rgba(217, 80, 64, 0.09), transparent 22%),
          linear-gradient(180deg, #fbfcff 0%, #f5f7fb 42%, #ffffff 100%)
        `
      }}
    >
      <Container maxWidth="xl">
        <Box
          component="main"
          sx={{
            display: "grid",
            gap: { xs: 2, md: 2.5 },
            gridTemplateColumns: "minmax(0, 1fr)"
          }}
        >
          <DashboardHero
            deliverySignals={deliverySignals}
            summary={summary}
            lastUpdatedLabel={lastUpdatedLabel}
            scope={scope}
            criticalCount={criticalSectorCount(filteredEvents)}
            criticalSectors={criticalSectors(filteredEvents)}
          />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {readOnly ? (
            <Alert severity="info">
              Backend is running in read-only mode. Refresh is available, but
              scenario load and clear actions are disabled.
            </Alert>
          ) : null}

          <DashboardControls
            loadingState={loadingState}
            seedingState={seedingState}
            resettingState={resettingState}
            readOnly={readOnly}
            scope={scope}
            scopeOptions={scopeOptions}
            lastUpdatedLabel={lastUpdatedLabel}
            onSeed={() => {
              void handleSeedData();
            }}
            onRefresh={() => {
              void loadEvents();
            }}
            onReset={() => {
              void handleResetData();
            }}
            onScopeChange={setScope}
          />

          <Box
            component="section"
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))"
              }
            }}
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </Box>

          <Box
            component="section"
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                xl: "minmax(0, 1.15fr) minmax(300px, 0.85fr)"
              },
              alignItems: "start"
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "minmax(0, 1.3fr) minmax(0, 0.9fr)"
                }
              }}
            >
              <LineChart points={timeSeries} />
              <SectorBarChart sectors={spotlightSectors} />
            </Box>

            <Stack spacing={2}>
              <Box
                sx={{
                  px: { xs: 0, md: 1 },
                  display: { xs: "none", xl: "block" }
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  Operations Overview
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    maxWidth: { xs: "none", md: "none" },
                    whiteSpace: { xs: "normal", xl: "nowrap" }
                  }}
                >
                  Site posture at a glance
                </Typography>
              </Box>
              <InsightPanels
                events={filteredEvents}
                spotlightSectors={spotlightSectors}
              />
            </Stack>
          </Box>

          <EventsSection loadingState={loadingState} events={filteredEvents} />

          <Card
            component="section"
            sx={{
              background:
                "linear-gradient(180deg, rgba(25,118,210,0.04) 0%, rgba(255,255,255,1) 100%)"
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: {
                    xs: "1fr",
                    lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)"
                  }
                }}
              >
                <Stack spacing={1.5}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    About This Build
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: { xs: "1.35rem", md: "1.5rem" } }}
                  >
                    Built to feel like a believable defense dashboard
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      maxWidth: "68ch",
                      display: { xs: "none", sm: "block" }
                    }}
                  >
                    Alert posture, sector pressure, and incident logs in one
                    starter app students can extend with maps, alerts, drones,
                    and response flows.
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip
                      label={eventName}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label="Defense challenge starter"
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip label="Romania sectors" variant="outlined" />
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: "transparent",
                    border: `1px solid ${alpha("#4285F4", 0.1)}`
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="overline" sx={{ fontWeight: 700 }}>
                      Sponsor
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Box
                        component="img"
                        src="/RebelDot-logo-small.png"
                        alt="RebelDot logo"
                        sx={{ width: "100%", maxWidth: 220, height: "auto" }}
                      />
                    </Box>
                    <Divider />
                    <Typography color="text.secondary">
                      RebelDot supported the GDGoCode 2026 Cloud Track delivery
                      environment for this perimeter monitoring starter.
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
