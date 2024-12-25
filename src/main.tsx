import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { StyledEngineProvider } from '@mui/material';

// יצירת קונפיגורציה ל-RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true
});

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Assistant, Arial, sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          right: 'auto',
          left: 'unset',
          transform: 'none',
          '&.MuiDrawer-paperAnchorRight': {
            right: 0,
            left: 'unset'
          }
        }
      }
    }
  }
});

// הגדרת כיוון RTL לכל האפליקציה
document.dir = 'rtl';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
)
