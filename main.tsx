// main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { TestAuthProvider } from './context/TestAuthContext' // Importe o Provider

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <TestAuthProvider> {/* Envolva o App com o Provider */}
      <App />
    </TestAuthProvider>
  </React.StrictMode>
)