import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AuthProvider from './context/authContext' // Import AuthProvider
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';   // Import Toastify CSS

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <>
        <App />
        <ToastContainer autoClose={3000} position="top-right" />
      </>
    </AuthProvider>
  </React.StrictMode>,
)
