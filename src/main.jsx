import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import './index.css'
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ServiceProvider } from './context/ServicesContext.jsx';
import { Provider } from 'react-redux';
import { store } from './store';
 import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CartProvider>
      <WishlistProvider>
        <ServiceProvider>
        <StrictMode>
        <App />
        </StrictMode>
          
           </ServiceProvider>
      </WishlistProvider>
    </CartProvider>
  </Provider>
)
