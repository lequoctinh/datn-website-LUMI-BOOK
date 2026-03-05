import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './layouts/index';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Profile from './pages/auth/Profile';
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import ProductDetail from "./pages/product/ProductDetail";
import ProductList from "./pages/product/ProductList";

function App() {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        <Route path="/" element={
          <MainLayout> <Home /> </MainLayout>
        } />
        <Route path="/cart" element={
          <MainLayout> <Cart /> </MainLayout>
        } />
        <Route path="/profile" element={
          <MainLayout> <Profile /> </MainLayout>
        } />
        <Route path="/checkout" element={
          <MainLayout> <Checkout /> </MainLayout>
        } />
        <Route path="/product/:id" element={<MainLayout> <ProductDetail /> </MainLayout>
        } />
        <Route path="/shop" element={<MainLayout> <ProductList /> </MainLayout>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </>
  );
}

export default App;