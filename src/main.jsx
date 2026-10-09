import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TimeProvider } from './context/TimeContext'
import { ThemeProvider } from './context/ThemeContext'
import { CityProvider } from './context/CityContext'
import { CompareProvider } from './context/CompareContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './styles/index.css'
import './styles/pulse.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <TimeProvider>
          <ThemeProvider>
            <CityProvider>
              <CompareProvider>
                <App />
              </CompareProvider>
            </CityProvider>
          </ThemeProvider>
        </TimeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
