import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fdfaf5',
            color: '#3d1f0a',
            border: '1px solid #ffdba3',
            fontFamily: 'Lato, sans-serif',
          },
          success: { iconTheme: { primary: '#f97f0a', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
