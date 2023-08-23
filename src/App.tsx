import React, { type ReactElement } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline'

import NavBar from './component/NavBar'
import ReadingVisualisation from './component/ReadingVisualisation'

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

        <NavBar toggleColorMode={colorMode.toggleColorMode}/>

        {/* Container for the main contents */}
        <Box component="main"
          sx={{
            backgroundColor: theme.palette.background.default,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {/* Define top and bottom margins */}
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Define inter-row space */}
            <Grid container spacing={2}>
            <Grid item xs={6}>
              <ReadingVisualisation />
            </Grid>

            </Grid>
        
          </Container>
        </Box>

      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
