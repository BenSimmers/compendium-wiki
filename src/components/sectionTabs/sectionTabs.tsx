import { useState } from "react";
import { SectionTabPanelProps, TabPanelProps } from "../../utils/types";
import { Box, Tab, Tabs } from "@mui/material";
import * as helpers from "../../helpers/helpers";
import Markdown from "react-markdown";

export const CustomTabPanel: React.FC<TabPanelProps> = ({
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

export const SectionTabs: React.FC<SectionTabPanelProps> = ({ items }) => {
  const [value, setValue] = useState<number>(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="tabs"
        allowScrollButtonsMobile
        variant="scrollable"
      >
        {items.map((item, index) => (
          <Tab
            key={item.id}
            label={item.tabName}
            {...helpers.a11yProps(index)}
          />
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
