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

interface ToggleTheme {
  toggleColorMode: () => void;
}

type InstantAppSchemaState = {
  content?: {
    id: string;
    parentReferenceId: number;
    tabId: number;
    tabName: string;
  }[];
  /**
   * files which are uploaded to the instant app
   * @type {File[]}
   * @memberof InstantAppSchemaState
   * @example
   * ```json
   * "files": [
   *  {
   *   "id": "1",
   *   "path": "path/to/file",
   *   "url": "https://example.com/file"
   * }
   */
  $files?: {
    id: string;
    path: string;
    url: string;
  }[];
};

interface AppContextType {
  mode: string;
  theme: object;
  toggleColorMode: () => void;
  isLoading: boolean;
  data: InstantAppSchemaState;
  error: { message: string } | undefined;
  compendiumItems: CompendiumItem[];
  setCompendiumItems: React.Dispatch<React.SetStateAction<CompendiumItem[]>>;
}

export {
  type CompendiumItem,
  type File,
  type TabPanelProps,
  type SectionTabPanelProps,
  type ToggleTheme,
  type InstantAppSchemaState,
  type AppContextType,
};
