import { useMemo, useState } from "react";
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
import { areaPath, linePath } from "../lib/charts";
import { formatOneDecimal } from "../lib/formatters";
import type { TimeSeriesPoint } from "../types";

export function LineChart({ points }: { points: TimeSeriesPoint[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const width = 420;
  const height = isMobile ? 132 : 180;
  const strokePath = linePath(points, width, height);
  const fillPath = areaPath(points, width, height);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartPoints = useMemo(() => {
    if (points.length === 0) {
      return [];
    }

    const maxValue = Math.max(...points.map((point) => point.value), 1);
    const stepX = points.length === 1 ? 0 : width / (points.length - 1);

    return points.map((point, index) => ({
      ...point,
      x: index * stepX,
      y: height - (point.value / maxValue) * height
    }));
  }, [height, points, width]);

  const activePoint =
    hoveredIndex === null ? chartPoints.at(-1) : chartPoints[hoveredIndex];
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const labelStep = useMemo(() => {
    if (points.length <= 6) {
      return 1;
    }

    if (isMobile) {
      return Math.ceil(points.length / 4);
    }

    return Math.ceil(points.length / 6);
  }, [isMobile, points.length]);

  function handleChartPointerMove(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const scaledX = (relativeX / bounds.width) * width;

    const closestIndex = chartPoints.reduce(
      (bestIndex, point, index) =>
        Math.abs(point.x - scaledX) <
        Math.abs(chartPoints[bestIndex].x - scaledX)
          ? index
          : bestIndex,
      0
    );

    setHoveredIndex(closestIndex);
  }

  return (
    <Card
      sx={{
        minHeight: 100,
        background:
          "linear-gradient(180deg, rgba(66,133,244,0.05) 0%, rgba(255,255,255,1) 56%)"
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 1.5 }}
        >
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              Perimeter trend
            </Typography>
            <Typography variant="h5">Perimeter index over time</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isMobile
                ? "Hourly perimeter change for the current sector scope."
                : "Hour-by-hour perimeter movement for the selected scope, useful for spotting escalation before a sector turns critical."}
            </Typography>
          </Box>

          {points.length > 0 ? (
            <Box
              sx={{
                minWidth: { xs: "auto", md: 180 },
                p: { xs: 1.85, md: 2.2 },
                borderRadius: 4,
                bgcolor: alpha("#34a853", 0.08),
                border: `1px solid ${alpha("#388E3C", 0.12)}`
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Highest hourly index
              </Typography>
              <Typography
                variant="h4"
                sx={{ mt: 0.5, fontSize: { xs: "1.8rem", md: "2.125rem" } }}
              >
                {formatOneDecimal(maxValue)}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        {points.length === 0 ? (
          <Typography color="text.secondary">
            Load a scenario to render the chart.
          </Typography>
        ) : (
          <>
            {activePoint ? (
              <Box
                aria-live="polite"
                sx={{
                  mb: 1.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 999,
                  bgcolor: "primary.50"
                }}
              >
                <Typography fontWeight={700}>
                  {formatOneDecimal(activePoint.value)} index
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activePoint.label}
                </Typography>
              </Box>
            ) : null}

            <Box
              sx={{
                p: { xs: 1.6, md: 2 },
                borderRadius: 4,
                bgcolor: "#fff",
                border: `1px solid ${alpha("#4285F4", 0.08)}`
              }}
            >
              <Box
                component="svg"
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Perimeter index over time"
                onMouseMove={isMobile ? undefined : handleChartPointerMove}
                onMouseLeave={
                  isMobile
                    ? undefined
                    : () => {
                        setHoveredIndex(null);
                      }
                }
                sx={{ width: "100%", height: "auto", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(66,133,244,0.32)" />
                    <stop offset="100%" stopColor="rgba(66,133,244,0.03)" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    x2={width}
                    y1={height * ratio}
                    y2={height * ratio}
                    stroke={alpha("#4285F4", 0.12)}
                    strokeDasharray="5 7"
                  />
                ))}
                <path d={fillPath} fill="url(#chart-fill)" />
                <path
                  d={strokePath}
                  fill="none"
                  stroke="#4285F4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {chartPoints.map((point, index) => (
                  <g key={point.label}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="14"
                      fill="transparent"
                      onFocus={() => {
                        setHoveredIndex(index);
                      }}
                      onBlur={() => {
                        setHoveredIndex(null);
                      }}
                      tabIndex={0}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={hoveredIndex === index ? "7" : "5"}
                      fill={hoveredIndex === index ? "#388E3C" : "#4285F4"}
                      stroke="#fff"
                      strokeWidth="3"
                    />
                  </g>
                ))}
              </Box>

              <Box
                sx={{
                  mt: 1,
                  display: "grid",
                  gap: 0.5,
                  gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`
                }}
              >
                {points.map((point, index) => (
                  <Typography
                    key={point.label}
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "0.6rem", md: "0.72rem" },
                      lineHeight: 1.1,
                      visibility:
                        index === 0 ||
                        index === points.length - 1 ||
                        index % labelStep === 0
                          ? "visible"
                          : "hidden"
                    }}
                  >
                    {point.label}
                  </Typography>
                ))}
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
