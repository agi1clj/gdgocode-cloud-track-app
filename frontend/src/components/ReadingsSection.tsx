import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
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
import type { ActionState, Reading } from "../types";

type ReadingsSectionProps = {
  loadingState: ActionState;
  readings: Reading[];
};

export function ReadingsSection({
  loadingState,
  readings
}: ReadingsSectionProps) {
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
                    AQI dataset
                  </Typography>
                  <Typography variant="h5">Cluj-Napoca AQI readings</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Timestamped AQI and PM2.5 observations for each monitored
                    Cluj-Napoca zone.
                  </Typography>
                </Box>
                <Chip
                  label={
                    loadingState === "loading"
                      ? "Loading"
                      : `${readings.length} rows`
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
          ) : readings.length === 0 ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                bgcolor: "grey.50"
              }}
            >
              <Typography variant="h6">No readings yet</Typography>
              <Typography color="text.secondary">
                Load a sample scenario to begin reviewing Cluj observations.
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
                {readings.map((reading) => (
                  <Box
                    key={reading.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: alpha("#fff", 0.94)
                    }}
                  >
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 1
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }}>
                            {reading.zone}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.25 }}
                          >
                            {formatDateTime(reading.recordedAt)}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            px: 1.1,
                            py: 0.45,
                            borderRadius: 999,
                            bgcolor: statusTone(reading.status).bg,
                            color: statusTone(reading.status).color,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            letterSpacing: "0.04em",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {reading.status}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            AQI
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {formatOneDecimal(reading.airQualityIndex)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            PM2.5
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {reading.pm25}
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
                      <TableCell>Neighborhood</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>AQI</TableCell>
                      <TableCell>PM2.5</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readings.map((reading, index) => (
                      <TableRow
                        key={reading.id}
                        hover
                        sx={{
                          animationDelay: `${index * 70}ms`
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>
                          {reading.zone}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(reading.recordedAt)}
                        </TableCell>
                        <TableCell>
                          {formatOneDecimal(reading.airQualityIndex)}
                        </TableCell>
                        <TableCell>{reading.pm25}</TableCell>
                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              px: 1.25,
                              py: 0.5,
                              borderRadius: 999,
                              bgcolor: statusTone(reading.status).bg,
                              color: statusTone(reading.status).color,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "0.04em"
                            }}
                          >
                            {reading.status}
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
