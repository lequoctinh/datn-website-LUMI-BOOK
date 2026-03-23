import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import MainLayout from './layouts';
import AdminLayout from './admin/layouts/AdminLayout';



import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Profile from './pages/auth/Profile';
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import ProductDetail from "./pages/product/ProductDetail";
import ProductList from "./pages/product/ProductList";
import Contact from './pages/contact/Contact';
import LiteraryBooks from './pages/ProductsCategory/LiteraryBooks';
import EconomyBooks from './pages/ProductsCategory/EconomyBooks';
import ChildrenBooks from './pages/ProductsCategory/ChildrenBooks'; 
import LanguageBooks from './pages/ProductsCategory/LanguageBooks';
import BiographyBooks from './pages/ProductsCategory/BiographyBooks';
import MentalityBooks from './pages/ProductsCategory/MentalityBooks';

import { CartProvider } from './context/cartContext';

import Dashboard from './admin/pages/Dashboard';
import BookManager from './admin/pages/BookManager';
import CategoryManager from './admin/pages/CategoryManager';
import AuthorManager from './admin/pages/AuthorManager';
import PublisherManager from './admin/pages/PublisherManager';
import CustomerManager from './admin/pages/CustomerManager';



function App() {
  return (
    <CartProvider>
      <ToastContainer 
      position="top-right" autoClose={3000} 
      hideProgressBar={false} 
      newestOnTop={false} 
      closeOnClick rtl={false} 
      pauseOnFocusLoss 
      draggable 
      pauseOnHover 
      theme="light" />

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/category/literature" element={<LiteraryBooks />} />
          <Route path="/category/economy" element={<EconomyBooks/>} />
          <Route path="/category/children" element={<ChildrenBooks />} />
          <Route path="/category/language" element={<LanguageBooks />} />
          <Route path="/category/biography" element={<BiographyBooks />} />
          <Route path="/category/mentality" element={<MentalityBooks />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="authors" element={<AuthorManager />} />
          <Route path="publishers" element={<PublisherManager />} />
          <Route path="customers" element={<CustomerManager />} />
        </Route>
      </Routes>
  </CartProvider>
 
    
  );
}

export default App;