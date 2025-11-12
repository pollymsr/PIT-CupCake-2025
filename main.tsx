import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TestAuthProvider } from './context/TestAuthContext'
import './index.css'; // ou
import './styles/index.css'; // se estiver em subpasta

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <TestAuthProvider>
      <App />
    </TestAuthProvider>
  </React.StrictMode>
)