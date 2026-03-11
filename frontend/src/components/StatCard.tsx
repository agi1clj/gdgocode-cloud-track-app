import { Box, Card, CardContent, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { StatCardDefinition } from "../types";

export function StatCard({ label, value, meta, tone }: StatCardDefinition) {
  const toneMap = {
    blue: { base: "#4285F4", soft: alpha("#4285F4", 0.1) },
    red: { base: "#D95040", soft: alpha("#D95040", 0.1) },
    green: { base: "#388E3C", soft: alpha("#388E3C", 0.1) },
    yellow: { base: "#F2BD42", soft: alpha("#F2BD42", 0.16) }
  } as const;

  const colors = toneMap[tone];

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 146, md: 176 },
        background: `linear-gradient(180deg, #ffffff 0%, ${alpha(colors.base, 0.02)} 100%)`
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3.25 },
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 700, fontSize: { xs: "0.66rem", md: "0.75rem" } }}
        >
          {label}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            mt: 0.75,
            mb: 0.5,
            maxWidth: "8ch",
            fontSize: { xs: "2rem", md: "3rem" }
          }}
        >
          {value}
        </Typography>
        {meta ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: "20ch",
              pr: { xs: 5.5, md: 6.5 },
              fontSize: { xs: "0.8rem", md: "0.875rem" }
            }}
          >
            {meta}
          </Typography>
        ) : null}
        <Box
          sx={{
            position: "absolute",
            right: -26,
            top: -26,
            width: { xs: 86, md: 110 },
            height: { xs: 86, md: 110 },
            borderRadius: "50%",
            bgcolor: colors.soft
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: { xs: 28, md: 32 },
            bottom: { xs: 20, md: 26 },
            display: "grid",
            gap: 1
          }}
        >
          {Array.from({ length: 3 }, (_, index) => (
            <Box
              key={index}
              sx={{
                width: 44 - index * 8,
                height: 5,
                ml: "auto",
                borderRadius: 999,
                bgcolor: index === 0 ? colors.base : alpha(colors.base, 0.32)
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
