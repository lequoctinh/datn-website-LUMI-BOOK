import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import OrderSuccess from './pages/order/OrderSuccess';
import OrderHistory from './pages/order/OrderHistory';
import OrderDetail from './pages/order/OrderDetail';
import MyOrders from './pages/order/MyOrders';
import UpdateOrder from './pages/order/UpdateOrder';

import { CartProvider } from './context/cartContext';

import Dashboard from './admin/pages/Dashboard';
import BookManager from './admin/pages/BookManager';
import CategoryManager from './admin/pages/CategoryManager';
import AuthorManager from './admin/pages/AuthorManager';
import PublisherManager from './admin/pages/PublisherManager';
import CustomerManager from './admin/pages/CustomerManager';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('lumi_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <CartProvider>
      {/* Cấu hình ToastContainer */}
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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* User Routes (Bọc trong Layout chung) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Cần đăng nhập mới vào được các trang dưới đây */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/order-detail/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/update-order/:id" element={<ProtectedRoute><UpdateOrder /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="authors" element={<AuthorManager />} />
          <Route path="publishers" element={<PublisherManager />} />
          <Route path="customers" element={<CustomerManager />} />
        </Route>

        {/* Trang 404 hoặc Redirect nếu sai đường dẫn */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CartProvider>
  );
}

export default App;