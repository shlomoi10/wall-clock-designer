import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import ClockEditor from './components/ClockEditor'

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Assistant, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClockEditor />
    </ThemeProvider>
  )
}

export default App
