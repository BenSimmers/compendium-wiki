import { CompendiumItem, File as fileResponse } from "../utils/types";

const fetchFileContent = async (file: fileResponse): Promise<string> => {
    const response = await fetch(file.url);
    return response.text();
  };
  
  const assignFilesToCompendium = async (
    items: CompendiumItem[],
    files: fileResponse[]
  ) => {
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const regex = new RegExp(`^${item.tabId}-`);
        const file = files.find((f) => regex.test(f.path));
        return file ? { ...item, content: await fetchFileContent(file) } : item;
      })
    );
    return updatedItems;
  };
  

const buildCompendiumHierarchy = (items: CompendiumItem[]) => {
  const itemMap = new Map<number, CompendiumItem>();
  const topLevelItems: CompendiumItem[] = [];

  items.forEach((item) => itemMap.set(item.tabId, item));
  items.forEach((item) => {
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

export { assignFilesToCompendium, buildCompendiumHierarchy };
