import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';

import HomePage from './pages/Home/HomePage';
import UserManagement from './pages/Admin/UserManagement'; 
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminInvoices from './pages/Admin/AdminInvoices';
import AdminCategories from './pages/Admin/AdminCategories';
import ProductDetail from './pages/Product/ProductDetail';
import UserProfile from './pages/User/UserProfile';
import CategoryPage from './pages/Category/CategoryPage';
import CartPage from './pages/Cart/CartPage';

import './App.css';

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(userStr);
    if (user.isAdmin === true) {
      return children;
    } else {
      alert("Truy cập bị từ chối! Bạn không có quyền quản trị viên.");
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem('user');
    window.location.href = '/';
  }, []);
  return null;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/collections/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserManagement /></AdminLayout></AdminRoute>} />
          <Route path="/admin/invoices" element={<AdminRoute><AdminLayout><AdminInvoices /></AdminLayout></AdminRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;