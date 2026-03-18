import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext'; 
import { CartProvider } from './context/cartContext';
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider> 
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider> 
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)