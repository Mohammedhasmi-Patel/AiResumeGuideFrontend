import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.scss'
import { RouterProvider } from 'react-router'
import { router } from './app.route.jsx'
import { AuthProvider } from './features/auth/context/auth.context.jsx'
import { InterviewProvider } from './features/interview/context/interview.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  </StrictMode>,
)
