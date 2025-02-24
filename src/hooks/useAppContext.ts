import React, { createContext } from "react";
import { AppContextType } from "../utils/types";

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
