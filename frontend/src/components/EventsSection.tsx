import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatDateTime, formatOneDecimal } from "../lib/formatters";
import type { ActionState, Event } from "../types";

type EventsSectionProps = {
  loadingState: ActionState;
  events: Event[];
};

export function EventsSection({ loadingState, events }: EventsSectionProps) {
  const statusTone = (status: string) => {
    switch (status.toUpperCase()) {
      case "NORMAL":
        return {
          bg: alpha("#388E3C", 0.12),
          color: "#2E7D32"
        };
      case "WATCH":
        return {
          bg: alpha("#F2BD42", 0.22),
          color: "#9A6A00"
        };
      default:
        return {
          bg: alpha("#D95040", 0.12),
          color: "#B53A2D"
        };
    }
  };

  return (
    <Box component="section">
      <Card
        sx={{
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(242,189,66,0.08) 0%, rgba(255,255,255,1) 42%)"
        }}
      >
        <CardContent>
          <Stack
            direction="column"
            sx={{
              gap: 2,
              mb: 2
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  mb: 1.5
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Field events
                  </Typography>
                  <Typography variant="h5">Event log</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Timestamped index and incident events by sector.
                  </Typography>
                </Box>
                <Chip
                  label={
                    loadingState === "loading"
                      ? "Loading"
                      : `${events.length} events`
                  }
                  color="warning"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Chip
                icon={<SyncRoundedIcon />}
                label={
                  loadingState === "loading"
                    ? "Loading from API..."
                    : "Synced with API"
                }
                color={loadingState === "loading" ? "primary" : "secondary"}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
          </Stack>

          {loadingState === "loading" ? (
            <Stack spacing={1.25} aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} variant="rounded" height={52} />
              ))}
            </Stack>
          ) : events.length === 0 ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                bgcolor: "grey.50"
              }}
            >
              <Typography variant="h6">No events yet</Typography>
              <Typography color="text.secondary">
                Load a scenario to begin reviewing perimeter events.
              </Typography>
            </Box>
          ) : (
            <>
              <Stack
                sx={{
                  display: { xs: "flex", md: "none" },
                  gap: 1.25
                }}
              >
                {events.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      px: 2.5,
                      py: 2.1,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor:
                        event.status === "CRITICAL"
                          ? alpha("#D95040", 0.34)
                          : "divider",
                      bgcolor:
                        event.status === "CRITICAL"
                          ? alpha("#D95040", 0.05)
                          : alpha("#fff", 0.94),
                      boxShadow:
                        event.status === "CRITICAL"
                          ? "0 0 0 1px rgba(217,80,64,0.05), 0 16px 32px rgba(217,80,64,0.08)"
                          : "none"
                    }}
                  >
                    <Stack spacing={1.2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 1.75
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }}>
                            {event.sector}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.25 }}
                          >
                            {formatDateTime(event.recordedAt)}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            flexShrink: 0,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 999,
                            bgcolor: statusTone(event.status).bg,
                            color: statusTone(event.status).color,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            letterSpacing: "0.04em",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {event.status}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1.2
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Index
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {formatOneDecimal(event.perimeterIndex)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Incidents
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {event.incidentCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <TableContainer
                sx={{
                  display: { xs: "none", md: "block" },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: alpha("#fff", 0.92),
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    height: 8
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: alpha("#4285F4", 0.22),
                    borderRadius: 999
                  }
                }}
              >
                <Table
                  sx={{
                    minWidth: 760,
                    "& .MuiTableCell-root:first-of-type": {
                      pl: 4.5,
                      minWidth: 210,
                      whiteSpace: "nowrap"
                    },
                    "& .MuiTableCell-root:last-of-type": {
                      pr: 4
                    }
                  }}
                >
                  <TableHead sx={{ bgcolor: alpha("#4285F4", 0.05) }}>
                    <TableRow>
                      <TableCell>Sector</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Perimeter Index</TableCell>
                      <TableCell>Incidents</TableCell>
                      <TableCell>Alert Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow
                        key={event.id}
                        hover
                        sx={{
                          animationDelay: `${index * 70}ms`,
                          bgcolor:
                            event.status === "CRITICAL"
                              ? alpha("#D95040", 0.04)
                              : "transparent",
                          "&:hover": {
                            bgcolor:
                              event.status === "CRITICAL"
                                ? alpha("#D95040", 0.08)
                                : undefined
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>
                          {event.sector}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(event.recordedAt)}
                        </TableCell>
                        <TableCell>
                          {formatOneDecimal(event.perimeterIndex)}
                        </TableCell>
                        <TableCell>{event.incidentCount}</TableCell>
                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              px: 1.25,
                              py: 0.5,
                              borderRadius: 999,
                              bgcolor: statusTone(event.status).bg,
                              color: statusTone(event.status).color,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "0.04em"
                            }}
                          >
                            {event.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
