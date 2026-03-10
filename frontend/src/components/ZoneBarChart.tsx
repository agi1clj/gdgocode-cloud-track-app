import { useState } from "react";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { formatOneDecimal } from "../lib/formatters";
import type { ZoneTotal } from "../types";

export function ZoneBarChart({ zones }: { zones: ZoneTotal[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const maxValue = Math.max(
    ...zones.map((zone) => zone.totalAirQualityIndex),
    1
  );
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const activeZone =
    zones.find((zone) => zone.zone === hoveredZone) ?? zones[0];

  return (
    <Card
      sx={{
        background:
          "linear-gradient(180deg, rgba(56,142,60,0.05) 0%, rgba(255,255,255,1) 56%)"
      }}
    >
      <CardContent>
        <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              AQI hotspots
            </Typography>
            <Typography variant="h5">Top AQI zone</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isMobile
                ? "Neighborhoods ranked by current AQI load."
                : "Which Cluj-Napoca neighborhood is carrying the highest AQI load."}
            </Typography>
          </Box>

          {activeZone ? (
            <Box
              sx={{
                p: { xs: 1.25, md: 1.75 },
                borderRadius: 4,
                bgcolor: alpha("#388E3C", 0.08),
                border: `1px solid ${alpha("#388E3C", 0.16)}`,
                display: "flex",
                alignItems: { xs: "flex-start", md: "center" },
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: 2
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#388E3C", 0.12),
                    color: "secondary.main"
                  }}
                >
                  <BoltRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Selected hotspot
                  </Typography>
                  <Typography variant="h6">{activeZone.zone}</Typography>
                </Box>
              </Stack>
              <Typography
                variant="h5"
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                {formatOneDecimal(activeZone.totalAirQualityIndex)}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        {zones.length === 0 ? (
          <Typography color="text.secondary">
            Load a sample scenario to compare zones.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {zones.map((zone, index) => (
              <Box
                key={zone.zone}
                sx={{
                  p: { xs: 1.2, md: 1.5 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor:
                    hoveredZone === zone.zone
                      ? alpha("#4285F4", 0.16)
                      : "divider",
                  bgcolor:
                    hoveredZone === zone.zone
                      ? alpha("#4285F4", 0.06)
                      : alpha("#fff", 0.8)
                }}
                onMouseEnter={() => {
                  setHoveredZone(zone.zone);
                }}
                onMouseLeave={() => {
                  setHoveredZone(null);
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "32px minmax(0, 1fr)",
                    gap: 1.5,
                    alignItems: "center",
                    mb: 1
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    0{index + 1}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", md: "baseline" },
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "space-between",
                      gap: 0.35
                    }}
                  >
                    <Typography fontWeight={700}>{zone.zone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatOneDecimal(zone.totalAirQualityIndex)}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    ml: "32px",
                    height: 14,
                    borderRadius: 999,
                    overflow: "hidden",
                    bgcolor: alpha("#4285F4", 0.1)
                  }}
                >
                  <Box
                    style={{
                      width: `${(zone.totalAirQualityIndex / maxValue) * 100}%`
                    }}
                    sx={{
                      height: "100%",
                      borderRadius: 999,
                      background:
                        "linear-gradient(90deg, #4285F4 0%, #388E3C 100%)"
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
