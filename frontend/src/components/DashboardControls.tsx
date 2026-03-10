import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import type { ActionState, DashboardScopeOption } from "../types";

type DashboardControlsProps = {
  loadingState: ActionState;
  seedingState: ActionState;
  resettingState: ActionState;
  scope: string;
  scopeOptions: DashboardScopeOption[];
  lastUpdatedLabel: string;
  onSeed: () => void;
  onRefresh: () => void;
  onReset: () => void;
  onScopeChange: (value: string) => void;
};

export function DashboardControls({
  loadingState,
  seedingState,
  resettingState,
  scope,
  scopeOptions,
  lastUpdatedLabel,
  onSeed,
  onRefresh,
  onReset,
  onScopeChange
}: DashboardControlsProps) {
  return (
    <Card component="section">
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 1.5, md: 2 },
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) auto" },
            alignItems: "center"
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1.5, md: 2 }}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
              >
                Control panel
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, display: { xs: "none", sm: "block" } }}
              >
                Zone filter and data actions for the current Cluj-Napoca AQI
                view. {lastUpdatedLabel}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, display: { xs: "block", sm: "none" } }}
              >
                Filter zones and refresh the AQI feed.
              </Typography>
            </Box>

            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", md: 220 },
                width: { xs: "100%", md: "auto" }
              }}
            >
              <InputLabel id="scope-filter-label">Scope</InputLabel>
              <Select
                labelId="scope-filter-label"
                label="Scope"
                value={scope}
                onChange={(event) => {
                  onScopeChange(event.target.value);
                }}
              >
                {scopeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              variant="contained"
              startIcon={<ScienceRoundedIcon />}
              disabled={seedingState === "loading"}
              onClick={onSeed}
              fullWidth
              size="small"
              sx={{ width: { xs: "100%", md: "auto" }, minWidth: { md: 120 } }}
            >
              {seedingState === "loading" ? "Loading scenario..." : "Load"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutorenewRoundedIcon />}
              disabled={loadingState === "loading"}
              onClick={onRefresh}
              fullWidth
              size="small"
              sx={{ width: { xs: "100%", md: "auto" }, minWidth: { md: 120 } }}
            >
              {loadingState === "loading" ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<DeleteOutlineRoundedIcon />}
              disabled={resettingState === "loading"}
              onClick={onReset}
              fullWidth
              size="small"
              sx={{ width: { xs: "100%", md: "auto" }, minWidth: { md: 120 } }}
            >
              {resettingState === "loading" ? "Clearing..." : "Clear"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
