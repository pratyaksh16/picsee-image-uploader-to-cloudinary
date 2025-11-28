import { createTheme } from "@mui/material";

export const theme = createTheme({
  // 8px grid by default
  spacing: 8,

  typography: {
    // Default body text
    body1: {
      fontSize: "0.9rem", // mobile
      lineHeight: 1.5,
      "@media (min-width:600px)": {
        fontSize: "1rem", // tablet / up
      },
    },
    // Slightly smaller body (e.g. secondary text)
    body2: {
      fontSize: "0.8rem",
      lineHeight: 1.4,
      "@media (min-width:600px)": {
        fontSize: "0.9rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.85rem",
      "@media (min-width:600px)": {
        fontSize: "0.9rem",
      },
    },
  },

  components: {
    // keep your existing overrides
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        // padding only changes with screen size, not layout
        sizeMedium: ({ theme }) => ({
          paddingInline: theme.spacing(1.75),
          paddingBlock: theme.spacing(1),
          "@media (max-width:600px)": {
            paddingInline: theme.spacing(1.25),
            paddingBlock: theme.spacing(0.75),
          },
        }),
      },
    },
    MuiPopover: { defaultProps: { elevation: 1 } },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
          "@media (min-width:600px)": {
            padding: theme.spacing(3),
          },
        }),
      },
    },
  },

  shape: { borderRadius: 16 },
  colorSchemes: {
    dark: true,
  },
});
