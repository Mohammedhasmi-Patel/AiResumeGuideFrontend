import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.scss'
import { RouterProvider } from 'react-router'
import { router } from './app.route.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
