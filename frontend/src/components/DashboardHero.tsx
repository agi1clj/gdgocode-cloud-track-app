import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getApiBaseUrl } from "../config";
import type { DeliverySignal, Summary } from "../types";

type DashboardHeroProps = {
  deliverySignals: DeliverySignal[];
  summary: Summary;
  lastUpdatedLabel: string;
  scope: string;
  criticalCount: number;
};

export function DashboardHero({
  deliverySignals,
  summary,
  lastUpdatedLabel,
  scope,
  criticalCount
}: DashboardHeroProps) {
  const apiBaseUrl = getApiBaseUrl();
  const heroStats = [
    {
      tone: "blue",
      label: "Scope",
      value: scope === "all" ? "All sectors" : scope
    },
    {
      tone: "green",
      label: "Latest batch",
      value: `${summary.readingCount} events`
    },
    {
      tone: "red",
      label: "Peak sector",
      value: summary.peakSector
    }
  ] as const;
  const perimeterBands = [
    { label: "Stable", range: "0-30", color: "#388E3C" },
    { label: "Watch", range: "31-60", color: "#F2BD42" },
    { label: "Critical", range: "61+", color: "#D95040" }
  ] as const;
  const statToneStyles = {
    blue: {
      backgroundColor: alpha("#4285F4", 0.08),
      borderColor: alpha("#4285F4", 0.16)
    },
    green: {
      backgroundColor: alpha("#388E3C", 0.08),
      borderColor: alpha("#388E3C", 0.16)
    },
    red: {
      backgroundColor: alpha("#D95040", 0.08),
      borderColor: alpha("#D95040", 0.16)
    }
  } as const;
  const compactHeroStats = heroStats.slice(0, 2);

  return (
    <Card
      component="section"
      sx={{
        overflow: "hidden",
        backgroundColor: "#fff",
        color: "text.primary",
        position: "relative",
        "@keyframes heroFloat": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" }
        },
        "@keyframes heroPulse": {
          "0%": { opacity: 0.45, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.08)" },
          "100%": { opacity: 0.45, transform: "scale(1)" }
        },
        "@keyframes heroBars": {
          "0%, 100%": { transform: "scaleY(0.65)" },
          "50%": { transform: "scaleY(1)" }
        },
        "@keyframes alertSweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" }
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.25, sm: 3, md: 4 } }}>
        <Stack spacing={{ xs: 2.25, md: 3.5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={1}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700, lineHeight: 1.2 }}
            >
              GDGoCode Hackathon 2026
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                icon={<PlaceRoundedIcon />}
                label="Romania"
                size="small"
                sx={{
                  color: "primary.dark",
                  bgcolor: alpha("#4285F4", 0.1),
                  border: `1px solid ${alpha("#4285F4", 0.14)}`
                }}
              />
              <Chip
                icon={<InsightsRoundedIcon />}
                label={lastUpdatedLabel}
                size="small"
                sx={{
                  color: "text.primary",
                  bgcolor: alpha("#F2BD42", 0.18),
                  border: `1px solid ${alpha("#F2BD42", 0.28)}`,
                  animation: "heroFloat 4.2s ease-in-out infinite",
                  "& .MuiChip-icon": { color: "#F2BD42" }
                }}
              />
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gap: { xs: 2, lg: 3 },
              gridTemplateColumns: {
                xs: "1fr",
                xl: "minmax(0, 1.1fr) 340px"
              },
              alignItems: "start",
              minWidth: 0,
              width: "100%"
            }}
          >
            <Stack spacing={2.5} sx={{ minWidth: 0, width: "100%" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.15rem", sm: "3.4rem", md: "4.6rem" },
                  maxWidth: { xs: "100%", sm: "30ch", md: "30ch" },
                  lineHeight: { xs: 0.98, sm: 0.92 },
                  letterSpacing: "-0.04em",
                  overflowWrap: "anywhere"
                }}
              >
                Perimeter Watch
              </Typography>

              <Typography
                sx={{
                  maxWidth: { xs: "26ch", sm: "44ch", md: "56ch" },
                  color: "text.secondary",
                  fontSize: { xs: "0.98rem", sm: "1.08rem", md: "1.2rem" },
                  lineHeight: 1.5
                }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  Live perimeter view across Romania sectors.
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Track hot sectors, rising risk, and where operators should
                  focus next.
                </Box>
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ flexWrap: "wrap", display: { xs: "none", sm: "flex" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 0.5,
                    height: 26,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: alpha("#4285F4", 0.06),
                    border: `1px solid ${alpha("#4285F4", 0.1)}`
                  }}
                >
                  {[16, 22, 12, 20, 14].map((height, index) => (
                    <Box
                      key={height}
                      sx={{
                        width: 4,
                        height,
                        borderRadius: 999,
                        bgcolor: index === 3 ? "#D95040" : "#4285F4",
                        transformOrigin: "bottom",
                        animation: `heroBars ${1.4 + index * 0.18}s ease-in-out infinite`
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Sensor net live
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))"
                  },
                  minWidth: 0
                }}
              >
                {heroStats.map((item, index) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: {
                        xs: index < compactHeroStats.length ? "block" : "none",
                        md: "block"
                      },
                      p: 2.35,
                      borderRadius: 4,
                      bgcolor: statToneStyles[item.tone].backgroundColor,
                      border: `1px solid ${statToneStyles[item.tone].borderColor}`,
                      minWidth: 0
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        letterSpacing: "0.08em",
                        fontSize: { xs: "0.68rem", md: "0.75rem" }
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        overflowWrap: "anywhere"
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                sx={{ width: "100%" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  href={`${apiBaseUrl}/docs`}
                  target="_blank"
                  rel="noreferrer"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  size="small"
                  fullWidth
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  API docs
                </Button>
                <Button
                  variant="outlined"
                  href={`${apiBaseUrl}/openapi.json`}
                  target="_blank"
                  rel="noreferrer"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  size="small"
                  fullWidth
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    color: "text.primary",
                    borderColor: alpha("#4285F4", 0.22),
                    "&:hover": {
                      borderColor: alpha("#4285F4", 0.42),
                      backgroundColor: alpha("#4285F4", 0.05)
                    }
                  }}
                >
                  OpenAPI
                </Button>
              </Stack>

              {criticalCount > 0 ? (
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    p: { xs: 1.85, md: 2.1 },
                    borderRadius: 4,
                    bgcolor: alpha("#D95040", 0.1),
                    border: `1px solid ${alpha("#D95040", 0.2)}`
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.28) 45%, transparent 60%)",
                      animation: "alertSweep 3.4s linear infinite"
                    }}
                  />
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Stack direction="row" spacing={1.1} alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#D95040",
                          boxShadow: "0 0 0 8px rgba(217,80,64,0.14)",
                          animation: "heroPulse 1.6s ease-in-out infinite"
                        }}
                      />
                      <Box>
                        <Typography
                          variant="overline"
                          sx={{ color: "#B53A2D", fontWeight: 800 }}
                        >
                          Critical Alert
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {criticalCount} critical sector
                          {criticalCount > 1 ? "s" : ""} detected
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: { xs: "none", sm: "30ch" } }}
                    >
                      Review {summary.peakSector} now.
                    </Typography>
                  </Stack>
                </Box>
              ) : null}
            </Stack>

            <Card
              variant="outlined"
              aria-label="Perimeter index scale"
              sx={{
                bgcolor: alpha("#fff", 0.92),
                borderColor: alpha("#4285F4", 0.12),
                color: "text.primary",
                height: "100%",
                minWidth: 0,
                width: "100%"
              }}
            >
              <CardContent>
                <Stack spacing={{ xs: 1.5, md: 2 }}>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: "primary.main", fontWeight: 700 }}
                    >
                      Perimeter snapshot
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1.15rem", md: "1.25rem" } }}
                    >
                      Average index {summary.averagePerimeterIndex.toFixed(1)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 1,
                      gridTemplateColumns: {
                        xs: "1fr",
                        xl: "repeat(3, minmax(0, 1fr))"
                      },
                      alignItems: "start"
                    }}
                  >
                    {deliverySignals.map((signal) => (
                      <Chip
                        key={signal.label}
                        size="small"
                        label={signal.label}
                        sx={{
                          justifyContent: "center",
                          bgcolor: alpha("#388E3C", 0.08),
                          color: "secondary.dark",
                          height: "auto",
                          py: 0.75,
                          "&::before": {
                            content: '""',
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#388E3C",
                            mr: 0.75,
                            animation: "heroPulse 2.8s ease-in-out infinite"
                          },
                          "& .MuiChip-label": {
                            px: 0,
                            whiteSpace: "normal",
                            textAlign: "center",
                            lineHeight: 1.2,
                            fontSize: { xs: "0.68rem", md: "0.75rem" }
                          }
                        }}
                      />
                    ))}
                  </Box>

                  <Stack spacing={1.25}>
                    {perimeterBands.map((band) => (
                      <Box
                        key={band.label}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "14px minmax(0, 1fr) auto",
                          gap: 1.25,
                          alignItems: "center"
                        }}
                      >
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            bgcolor: band.color
                          }}
                        />
                        <Typography fontWeight={600}>{band.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {band.range}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pt: 0.5, lineHeight: 1.45 }}
                  >
                    Index combines signal severity and incident count for each
                    sector.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
