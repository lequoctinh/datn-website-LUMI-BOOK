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

import Dashboard from './admin/pages/Dashboard';

function App() {
  return (
    <>
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
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;