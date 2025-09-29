import { FC, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { theme as sbiTheme } from "./themes/sbi";
import { theme as hdfcTheme } from "./themes/hdfc";

const themeMap = {
  'sbi': sbiTheme,
  'hdfc': hdfcTheme,
};

// import { createTheme } from "design/theme";

// const themeVars = await fetch('crisil-cllm.com/config/theme/?company=sbi').then(r => r.json());
// const theme = createTheme(themeVars);

import '@mantine/core/styles.css';

export const DesignProvider: FC<{
  children: ReactNode,
  theme: 'sbi' | 'hdfc',
}> = ({
  children,
  theme = 'sbi',
}) => {
  // const themeVars = await fetch('crisil-cllm.com/config/theme/?company=sbi').then(r => r.json());
  // const theme = createTheme(themeVars);
  return (
    <MantineProvider theme={themeMap[theme]}>
      {children}
    </MantineProvider>
  )
};