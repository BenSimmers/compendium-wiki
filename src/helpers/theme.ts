import { createTheme, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

const lightTheme: Theme = createTheme({
  palette: { mode: "light" as PaletteMode },
});
const darkTheme: Theme = createTheme({
  palette: { mode: "dark" as PaletteMode },
});

export { lightTheme, darkTheme };
