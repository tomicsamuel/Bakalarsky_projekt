'use client';

import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: { main: 'rgb(196, 74, 0)' },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </HeroUIProvider>
  );
}
