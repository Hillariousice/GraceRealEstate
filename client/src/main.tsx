import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AuthProvider from './context/authContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'; // Add this import

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Wrap the entire app in BrowserRouter */}
    <BrowserRouter>
      <AuthProvider>
        <>
          <App />
          <ToastContainer autoClose={3000} position="top-right" />
        </>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)