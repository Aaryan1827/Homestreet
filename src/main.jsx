import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CityProvider } from './context/CityContext'
import { CompareProvider } from './context/CompareContext'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CityProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </CityProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
