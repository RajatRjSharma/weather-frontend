import { createTheme, ThemeOptions } from "@mui/material/styles";
import { ButtonProps } from "@mui/material/Button";
import { CSSObject } from "@mui/system";

const common: ThemeOptions = {
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained" as ButtonProps["variant"],
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        } as CSSObject,
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2979ff" },
    secondary: { main: "#ff6d00" },
    background: { default: "#f5f8fa", paper: "#fff" },
    text: { primary: "#102a43", secondary: "#334e68" },
    info: { main: "#0288d1" },
    success: { main: "#2e7d32" },
    warning: { main: "#ed6c02" },
    error: { main: "#d32f2f" },
  },
  ...common,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#82b1ff" },
    secondary: { main: "#ffab40" },
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#e1e1e1", secondary: "#a1a1a1" },
    info: { main: "#0288d1" },
    success: { main: "#81c784" },
    warning: { main: "#ffb74d" },
    error: { main: "#e57373" },
  },
  ...common,
});
