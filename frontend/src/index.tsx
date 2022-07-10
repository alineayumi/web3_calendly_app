import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import { StyledEngineProvider } from '@mui/material'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>
)
