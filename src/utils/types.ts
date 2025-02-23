// Type Definitions
type CompendiumItem = {
  id: string | number;
  tabId: number;
  tabName: string;
  content: string;
  children?: CompendiumItem[];
  parentReferenceId?: number;
};

type File = {
  id: string;
  path: string;
  url: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface SectionTabPanelProps {
  items: CompendiumItem[];
}

interface ColorModeContextType {
  toggleColorMode: () => void;
}

export {
  type CompendiumItem,
  type File,
  type TabPanelProps,
  type SectionTabPanelProps,
  type ColorModeContextType,
};
