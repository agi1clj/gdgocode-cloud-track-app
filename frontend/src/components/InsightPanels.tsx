import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { statusSummary } from "../lib/perimeter";
import { formatOneDecimal } from "../lib/formatters";
import type { Reading, SectorTotal } from "../types";

type InsightPanelsProps = {
  readings: Reading[];
  spotlightSectors: SectorTotal[];
};

export function InsightPanels({
  readings,
  spotlightSectors
}: InsightPanelsProps) {
  const statusBreakdown = statusSummary(readings);
  const statusCards = [
    { label: "Normal", value: statusBreakdown.NORMAL ?? 0, color: "#388E3C" },
    { label: "Watch", value: statusBreakdown.WATCH ?? 0, color: "#F2BD42" },
    {
      label: "Critical",
      value: statusBreakdown.CRITICAL ?? 0,
      color: "#D95040"
    }
  ];

  return (
    <Stack component="section" spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Alert posture
              </Typography>
              <Typography variant="h5">Perimeter alert mix</Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))"
                }
              }}
            >
              {statusCards.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2.35,
                    borderRadius: 4,
                    bgcolor: alpha(item.color, 0.1),
                    border: `1px solid ${alpha(item.color, 0.14)}`
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Priority sectors
              </Typography>
              <Typography variant="h5">Top sectors</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Ranked by cumulative index in the current view.
              </Typography>
            </Box>

            {spotlightSectors.length === 0 ? (
              <Typography color="text.secondary">
                Load a scenario to see ranked sectors.
              </Typography>
            ) : (
              <Stack spacing={1.25}>
                {spotlightSectors.map((sector, index) => (
                  <Box
                    key={sector.sector}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      p: 1.85,
                      borderRadius: 4,
                      bgcolor: "grey.50"
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip
                        icon={<ApartmentRoundedIcon />}
                        label={`0${index + 1}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Box>
                        <Typography fontWeight={700}>
                          {sector.sector}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cumulative index in the current view:{" "}
                          {formatOneDecimal(sector.totalPerimeterIndex)}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography fontWeight={700}>
                      {formatOneDecimal(sector.totalPerimeterIndex)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
