import React, { type ReactElement } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import NavBar from './component/NavBar'

interface ColorModeContextType {
  toggleColorMode: () => void;
};

export const ColorModeContext = React.createContext<ColorModeContextType>({ toggleColorMode: () => {} });

function App(): ReactElement {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <CssBaseline />
      <ThemeProvider theme={theme}>

        <NavBar mode={mode} toggleColorMode={colorMode.toggleColorMode}/>

      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
