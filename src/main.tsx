import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'

import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster 
        position="top-center"
        containerStyle={{
          top: 100,
        }}
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            fontSize: '12px',
            fontWeight: '500',
            padding: '10px 16px',
            maxWidth: '90vw',
          },
        }}
      />
      <App />
    </Provider>
  </StrictMode>,
)
