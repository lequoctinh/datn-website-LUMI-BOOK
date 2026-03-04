import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/index';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;