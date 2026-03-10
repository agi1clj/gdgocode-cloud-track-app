import type { TimeSeriesPoint } from "../types";

export function linePath(
  points: TimeSeriesPoint[],
  width: number,
  height: number
) {
  if (points.length === 0) {
    return "";
  }

  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const stepX = points.length === 1 ? 0 : width / (points.length - 1);

  return points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - (point.value / maxValue) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function areaPath(
  points: TimeSeriesPoint[],
  width: number,
  height: number
) {
  if (points.length === 0) {
    return "";
  }

  const path = linePath(points, width, height);
  return `${path} L ${width} ${height} L 0 ${height} Z`;
}
