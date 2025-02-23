import React, { createContext, useState, useEffect } from "react";
import Markdown from "react-markdown";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  PaletteMode,
  Theme,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorMode } from "./hooks/useColorMode";
import db from "./data/data.ts";
import {
  ColorModeContextType,
  CompendiumItem,
  SectionTabPanelProps,
  TabPanelProps,
} from "./utils/types.ts";

import * as helpers from "./helpers/helpers.ts";

const lightTheme: Theme = createTheme({
  palette: { mode: "light" as PaletteMode },
});
const darkTheme: Theme = createTheme({
  palette: { mode: "dark" as PaletteMode },
});

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

const CustomTabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

const SectionTabs: React.FC<SectionTabPanelProps> = ({ items }) => {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="tabs"
      >
        {items.map((item, index) => (
          <Tab key={item.id} label={item.tabName} {...a11yProps(index)} />
        ))}
      </Tabs>
      {items.map((item, index) => (
        <CustomTabPanel key={item.id} value={value} index={index}>
          <Markdown>{item.content}</Markdown>
          {item.children && <SectionTabs items={item.children} />}
        </CustomTabPanel>
      ))}
    </Box>
  );
};

const App = () => {
  const { mode, theme, toggleColorMode } = useColorMode({
    lightTheme,
    darkTheme,
  });
  const { isLoading, data, error } = db.useQuery({ content: {}, $files: {} });
  const [compendiumItems, setCompendiumItems] = useState<CompendiumItem[]>([]);

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
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Grid container alignItems="center">
              {/* Left-aligned title */}
              <Grid item>
                <Typography variant="h6">Dnd Compendium Wiki</Typography>
              </Grid>

              {/* Pushes the icon button to the right */}
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
    </ColorModeContext.Provider>
  );
};

export default App;
