import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4285F4",
      light: "#7BAAF7",
      dark: "#2B66D9"
    },
    secondary: {
      main: "#388E3C",
      light: "#66BB6A",
      dark: "#2E7D32"
    },
    error: {
      main: "#D95040"
    },
    warning: {
      main: "#F2BD42"
    },
    info: {
      main: "#4285F4"
    },
    background: {
      default: "#FFFFFF",
      paper: "#ffffff"
    },
    text: {
      primary: "#202124",
      secondary: "#5f6368"
    },
    divider: alpha("#4285F4", 0.12)
  },
  shape: {
    borderRadius: 24
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.04em"
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.03em"
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 600,
      textTransform: "none"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 16px 36px rgba(66, 133, 244, 0.08)",
          border: `1px solid ${alpha("#4285F4", 0.1)}`
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999
        }
      }
    }
  }
});
