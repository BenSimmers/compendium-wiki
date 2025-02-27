// react imports
import { createContext, useEffect } from "react";

// mui imports
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  PaletteMode,
  Theme,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// custom imports
import { useColorMode } from "./hooks/useColorMode";
import { ToggleTheme, CompendiumItem } from "./utils/types.ts";

import * as helpers from "./helpers/helpers.ts";
import { LoadingOrError } from "./components/common/loadingOrError/index.ts";
import { SectionTabs } from "./components/sectionTabs/sectionTabs.tsx";
import { useAppContext } from "./hooks/useAppContext.ts";

const lightTheme: Theme = createTheme({
  palette: { mode: "light" as PaletteMode },
});
const darkTheme: Theme = createTheme({
  palette: { mode: "dark" as PaletteMode },
});

const ToggleThemeContext = createContext<ToggleTheme>({
  toggleColorMode: () => {},
});

const App = () => {
  const { mode, theme, toggleColorMode } = useColorMode({
    lightTheme,
    darkTheme,
  });

  const { isLoading, data, error, compendiumItems, setCompendiumItems } =
    useAppContext();

  useEffect(() => {
    if (data?.content && data?.$files) {
      const formattedItems = data.content.map(
        (item: Omit<CompendiumItem, "content">) => ({
          ...item,
          content: "",
        })
      );
      helpers
        .assignFilesToCompendium(formattedItems, data.$files)
        .then((updatedItems) =>
          setCompendiumItems(helpers.buildCompendiumHierarchy(updatedItems))
        );
    }
  }, [data, setCompendiumItems]);

  if (isLoading || error)
    <LoadingOrError isLoading={isLoading} error={error} />;

  return (
    <ToggleThemeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position="fixed">
          <Toolbar>
            <Grid container alignItems="center">
              <Grid item>
                <Typography variant="h6">Compendium Wiki</Typography>
              </Grid>

              <Grid item sx={{ marginLeft: "auto" }}>
                <IconButton color="inherit" onClick={toggleColorMode}>
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Box sx={{ height: "64px" }} />
        <SectionTabs items={compendiumItems} />
      </ThemeProvider>
    </ToggleThemeContext.Provider>
  );
};

export default App;
