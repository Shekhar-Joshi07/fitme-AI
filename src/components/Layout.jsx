import { useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Layout() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
  const navigate = useNavigate();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#90caf9" : "#2196f3",
          },
          secondary: {
            main: mode === "dark" ? "#f48fb1" : "#ff4081",
          },
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1100 }}>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Outlet />
    </ThemeProvider>
  );
} 