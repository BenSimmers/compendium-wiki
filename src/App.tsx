import Markdown from "react-markdown";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import schema from "../instant.schema.ts";
import React, { createContext } from "react";
import {
  AppBar,
  CssBaseline,
  Grid,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  PaletteMode,
} from "@mui/material";
import { useColorMode } from "./hooks/useColorMode";
import { init } from "@instantdb/react";

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID, schema });

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type files = {
  id: string;
  path: string;
  url: string;
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

type CompendiumItem = {
  id: string | number;
  tabId: number;
  tabName: string;
  content: string;
  children?: CompendiumItem[];
  /**
   * Reference to the parent item e.g. "2" for "2.1" and "2.2"
   */
  parentReferenceId?: number;
};

type SectionTabPanelProps = {
  items: CompendiumItem[];
};

const SectionTabs: React.FC<SectionTabPanelProps> = ({ items }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {items.map((label, index) => (
            <Tab key={index} label={label.tabName} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      {items.map((label, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          <Markdown>{label.content}</Markdown>
          {label.children && <SectionTabs items={label.children} />}
        </CustomTabPanel>
      ))}
    </Box>
  );
};

const lightTheme: Theme = createTheme({
  palette: { mode: "light" as PaletteMode },
});

const darkTheme: Theme = createTheme({
  palette: { mode: "dark" as PaletteMode },
});

// Define context type
interface ColorModeContextType {
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

const App = () => {
  const { mode, theme, toggleColorMode } = useColorMode({
    lightTheme,
    darkTheme,
  });

  const { isLoading, data, error } = db.useQuery({
    content: {},
    $files: {},
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const compendiumItems: CompendiumItem[] = data.content.map(
    (item: Omit<CompendiumItem, "content">) => ({
      ...item,
      content: "",
    })
  );

  const files = data.$files;

  const checkForParent = (items: CompendiumItem[], files: files[]) => {
    assignFileToCompendium(items, files); // Assign files to compendium items

    const itemMap = new Map<number, CompendiumItem>(); // Map to store items by tabId
    const topLevelItems: CompendiumItem[] = []; // Array to store top level items

    items.forEach((item) => itemMap.set(item.tabId, item)); // Populate map with items

    items.forEach((item) => { // Iterate over items and assign children to parent
      if (item.parentReferenceId) {
        const parent = itemMap.get(item.parentReferenceId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(item);
        }
      } else {
        topLevelItems.push(item);
      }
    });

    return topLevelItems;
  };

  const assignFileToCompendium = (
    compendiumItems: CompendiumItem[],
    files: files[]
  ) => {
    // Iterate over files and map them to the corresponding compendium item
    compendiumItems.forEach((item) => {
      const file = files.find((file) => file.path.includes(`${item.tabId}-`)); // Match based on tabId in the path
      if (file) {
        fetch(file.url)
          .then((response) => response.text())
          .then((text) => {
            item.content = text;
          });
      }
    });
  };

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item display="flex" alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="toggle color"
                  onClick={toggleColorMode}
                >
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <Typography variant="h6">Dnd Compendium Wiki</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Box sx={{ height: "64px" }} />
        <SectionTabs items={checkForParent(compendiumItems, files)} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
