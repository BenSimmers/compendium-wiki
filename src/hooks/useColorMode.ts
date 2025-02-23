import { createTheme, Theme, useMediaQuery } from "@mui/material";
import React from "react";
import { useMemo } from "react";

type useColorModeParams = {
  lightTheme: Theme;
  darkTheme: Theme;
};

type useColorModeReturn = {
  mode: "light" | "dark";
  theme: Theme;
  toggleColorMode: () => void;
};

// export const useColorMode = () => {
export const useColorMode = ({
  lightTheme,
  darkTheme,
}: useColorModeParams): useColorModeReturn => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  React.useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const toggleColorMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo<Theme>(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [darkTheme, lightTheme, mode]
  );

  return { mode, theme, toggleColorMode };
};
