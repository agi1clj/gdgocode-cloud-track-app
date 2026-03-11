import { useState } from "react";
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
import type { SectorTotal } from "../types";

export function SectorBarChart({ sectors }: { sectors: SectorTotal[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const maxValue = Math.max(
    ...sectors.map((sector) => sector.totalPerimeterIndex),
    1
  );
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  return (
    <Card
      sx={{
        background:
          "linear-gradient(180deg, rgba(217,80,64,0.05) 0%, rgba(255,255,255,1) 56%)"
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
              Sector hotspots
            </Typography>
            <Typography variant="h5">Top sector</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isMobile
                ? "Sectors ranked by cumulative index."
                : "Sectors ranked by cumulative index in the current view."}
            </Typography>
          </Box>
        </Stack>

        {sectors.length === 0 ? (
          <Typography color="text.secondary">
            Load a scenario to compare sectors.
          </Typography>
        ) : (
          <Box
            sx={{ display: "grid", gap: 1.5 }}
            onMouseLeave={() => {
              setHoveredSector(null);
            }}
          >
            {sectors.map((sector, index) => (
              <Box
                key={sector.sector}
                sx={{
                  p: { xs: 1.55, md: 1.85 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor:
                    hoveredSector === sector.sector
                      ? alpha("#4285F4", 0.16)
                      : "divider",
                  bgcolor:
                    hoveredSector === sector.sector
                      ? alpha("#4285F4", 0.06)
                      : alpha("#fff", 0.8)
                }}
                onMouseEnter={() => {
                  setHoveredSector(sector.sector);
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
                    <Typography fontWeight={700}>{sector.sector}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatOneDecimal(sector.totalPerimeterIndex)}
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
                      width: `${(sector.totalPerimeterIndex / maxValue) * 100}%`
                    }}
                    sx={{
                      height: "100%",
                      borderRadius: 999,
                      background:
                        "linear-gradient(90deg, #4285F4 0%, #D95040 100%)"
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
