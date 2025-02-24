import { Theme } from "@mui/material/styles";
import { useColorMode } from "./useColorMode";
import { createTheme, PaletteMode } from "@mui/material";
import { CompendiumItem, InstantAppSchemaState } from "../utils/types";
import { useEffect, useState } from "react";
import * as helpers from "../helpers/helpers";
import db from "../data/data";
import { AppContext } from "./useAppContext";


const lightTheme: Theme = createTheme({
  palette: { mode: "light" as PaletteMode },
});
const darkTheme: Theme = createTheme({
  palette: { mode: "dark" as PaletteMode },
});


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mode, theme, toggleColorMode } = useColorMode({
    lightTheme,
    darkTheme,
  });
  const {
    isLoading,
    data = {} as InstantAppSchemaState,
    error,
  } = db.useQuery({ content: {}, $files: {} });
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

  return (
    <AppContext.Provider
      value={{
        mode,
        theme,
        toggleColorMode,
        isLoading,
        data,
        error,
        compendiumItems,
        setCompendiumItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
