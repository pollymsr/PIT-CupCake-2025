// main.tsx (deve estar assim)
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TestAuthProvider } from './context/TestAuthContext'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <TestAuthProvider>
      <App />
    </TestAuthProvider>
  </React.StrictMode>
)